import { fetchSamba } from './smb';
import fs from 'fs';
import { rewriteHTML } from './html';
import { PrismaClient } from '@prisma/client';
import EventSource from 'eventsource';

const htmlPath = `${__dirname}/../html`;
const smbPath = `${__dirname}/../tmp/smb`;
const convPath = `${__dirname}/../tmp/conv`;

const prismaClient = new PrismaClient();
const serverStateEvents = new EventSource("http://check-server:80/api/serverState/sse");
serverStateEvents.onmessage = main;
let nextSyncTimeOut: NodeJS.Timeout | null = null;
let serverState: boolean = false;

let refreshInterval = 1000 * 60 // 1 minute
if (process.env.SYNC_INTERVAL) {
    refreshInterval = parseInt(process.env.SYNC_INTERVAL);
}

async function main(event: MessageEvent | null = null) {
    if (event) {
        const curState = JSON.parse(event.data);
        if (nextSyncTimeOut) {
            clearTimeout(nextSyncTimeOut);
        }
        serverState = curState;
    }
    if (serverState) {
        await sync();
        const syncInterval = (await prismaClient.parameter.findUnique({
            where: {
                name: "EVALUATION_SYNC_INTERVAL"
            }
        }))?.numValue;
        if (!syncInterval) {
            nextSyncTimeOut = setTimeout(main, 60000);
        } else {
            nextSyncTimeOut = setTimeout(main, syncInterval);
        }
    }
}

async function sync() {
    const server = (await prismaClient.parameter.findUnique({
        where: {
            name: "MEYTON_SERVER_IP"
        }
    }))?.strValue;
    if (!server) {
        return;
    }
    const syncWorked = await fetchSamba(server, smbPath);
    if (!syncWorked) {
        return;
    }
    await rewriteHTML(smbPath, convPath);
    if (fs.existsSync(htmlPath)) {
        await fs.promises.rm(htmlPath, { recursive: true });
    }
    await fs.promises.mkdir(htmlPath, { recursive: true });
    await fs.promises.cp(convPath, htmlPath, { recursive: true });
}

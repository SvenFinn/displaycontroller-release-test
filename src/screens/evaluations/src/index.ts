import { LocalClient } from "dc-db-local";
import EventSource from 'eventsource';
import { sync } from "./sync";
import path from "path";
import { startServer } from "./server";
import dotenv from "dotenv";
dotenv.config();

const htmlPath = path.resolve(`${__dirname}/../html`);
const smbPath = path.resolve(`${__dirname}/../tmp/smb`);
const convPath = path.resolve(`${__dirname}/../tmp/conv`);

const prismaClient = new LocalClient();

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
        serverState = curState;
    }
    if (serverState) {
        if (nextSyncTimeOut) {
            clearTimeout(nextSyncTimeOut);
        }
        const server = (await prismaClient.parameter.findUnique({
            where: {
                key: "MEYTON_SERVER_IP"
            }
        }))?.strValue;
        if (server) {
            await sync(server, smbPath, convPath, htmlPath);
        }
        const syncInterval = (await prismaClient.parameter.findUnique({
            where: {
                key: "EVALUATION_SYNC_INTERVAL"
            }
        }))?.numValue;
        if (!syncInterval) {
            nextSyncTimeOut = setTimeout(main, 60000);
        } else {
            nextSyncTimeOut = setTimeout(main, syncInterval);
        }
    }
}

startServer(htmlPath);

process.on("SIGTERM", function () {
    process.exit(0);
})
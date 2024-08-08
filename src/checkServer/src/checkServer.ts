import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";
import { AdvServerState } from "./types";
import { pino } from "pino";
import dotenv from "dotenv";
dotenv.config();

const logger = pino({
    level: "info",
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
        },
    },
});

const prismaClient = new PrismaClient();

export async function checkServiceAvailability(): Promise<AdvServerState> {
    logger.debug("Fetching server information");
    const server = (await prismaClient.parameter.findUnique({
        where: {
            name: "MEYTON_SERVER_IP"
        }
    }))?.strValue;
    if (!server) {
        return {
            online: false
        };
    }
    const user = "meyton";
    const pass = "mc4hct";
    const commands = 'echo "[VERSION]";' +
        'cat /etc/meyton/shootmaster.version | grep -P "Date=";' +
        'cat /etc/meyton/shootmaster.version | grep -P "Version=";' +
        'echo "[DAEMONS]";' +
        'cat /etc/meyton/shootmasterd.cfg | grep -P "RealServerDaemons=";';
    let output = "";
    try {
        output = execSync(`sshpass -p "${pass}" ssh -o ConnectTimeout=1 -o StrictHostKeyChecking=no ${user}@${server} '${commands}'`, { encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] });
    } catch (e) {
        logger.error("Error while checking server availability: " + e);
        return {
            online: false,
        }
    }
    const outLines = output.split("\n");
    const serverState: AdvServerState = {
        online: true,
        version: "",
        compatible: false,
        services: {
            ssmdb2: false
        }
    };
    let key = "", linesSinceKey = 0;
    for (let i = 0; i < outLines.length; i++) {
        linesSinceKey++;
        if (outLines[i].match(/^\[.*\]/gi)) {
            key = outLines[i].replace(/\[|\]/gi, "").toLowerCase();
            linesSinceKey = 0;
        } else {
            if (key == "version") {
                switch (linesSinceKey) {
                    case 1:
                        const versionStr = outLines[i].split("=")[1];
                        const versionDate = new Date(0);
                        const versionStrSplit = versionStr.split(".").map((value) => parseInt(value));
                        versionDate.setFullYear(versionStrSplit[2], versionStrSplit[1] - 1, versionStrSplit[0]);
                        serverState.compatible = checkServerCompatibility(versionDate);
                        break;
                    case 2:
                        const versionText = outLines[i].split("=")[1]
                        serverState.version = versionText
                        break;
                }
            } else if (key == "daemons" && linesSinceKey == 1) {
                const daemonStr = outLines[i].split("=")[1]
                serverState.services.ssmdb2 = daemonStr.match("targetd_ssmdb2") != null;
            }
        }
    }
    return serverState;
}

export async function checkServerAvailable(): Promise<boolean> {
    logger.debug("Checking server availability");
    const server = (await prismaClient.parameter.findUnique({
        where: {
            name: "MEYTON_SERVER_IP"
        }
    }))?.strValue;
    if (!server) {
        return false;
    }
    try {
        execSync("nc -zw 1 " + server + " 22", { encoding: "utf-8" });
        return true
    } catch (e) {
        return false
    }
}

function checkServerCompatibility(version: Date): boolean {
    if (!process.env.MAX_MEYTON_VERSION || !process.env.MIN_MEYTON_VERSION) {
        logger.error("Environment variables MAX_MEYTON_VERSION and MIN_MEYTON_VERSION must be set");
        return false;
    }
    if (version.getTime() <= parseInt(process.env.MAX_MEYTON_VERSION) && version.getTime() >= parseInt(process.env.MIN_MEYTON_VERSION)) {
        return true;

    }
    logger.warn("Meyton server version is not compatible");
    return false;
}
import { checkServerAvailable, checkServiceAvailability } from "./checkServer";
import { updateServerInfo } from "./webServer";
import pino from "pino";
import { AdvServerState } from "./types";

const logger = pino({
    level: "info",
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
        },
    },
});

let serverState: boolean | null;

async function main() {
    const serverOnline = await checkServerAvailable();
    if (serverState != serverOnline) {
        logger.info(`Server Availability changed to ${serverOnline}`)
        serverState = serverOnline;
        if (serverOnline) {
            const serverInfo = await checkServiceAvailability();
            updateServerInfo(serverInfo);
        } else {
            updateServerInfo({
                online: false
            });
        }
    }
}

setInterval(main, 2000);

process.on("SIGTERM", function () {
    process.exit(0);
})
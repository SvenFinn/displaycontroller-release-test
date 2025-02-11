import { ChildProcess } from "child_process";
import { LocalClient } from "dc-db-local";
import dotenv from "dotenv";
import { EventSource } from "eventsource";
import fs from "fs";
import { spawn } from "node:child_process";
import { EventEmitter } from "node:events";
import { parseLine } from "./parseLine";
import { logger } from "dc-logger";

dotenv.config();

const localClient = new LocalClient();

if (!process.env.MEYTON_SSH_USER || !process.env.MEYTON_SSH_PASS) {
    throw new Error("Missing environment variables");
}

export class LogReader extends EventEmitter {
    private readonly serverStateSSE: EventSource;
    private sshThread: ChildProcess | null = null;

    constructor() {
        super();
        this.serverStateSSE = new EventSource(`http://check-server/api/serverState/sse`);
        this.serverStateSSE.onmessage = this.onServerState.bind(this);
    }

    private async onServerState(event: MessageEvent) {
        logger.info("Received server state");
        const serverState = JSON.parse(event.data);
        if (serverState) {
            if (!this.sshThread) {
                this.sshThread = await this.startSSH();
            }
        } else {
            this.stopSSH();
        }
    }

    private async startSSH(): Promise<ChildProcess> {
        const script = fs.readFileSync(`${__dirname}/range-logs.sh`, "utf-8");
        const serverIpQuery = await localClient.parameter.findUnique({
            where: {
                key: "MEYTON_SERVER_IP",
            }
        });
        const serverIp = serverIpQuery?.strValue;
        if (!serverIp) {
            throw new Error("Missing server IP");
        }
        const sshThread = spawn("sshpass", ["-p", process.env.MEYTON_SSH_PASS as string, "ssh", "-o", "StrictHostKeyChecking=no", `${process.env.MEYTON_SSH_USER}@${serverIp}`, script]);
        sshThread.on("error", async (error) => {
            logger.error("SSH error", error);
            this.sshThread?.kill();
            this.sshThread = await this.startSSH();
        });
        sshThread.on("exit", (code) => {
            this.sshThread = null;
            logger.info("SSH exit", code);
        });
        let dataBuffer: string = "";
        sshThread.stdout?.on("data", (data: any) => {
            logger.debug("Received log data");
            dataBuffer += data.toString();
            const splitBuffer = dataBuffer.split("\n");
            while (splitBuffer.length > 1) {
                this.parseData(splitBuffer.shift() as string);
            }
            dataBuffer = splitBuffer.join("\n");
        });
        return sshThread;
    }

    private stopSSH() {
        this.sshThread?.kill();
        this.sshThread = null;
    }

    private parseData(data: string) {
        const lines = data.split("\n");
        for (const line of lines) {
            if (line === "") {
                continue;
            }
            if (line.includes("LOG_RESET")) {
                logger.warn("Received log reset");
                this.emit("reset");
                continue;
            }
            const parsedLine = parseLine(line);
            if (parsedLine) {
                this.emit("data", parsedLine);
            }
        }
    }
}

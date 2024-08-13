import { execSync } from "child_process"
import dotenv from "dotenv";
import pino from "pino";
import EventSource from "eventsource";
import { LocalClient, createLocalClient } from "dc-db-local";
import { SmdbClient, createSMDBClient } from "dc-db-smdb";
import { CurrentTimestamp } from "./types";
dotenv.config();

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  }
});

let localPrismaClient: LocalClient | null = null;

let syncTimeout: NodeJS.Timeout | null = null;

async function main() {
  localPrismaClient = await createLocalClient();
  const syncEnabled = (await localPrismaClient.parameter.findUnique({
    where: {
      key: "ENABLE_TIME_SYNC"
    }
  }))?.boolValue;
  if (!syncEnabled) {
    logger.info("Time sync is disabled")
    return;
  }
  const eventSource = new EventSource("http://check-server:80/api/serverState/sse");
  eventSource.onopen = () => {
    logger.info("Connected to server state SSE")
  }
  eventSource.onmessage = async (event) => {
    if (syncTimeout) {
      clearTimeout(syncTimeout);
    }
    const serverState = JSON.parse(event.data);
    if (serverState) {
      loop();
    }
  }
}

async function loop() {
  logger.info("Syncing time");
  if (!localPrismaClient) {
    localPrismaClient = await createLocalClient();
  }
  const smdbClient = await createSMDBClient(localPrismaClient);
  let timestampQuery: CurrentTimestamp[] = [];
  try {
    timestampQuery = (await smdbClient.$queryRaw`SELECT CURRENT_TIMESTAMP;`) as CurrentTimestamp[];
  } catch (e) {
    logger.error(e);
  }
  if (timestampQuery.length > 0) {
    const date = timestampQuery[0].CURRENT_TIMESTAMP;
    execSync(`date -s @${Math.round(date.getTime() / 1000)}`);
  }
  const syncInterval = (await localPrismaClient.parameter.findUnique({
    where: {
      key: "TIME_SYNC_INTERVAL"
    }
  }))?.numValue;

  syncTimeout = setTimeout(loop, syncInterval || 60000);
  smdbClient.$disconnect();
}

main();

process.on("SIGTERM", () => {
  if (localPrismaClient) {
    localPrismaClient.$disconnect();
  }
  process.exit(0);
});
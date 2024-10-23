import { TableWatcherFast } from "dc-table-watcher"
import { createSSMDB2Client, Ssmdb2Client } from "dc-db-ssmdb2"
import { getRangeData } from "./rangeData";
import amqp from "amqplib";
import pino from "pino";

const logger = pino({
    level: process.env.LOG_LEVEL || "info",
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
        },
    },
});

let lastRangeStates: Record<number, string> = {};

async function main() {
    const connection = await amqp.connect("amqp://rabbitmq");
    const channel = await connection.createChannel();
    await channel.assertExchange("ranges.ssmdb2", "fanout", {
        durable: false,
    });
    const ssmdb2Client = await createSSMDB2Client();
    const tableWatcher = new TableWatcherFast(ssmdb2Client, ["Scheiben", "Treffer"], 10000, 100, 30000);
    tableWatcher.on('change', async (tables: string[]) => {
        logger.info("Change detected, refreshing ranges");
        const localTime = new Date((new Date()).setMinutes((new Date()).getMinutes() - new Date().getTimezoneOffset()));
        const targets = await ssmdb2Client.target.findMany(
            {
                where: {
                    timestamp:
                    {
                        gt: new Date(localTime.getTime() - 30000)
                    }
                },
                select: {
                    rangeId: true,
                    id: true,
                    timestamp: true,
                },
                orderBy: {
                    timestamp: 'desc'
                },
                distinct: ['rangeId'],
            });
        await Promise.all(targets.map(async (target) => {
            const rangeData = await getRangeData(ssmdb2Client, target.id);
            if (rangeData === null) {
                return;
            }
            if (lastRangeStates[rangeData.rangeId] === JSON.stringify(rangeData)) {
                return;
            }
            lastRangeStates[rangeData.rangeId] = JSON.stringify(rangeData);
            setTimeout(() => {
                delete lastRangeStates[rangeData.rangeId];
            }, 10000);

            channel.publish("ranges.ssmdb2", "", Buffer.from(JSON.stringify(rangeData)));
        }));
    });
    await tableWatcher.start();
}

main();

process.on("SIGTERM", () => {
    process.exit(0);
});
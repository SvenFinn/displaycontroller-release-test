import { TableWatcherFast } from "dc-table-watcher"
import { createSSMDB2Client } from "dc-db-ssmdb2"
import amqp from "amqplib";
import { logger } from "dc-logger";

import "./cache/updater"; // Import the cache updater
import { getRanges } from "./rangeData";
import { InternalRange } from "@shared/ranges/internal";

const lastRangeStates: Map<number, string> = new Map();
const nextRangeStateTimeouts: Map<number, NodeJS.Timeout> = new Map();

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
        const ranges = await getRanges(ssmdb2Client);
        for (let i = 0; i < ranges.length; i++) {
            const rangeData = ranges[i];
            if (nextRangeStateTimeouts.has(rangeData.rangeId)) {
                logger.warn("Fast change, cancelling update");
                clearTimeout(nextRangeStateTimeouts.get(rangeData.rangeId));
                nextRangeStateTimeouts.delete(rangeData.rangeId);
            }
            if (lastRangeStates.get(rangeData.rangeId) === JSON.stringify(rangeData)) {
                continue;
            }
            nextRangeStateTimeouts.set(rangeData.rangeId, setTimeout((rangeState: InternalRange) => {
                nextRangeStateTimeouts.delete(rangeState.rangeId);
                if (lastRangeStates.get(rangeState.rangeId) === JSON.stringify(rangeState)) {
                    return;
                }
                lastRangeStates.set(rangeState.rangeId, JSON.stringify(rangeState));
                logger.debug("Publishing range state for range " + rangeState.rangeId);
                channel.publish("ranges.ssmdb2", "", Buffer.from(JSON.stringify(rangeState)));
            }, 300, rangeData));
        }
    });
    await tableWatcher.start();
    setInterval(() => {
        lastRangeStates.forEach((value, key) => {
            lastRangeStates.delete(key);
        })
    }, 10000);
}


main();

import { LogReader } from "./logReader";
import { RangeGen } from "./rangeGen";
import amqp from "amqplib";
import { isInternalRange } from "@shared/ranges/internal";
import { logger } from "./logger";

import "./cache/updater"; // Import the updater to start the caching

const ranges = new Map<number, RangeGen>();

async function main() {
    logger.info("Connecting to rabbitmq");
    const connection = await amqp.connect("amqp://rabbitmq");
    const logChannel = await connection.createChannel();
    await recvMultiCast(await connection.createChannel(), logChannel);
    await logChannel.assertExchange("ranges.log", "fanout", {
        durable: false,
    });
    const logReader = new LogReader();
    logReader.on("data", async (data) => {
        const rangeId = data.rangeId;
        const range = getRangeGen(rangeId);
        range.addLogLine(data);
        await range.sendRange(logChannel);
    });
}

function getRangeGen(rangeId: number): RangeGen {
    if (!ranges.has(rangeId)) {
        ranges.set(rangeId, new RangeGen(rangeId));
    }
    const range = ranges.get(rangeId);
    if (!range) {
        throw new Error("Range not found");
    }
    return range;
}

async function recvMultiCast(channel: amqp.Channel, logChannel: amqp.Channel) {
    await channel.assertExchange("ranges.multicast", "fanout", {
        durable: false,
    });
    const queue = await channel.assertQueue("", {
        exclusive: true,
    });
    channel.bindQueue(queue.queue, "ranges.multicast", "");
    channel.consume(queue.queue, async (msg) => {
        if (msg === null) {
            return;
        }
        const message = JSON.parse(msg.content.toString());
        if (isInternalRange(message)) {
            const range = getRangeGen(message.rangeId);
            range.setMulticastInfo(message);
            await range.sendRange(logChannel);
        } else {
            logger.error("Received invalid multicast message");
        }
        channel.ack(msg);
    });
}

main();

process.on("SIGTERM", () => {
    process.exit(0);
});
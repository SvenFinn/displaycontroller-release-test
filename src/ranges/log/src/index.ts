import { LogReader } from "./logReader";
import { RangeGen } from "./rangeGen";
import { LocalClient } from "dc-db-local";
import amqp from "amqplib";
import { isInternalRange } from "@shared/ranges/internal";
import { logger } from "./logger";

const ranges = new Map<number, RangeGen>();
const localClient = new LocalClient();

async function main() {
    logger.info("Connecting to rabbitmq");
    const connection = await amqp.connect("amqp://rabbitmq");
    const logChannel = await connection.createChannel();
    await recvMultiCast(await connection.createChannel(), logChannel);
    await logChannel.assertExchange("ranges.log", "fanout", {
        durable: false,
    });
    const connector = new LogReader(localClient);
    connector.on("data", async (data) => {
        if (!ranges.has(data.rangeId)) {
            ranges.set(data.rangeId, new RangeGen(data.rangeId, localClient));
        }
        const range = ranges.get(data.rangeId);
        if (!range) {
            return;
        }
        range.addLogLine(data);
        await range.sendRange(logChannel);
    });
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
            if (!ranges.has(message.rangeId)) {
                ranges.set(message.rangeId, new RangeGen(message.rangeId, localClient));
            }
            const range = ranges.get(message.rangeId);
            if (!range) {
                return;
            }
            range.setMulticastInfo(message);
            await range.sendRange(logChannel);
        }
        channel.ack(msg);
    });
}

main();

process.on("SIGTERM", () => {
    process.exit(0);
});
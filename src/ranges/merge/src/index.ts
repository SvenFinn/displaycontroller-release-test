import "./cache/updater";// Import to update the cache
import "./server";// Import to start the server


import amqp from "amqplib";
import { rangeManager } from "./rangeMan";
import { logger } from "dc-logger";

async function start() {
    const connection = await amqp.connect("amqp://rabbitmq");
    const channel = await connection.createChannel();
    await channel.assertExchange("ranges.multicast", "fanout", {
        durable: false,
    });
    await channel.assertExchange("ranges.log", "fanout", {
        durable: false,
    });
    await channel.assertExchange("ranges.ssmdb2", "fanout", {
        durable: false,
    });
    const queue = await channel.assertQueue("", {
        exclusive: true,
        autoDelete: true
    });
    await channel.bindQueue(queue.queue, "ranges.multicast", "");
    await channel.bindQueue(queue.queue, "ranges.log", "");
    await channel.bindQueue(queue.queue, "ranges.ssmdb2", "");
    await channel.consume(queue.queue, (msg) => {
        if (msg === null) {
            return;
        }
        const message = JSON.parse(msg.content.toString());
        rangeManager.setData(message);
        channel.ack(msg);
    });
    logger.info("Connected to RabbitMQ");
}

start();

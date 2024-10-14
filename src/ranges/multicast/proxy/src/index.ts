import { createSocket, RemoteInfo } from "dgram";
import pino from "pino";
import { RangeProxyType } from "./types";
import amqp from "amqplib";
import { decode } from "iconv-lite";

const logger = pino({
    level: process.env.LOG_LEVEL || "debug",
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
});

async function main() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertQueue("ranges.multicast.proxy", {
        durable: false,
        autoDelete: true,
        messageTtl: 30000
    });

    const client = createSocket("udp4");
    client.on("listening", function () {
        client.setMulticastTTL(128);
        try {
            client.addMembership("2224.0.0.1");
        } catch (e) {
        }
        const address = client.address();
        logger.info('UDP Client listening on ' + address.address + ":" + address.port);
    });
    client.on("message", function (message: Buffer, remote: RemoteInfo) {
        if (remote.family !== "IPv4") {
            logger.warn("Received message from non-IPv4 address");
            return;
        }
        if (message.length < 3600) {
            logger.debug("Discarding small message");
            return;
        }
        const messageStr = decode(message, 'windows-1252');
        const proxiedMessage: RangeProxyType = {
            ip: remote.address,
            message: Buffer.from(messageStr).toString("base64")
        }
        logger.info(`Received message from ${remote.address}:${remote.port}`);
        channel.sendToQueue("ranges.multicast.proxy", Buffer.from(JSON.stringify(proxiedMessage)));
    });
    client.on("error", function (error) {
        logger.error(error);
        process.exit();
    });
    client.bind(49497, "0.0.0.0");

}

main();

process.on('SIGTERM', function () {
    process.exit();
});
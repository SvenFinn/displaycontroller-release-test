import { PrismaClient } from '@prisma/client';
import pino from 'pino';

const logger = pino({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
        },
    },
});

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.parameter.count();
    if (count > 0) {
        logger.info("Database already seeded, skipping");
        return;
    }
    logger.info("Seeding parameters");
    await prisma.parameter.createMany({
        data: [
            { name: "MEYTON_SERVER_IP", strValue: "192.168.10.200" },
            { name: "ENABLE_TIME_SYNC", boolValue: true },
            { name: "EVALUATION_SYNC_INTERVAL", numValue: 60000 },
        ]
    });
    logger.info("Seeding complete");
    await prisma.$disconnect();
}

main().catch(e => {
    logger.error(e);
    throw e;
}).finally(async () => {
    await prisma.$disconnect();
});
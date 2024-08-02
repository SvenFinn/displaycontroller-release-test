import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.parameter.count();
    if (count > 0) {
        console.log("Parameters already seeded, skipping...");
        return;
    }
    await prisma.parameter.createMany({
        data: [
            { name: "MEYTON_SERVER_IP", strValue: "192.168.10.200" },
            { name: "ENABLE_TIME_SYNC", boolValue: true },
        ]
    });
    await prisma.$disconnect();
}

main().catch(e => {
    throw e;
}).finally(async () => {
    await prisma.$disconnect();
});
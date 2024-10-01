import { getDisciplineCache } from "./discipline";
import { getStartListCache } from "./startList";
import { getShooterCache } from "./shooter";
import { createSMDBClient, SmdbClient } from "dc-db-smdb";
import { TableWatcher } from "dc-table-watcher"
import { LocalClient, createLocalClient } from "dc-db-local";
import { logger } from "./logger";



const tables = [
    "Starterlisten",
    "Preisscheiben",
    "Disziplin",
    "Durchgang",
    "Scheibenbeschreibung",
    "Ringe",
    "Schuetze",
]

let smdbClient: SmdbClient | null = null;
let localClient: LocalClient | null = null;

async function init() {
    logger.info("Starting cache");
    localClient = await createLocalClient();
    smdbClient = await createSMDBClient(localClient);
    const tableWatcher = new TableWatcher(smdbClient, tables, 10000);
    tableWatcher.on("change", async (tables: string[]) => {
        await Promise.all([
            updateDisciplineCache(),
            updateStartListCache(),
            updateShooterCache(),
        ]);
    });
    await tableWatcher.start();
}



async function updateDisciplineCache() {
    logger.info("Updating discipline cache");
    const disciplines = await getDisciplineCache(smdbClient as SmdbClient);
    for (const discipline of disciplines) {
        await localClient?.cache.upsert({
            where: {
                type_key: {
                    type: "discipline",
                    key: discipline.id,
                }
            },
            create: {
                type: "discipline",
                key: discipline.id,
                value: discipline,
            },
            update: {
                value: discipline,
            }
        });
    }
    await localClient?.cache.deleteMany({
        where: {
            type: "discipline",
            NOT: {
                key: {
                    in: disciplines.map(discipline => discipline.id),
                }
            }
        }
    });
    logger.info(`Discipline cache: ${disciplines.length} disciplines`);
}

async function updateStartListCache() {
    logger.info("Updating start list cache");
    const startList = await getStartListCache(smdbClient as SmdbClient);
    for (const start of startList) {
        await localClient?.cache.upsert({
            where: {
                type_key: {
                    type: "startList",
                    key: start.id,
                }
            },
            create: {
                type: "startList",
                key: start.id,
                value: start,
            },
            update: {
                value: start,
            }
        });
    }
    await localClient?.cache.deleteMany({
        where: {
            type: "startList",
            NOT: {
                key: {
                    in: startList.map(start => start.id),
                }
            }
        }
    });
    logger.info(`Start list cache: ${startList.length} start lists`);
}

async function updateShooterCache() {
    logger.info("Updating shooter cache");
    const shooters = await getShooterCache(smdbClient as SmdbClient);
    for (const shooter of shooters) {
        await localClient?.cache.upsert({
            where: {
                type_key: {
                    type: "shooter",
                    key: shooter.id || 0,
                }
            },
            create: {
                type: "shooter",
                key: shooter.id || 0,
                value: shooter,
            },
            update: {
                value: shooter,
            }
        });
    }
    await localClient?.cache.deleteMany({
        where: {
            type: "shooter",
            NOT: {
                key: {
                    in: shooters.map(shooter => shooter.id).filter(id => id !== null) as number[],
                }
            }
        }
    });
    logger.info(`Shooter cache: ${shooters.length} shooters`);
}

init();

process.on("SIGTERM", async () => {
    logger.info("Stopping cache");
    await localClient?.$disconnect();
    await smdbClient?.$disconnect();
    process.exit(0);
});
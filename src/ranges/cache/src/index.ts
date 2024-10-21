import { getDisciplineCache } from "./discipline";
import { getStartListCache } from "./startList";
import { getShooterCache } from "./shooter";
import { createSMDBClient, SmdbClient } from "dc-db-smdb";
import { TableWatcher } from "dc-table-watcher"
import { LocalClient, createLocalClient } from "dc-db-local";
import { logger } from "./logger";
import { Discipline } from "@shared/ranges/discipline";
import { StartList } from "@shared/ranges/startList";
import { Shooter } from "@shared/ranges/shooter";
import { getOverrideDisciplines } from "./overrideDisciplines";
import { OverrideDiscipline } from "@shared/ranges/internal/startList";

const tables = [
    "Starterlisten", // startList
    "Preisscheiben", // priceShooting
    "Disziplin", // discipline
    "Durchgang", // rounds
    "Scheibenbeschreibung", //targetLayout
    "Ringe", // rings
    "Schuetze", // shooter
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
            updateOverrideDisciplineCache(),
        ]);
    });
    await tableWatcher.start();
}



async function updateDisciplineCache() {
    logger.info("Updating discipline cache");
    const disciplines = await getDisciplineCache(smdbClient as SmdbClient);
    await writeCache("discipline", disciplines);
}

async function updateStartListCache() {
    logger.info("Updating start list cache");
    const startLists = await getStartListCache(smdbClient as SmdbClient);
    await writeCache("startList", startLists);
}

async function updateShooterCache() {
    logger.info("Updating shooter cache");
    const shooters = await getShooterCache(smdbClient as SmdbClient);
    await writeCache("shooter", shooters);
}

async function updateOverrideDisciplineCache() {
    logger.info("Updating override discipline cache");
    const overrideDisciplines = await getOverrideDisciplines(smdbClient as SmdbClient);
    await writeCache("overrideDiscipline", overrideDisciplines);
}

async function writeCache(type: "shooter" | "startList" | "discipline" | "overrideDiscipline", cache: Array<Shooter> | Array<StartList> | Array<Discipline> | Array<OverrideDiscipline>) {
    await Promise.all(cache.map(async item => {
        await localClient?.cache.upsert({
            where: {
                type_key: {
                    type: type,
                    key: item.id || 0,
                }
            },
            create: {
                type: type,
                key: item.id || 0,
                value: item,
            },
            update: {
                value: item,
            }
        });
    }));
    await localClient?.cache.deleteMany({
        where: {
            type: type,
            NOT: {
                key: {
                    in: cache.map(item => item.id || 0),
                }
            }
        }
    });
    logger.info(`${type} cache: ${cache.length} items`);
}

init();

process.on("SIGTERM", async () => {
    logger.info("Stopping cache");
    await localClient?.$disconnect();
    await smdbClient?.$disconnect();
    process.exit(0);
});
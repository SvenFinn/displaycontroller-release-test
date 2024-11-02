import { updateDisciplines } from "./discipline";
import { updateStartList } from "./startList";
import { updateShooters } from "./shooter";
import { LocalClient } from "dc-db-local";
import { logger } from "./logger";

const client = new LocalClient();

async function update() {
    logger.info("Updating caches");
    await Promise.all([
        updateDisciplines(client),
        updateStartList(client),
        updateShooters(client)
    ]);
    setTimeout(update, 60000);
}

update();
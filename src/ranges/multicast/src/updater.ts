import { updateDisciplines } from "./discipline";
import { updateStartList } from "./startList";
import { updateShooters } from "./shooter";
import { LocalClient } from "dc-db-local";
import { logger } from "./logger";

const client = new LocalClient();

async function update() {
    logger.info("Updating disciplines, start list and shooters");
    await updateDisciplines(client);
    await updateStartList(client);
    await updateShooters(client);
    setTimeout(update, 60000);
}

update();
import { logger } from "../logger";
import { updateOverrides } from "./overrides";
import { updateShooters } from "./shooter";
import { LocalClient } from "dc-db-local";

const localClient = new LocalClient();

async function updateCaches() {
    logger.info("Updating caches");
    await updateOverrides(localClient);
    await updateShooters(localClient);
    setTimeout(updateCaches, 60000);
}

updateCaches();

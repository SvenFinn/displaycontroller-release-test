import { updateOverrides } from "./overrides";
import { LocalClient } from "dc-db-local";
import { logger } from "dc-logger";

const localClient = new LocalClient();

async function updateCaches() {
    logger.info("Updating caches");
    await updateOverrides(localClient);
    setTimeout(updateCaches, 60000);
}

updateCaches();
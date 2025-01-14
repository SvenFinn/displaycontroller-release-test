import { LocalClient } from "dc-db-local";
import { resolvePreset } from "./presets";
import { isDbScreen } from "@shared/screens";
import { Screen } from "@shared/screens";
import { checkCondition } from "./conditions";
import { logger } from "dc-logger";

export async function loadNextScreen(localClient: LocalClient, currentScreenId: number): Promise<Array<Screen>> {
    let loopOne = true;
    while (true) {
        const nextScreen = await localClient.screens.findFirst({
            where: {
                id: {
                    gt: currentScreenId
                }
            },
            orderBy: {
                id: "asc"
            },
            select: {
                id: true
            }
        });
        if (!nextScreen) {
            if (!loopOne) {
                return [{
                    available: false
                }]; // We have looped through all screens and found no new screen
            }
            loopOne = false;
            currentScreenId = 0;
            continue
        }
        logger.info(`Found screen with id ${nextScreen.id} for old screen id ${currentScreenId}`);
        const nextScreenId = nextScreen.id;
        currentScreenId = nextScreenId; // Update currentScreenId for next iteration
        if (! await checkCondition(localClient, nextScreenId)) {
            continue;
        }
        logger.info(`Found screen with id ${nextScreenId}`);
        const parsedScreen = await loadScreen(localClient, nextScreenId);
        if (parsedScreen.length > 0) {
            return parsedScreen;
        }
    }
}

export async function loadScreen(localClient: LocalClient, screenId: number): Promise<Array<Screen>> {
    const newDb = await localClient?.screens.findFirst({
        where: {
            id: screenId
        }
    });
    if (!newDb) {
        return [];
    }
    if (!isDbScreen(newDb)) {
        return [];
    }
    return await resolvePreset(newDb) || [];
}
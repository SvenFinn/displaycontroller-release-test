import { LocalClient } from "dc-db-local";
import { resolvePreset } from "../presets";
import { isDbScreen } from "@shared/screens";
import { Screen } from "@shared/screens";
import { checkCondition } from "../conditions";
import { logger } from "dc-logger";

export async function loadNextScreen(localClient: LocalClient, currentScreenId: number): Promise<Array<Screen>> {
    let nextScreenId = currentScreenId;
    let loopOne = true;
    while (true) {
        const nextScreen = await localClient.screens.findFirst({
            where: {
                id: {
                    gt: nextScreenId
                }
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
            nextScreenId = 0;
            continue
        }
        if (nextScreen.id === currentScreenId) {
            return [{
                available: false
            }]; // We have looped through all screens and found no new screen
        }
        nextScreenId = nextScreen.id;
        if (!checkCondition(localClient, nextScreenId)) {
            continue;
        }
        return await loadScreen(localClient, nextScreenId);
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
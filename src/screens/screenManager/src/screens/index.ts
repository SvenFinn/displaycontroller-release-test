import { createLocalClient, LocalClient } from "dc-db-local";
import { DbScreen, Screen } from "./types";
import { checkCondition } from "./conditions";
import { resolvePreset } from "./presets";
import { logger } from "../logger";
import { sendSSEResponse } from "../server";

let localClient: LocalClient | undefined;

let screenList: Array<Screen> = [];
let currentListId: number = 0;
let screenTimeout: NodeJS.Timeout | undefined;
let isPaused: boolean = false;

export function nextScreen() {
    if (screenTimeout) {
        clearTimeout(screenTimeout);
        screenTimeout = undefined;
    }
    main();
}

export function previousScreen() {
    if (screenTimeout) {
        clearTimeout(screenTimeout);
        screenTimeout = undefined;
    }
    if (currentListId == 0) {
        throw new Error('No previous screen');
    }
    currentListId -= 2;
    main();
}

export function getPaused() {
    return isPaused;
}

export function pauseScreen() {
    if (screenTimeout) {
        clearTimeout(screenTimeout);
        screenTimeout = undefined;
        isPaused = true;
    } else {
        isPaused = false;
        main();
    }
}

export function getCurrentScreen() {
    if (screenList.length <= currentListId) {
        return {
            available: false
        };
    }
    return screenList[currentListId];
}

export async function gotoScreen(id: number, subId: number = 0) {
    if (screenTimeout) {
        clearTimeout(screenTimeout);
        screenTimeout = undefined;
    }
    if (id < 0 || subId < 0) {
        throw new Error('Invalid screen id');
    }
    let currentScreenList = screenList.slice(0, currentListId + 1);
    const dbScreen = await localClient?.screens.findFirst({
        where: {
            id: id
        }
    });
    if (!dbScreen) {
        throw new Error('Screen not found');
    }
    const dbScreenWType = dbScreen as unknown as DbScreen;
    const newScreen = await resolvePreset(dbScreenWType);
    if (!newScreen) {
        throw new Error('Invalid screen');
    }
    currentListId = currentScreenList.length;
    screenList = [...currentScreenList, ...newScreen];
    if (screenList.length > 200) {
        currentListId = currentListId - (screenList.length - 200);
        screenList = screenList.slice(screenList.length - 200);
    }
    const currentScreen = screenList[currentListId];
    if (currentScreen.available) {
        screenTimeout = setTimeout(main, currentScreen.duration);
    } else {
        screenTimeout = setTimeout(main, 5000);
    }
}


async function main() {
    if (screenTimeout) {
        clearTimeout(screenTimeout);
    }
    if (!localClient) {
        localClient = await createLocalClient();
    }
    currentListId++;
    if (screenList.length <= currentListId) {
        await fetchNextScreens();
    }
    const currentScreen = screenList[currentListId];
    sendSSEResponse(currentScreen);
    if (!currentScreen.available) {
        logger.info('No available screens, waiting for next screens');
        if (!isPaused) {
            screenTimeout = setTimeout(main, 5000);
        }
        return;
    } else {
        logger.info(`Current screen: ${currentScreen.id}-${currentScreen.subId}`);
        if (!isPaused) {
            screenTimeout = setTimeout(main, currentScreen.duration);
        }
        return;
    }
}

async function fetchNextScreens() {
    logger.info('Fetching next screens from database');
    let newEntries: Array<Screen> = [];
    let currentScreenId = 0;
    let loops = 0;
    if (screenList.length > 0) {
        const lastScreen = screenList[screenList.length - 1];
        if (lastScreen.available == true) {
            currentScreenId = lastScreen.id;
        }
    }
    while (newEntries.length < 1) {
        if (loops > 10) {
            newEntries = [{
                available: false
            }];
            break;
        }
        const newDb = await localClient?.screens.findFirst({
            where: {
                id: {
                    gt: currentScreenId
                }
            }
        });
        if (!newDb) {
            currentScreenId = 0;
            loops++;
            continue;
        }
        const newDbWType = newDb as unknown as DbScreen
        if (!checkCondition(newDbWType)) {
            logger.info(`Screen ${newDbWType.id} does not meet conditions`);
            currentScreenId = newDbWType.id;
            continue;
        }
        const newEntriesRaw = await resolvePreset(newDbWType);
        if (!newEntriesRaw) {
            currentScreenId = newDbWType.id;
            continue;
        }
        newEntries = newEntriesRaw;
        break;
    }
    logger.info(`Fetched ${newEntries.length} new screens`);
    currentListId = screenList.length;
    screenList = [...screenList, ...newEntries];
    if (screenList.length > 200) {
        currentListId = currentListId - (screenList.length - 200);
        screenList = screenList.slice(screenList.length - 200);
    }
}

main();
import { LocalClient } from "dc-db-local";
import { isScreen, Screen } from "@shared/screens";
import { logger } from "dc-logger";
import { sendSSEResponse } from "../server";
import { loadNextScreen, loadScreen } from "./screens";
import amqp from "amqplib"

const localClient: LocalClient = new LocalClient();

let currentScreen: Screen = { available: false };
let nextScreenList: Array<Screen> = [];
let screenTimeout: NodeJS.Timeout | undefined = undefined;
let isPaused: boolean = false;

export function nextScreen() {
    if (screenTimeout) {
        clearTimeout(screenTimeout);
        screenTimeout = undefined;
    }
    screenLoop();
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
        screenLoop();
    }
}

export function getCurrentScreen() {
    return currentScreen;
}

export async function gotoScreen(id: number, subId: number = 0) {
    if (screenTimeout) {
        clearTimeout(screenTimeout);
        screenTimeout = undefined;
    }
    nextScreenList = await loadScreen(localClient, id);
    if (nextScreenList.length <= subId) {
        subId = 0;
    }
    nextScreenList = nextScreenList.slice(subId);
    screenLoop();
}


async function screenLoop() {
    if (screenTimeout) {
        clearTimeout(screenTimeout);
        screenTimeout = undefined;
    }
    if (nextScreenList.length < 1) {
        nextScreenList = await loadNextScreen(localClient, currentScreen.available ? currentScreen.id : 0);
    }
    currentScreen = nextScreenList.shift() || { available: false };
    sendSSEResponse(currentScreen);
    if (!currentScreen.available) {
        logger.info('No available screens, waiting 30s');
        if (!isPaused) {
            screenTimeout = setTimeout(screenLoop, 30000);
        }
        return;
    } else {
        logger.info(`Current screen: ${currentScreen.id}-${currentScreen.subId}`);
        if (!isPaused) {
            screenTimeout = setTimeout(screenLoop, currentScreen.duration);
        }
        return;
    }
}

async function main() {
    const connection = await amqp.connect("amqp://rabbitmq");
    const channel = await connection.createChannel();
    await channel.assertQueue("screens.systemScreens", {
        durable: false,
        autoDelete: true,
        messageTtl: 30000
    });
    await channel.consume("screens.systemScreens", async (msg) => {
        if (msg === null) {
            return;
        }
        const message = JSON.parse(msg.content.toString());
        if (!isScreen(message)) {
            return;
        }
        const screen = message as Screen;
        nextScreenList = [screen];
        screenLoop();
    });
    logger.info("Screen manager started");
    screenLoop();
}

main();
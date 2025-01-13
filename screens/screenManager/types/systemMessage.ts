import { BaseScreenAvailable } from './base';

export type SystemMessageScreen = BaseScreenAvailable & {
    preset: "systemMessage";
    options: Ssmdb2MessageOptions | IncompatibleMessageOptions;
}

export function isSystemMessageScreen(screen: any): screen is SystemMessageScreen {
    if (!screen) return false;
    if (screen.preset !== "systemMessage") return false;
    const screenWType = screen as SystemMessageScreen;
    if (isSsmdb2MessageOptions(screenWType.options)) return true;
    if (isIncompatibleMessageOptions(screenWType.options)) return true;
    return false;
}

export type Ssmdb2MessageOptions = {
    type: "ssmdb2";
}

export function isSsmdb2MessageOptions(options: any): options is Ssmdb2MessageOptions {
    if (!options) return false;
    if (options.type !== "ssmdb2") return false;
    return true;
}

export type IncompatibleMessageOptions = {
    type: "serverIncompatible";
    serverVersion: string;
}

export function isIncompatibleMessageOptions(options: any): options is IncompatibleMessageOptions {
    if (!options) return false;
    if (options.type !== "serverIncompatible") return false;
    const optionsWType = options as IncompatibleMessageOptions;
    if (typeof optionsWType.serverVersion !== "string") return false;
    return true;
}
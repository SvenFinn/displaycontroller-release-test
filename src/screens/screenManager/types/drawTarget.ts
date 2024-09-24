import { BaseDbScreen, BaseScreenAvailable, isBaseDbScreen, isBaseScreenAvailable } from "./base";

export type DrawTargetDbScreen = BaseDbScreen & {
    preset: "drawTarget";
    options: DrawTargetOptions;
}

export function isDrawTargetDbScreen(screen: any): screen is DrawTargetDbScreen {
    if (!isBaseDbScreen(screen)) return false;
    if (screen.preset !== "drawTarget") return false;
    const screenWType = screen as DrawTargetDbScreen;
    if (!screenWType.options) return false;
    if (!screenWType.options.ranges) return false;
    if (!screenWType.options.highlightAssign) return false;
    return true;
}

type DrawTargetOptions = {
    ranges: Array<number> | Array<Array<number>>;
    highlightAssign: boolean;
}

export type DrawTargetScreen = BaseScreenAvailable & {
    preset: "drawTarget";
    options: DrawTargetOptions;
}

export function isDrawTargetScreen(screen: any): screen is DrawTargetScreen {
    if (!isBaseScreenAvailable(screen)) return false;
    if (screen.preset !== "drawTarget") return false;
    const screenWType = screen as DrawTargetScreen;
    if (!screenWType.options) return false;
    if (!Array.isArray(screenWType.options.ranges)) return false;
    if (!screenWType.options.highlightAssign) return false;
    return true;
}
import { BaseDbScreen, BaseScreenAvailable, isBaseDbScreen, isBaseScreenAvailable } from "./base";

export type CpcViewDbScreen = BaseDbScreen & {
    preset: "cpcView";
    options: CpcViewMultiOptions | CpcViewSingleOptions;
}

export function isCpcViewDbScreen(screen: any): screen is CpcViewDbScreen {
    if (!isBaseDbScreen(screen)) return false;
    if (screen.preset !== "cpcView") return false;
    const screenWType = screen as CpcViewDbScreen;
    if (!screenWType.options) return false;
    if (screenWType.options.mode === "single") {
        if (!screenWType.options.range) return false;
    } else if (screenWType.options.mode === "multi") {
        if (!screenWType.options.ranges) return false;
    } else {
        return false;
    }
    return true;
}

type CpcViewSingleOptions = {
    mode: "single";
    range: number;
}

type CpcViewMultiOptions = {
    mode: "multi";
    ranges: Array<number>;
}

export type CpcViewScreen = BaseScreenAvailable & {
    preset: "cpcView";
    options: CpcViewMultiOptions | CpcViewSingleOptions;
}

export function isCpcViewScreen(screen: any): screen is CpcViewScreen {
    if (!isBaseScreenAvailable(screen)) return false;
    if (screen.preset !== "cpcView") return false;
    const screenWType = screen as CpcViewScreen;
    if (!screenWType.options) return false;
    if (screenWType.options.mode === "single") {
        if (!screenWType.options.range) return false;
    } else if (screenWType.options.mode === "multi") {
        if (!screenWType.options.ranges) return false;
    } else {
        return false;
    }
    return true;
}

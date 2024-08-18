import { BaseScreenAvailable, DbScreen } from "../types";
import { Screens } from "./presets";
import { validateDbScreenBase } from "./presets";
import { logger } from "../../logger";

export default async function cpcView(screen: DbScreen): Promise<Screens> {
    if (!validateCpcViewDb(screen)) {
        logger.warn(`Screen ${screen.id} is not a valid cpcView screen`);
        return [{
            available: false
        }]
    }
    const screenWType = screen as unknown as CpcViewDbScreen;
    return [
        {
            available: true,
            id: screenWType.id,
            subId: 0,
            preset: "cpcView",
            path: "/show/cpcView",
            options: screenWType.options,
            duration: screenWType.duration
        }
    ]
}

export function validateCpcViewDb(screen: DbScreen): boolean {
    if (!validateDbScreenBase(screen)) return false;
    if (screen.preset !== "cpcView") return false;
    const screenWType = screen as CpcViewDbScreen;
    if (!screenWType.options) return false;
    if (!screenWType.options.mode) return false;
    if (screenWType.options.mode === "single") {
        if (!screenWType.options.range) return false;
    } else if (screenWType.options.mode === "multi") {
        if (!screenWType.options.ranges) return false;
    } else {
        return false;
    }
    return true;
}

export type CpcViewDbScreen = DbScreen & {
    preset: "cpcView";
    options: CpcViewMultiOptions | CpcViewSingleOptions;
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

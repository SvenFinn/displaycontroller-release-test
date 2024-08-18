import { logger } from "../../logger";
import { BaseScreenAvailable, DbScreen } from "../types";
import { Screens, validateDbScreenBase } from "./presets";

export default async function drawTarget(screen: DbScreen): Promise<Screens> {
    if (!validateDrawTargetDb(screen)) {
        logger.warn(`Screen ${screen.id} is not a valid drawTarget screen`);
        return [{
            available: false
        }]
    }
    const screenWType = screen as DrawTargetDbScreen;
    return [
        {
            available: true,
            id: screenWType.id,
            subId: 0,
            preset: "drawTarget",
            path: "/show/drawTarget",
            options: screenWType.options,
            duration: screenWType.duration
        }
    ]
}

export function validateDrawTargetDb(screen: DbScreen): boolean {
    if (!validateDbScreenBase(screen)) return false;
    if (screen.preset !== "drawTarget") return false;
    const screenWType = screen as DrawTargetDbScreen;
    if (!screenWType.options) return false;
    if (!screenWType.options.ranges) return false;
    if (!screenWType.options.highlightAssign) return false;
    return true;
}


export type DrawTargetDbScreen = DbScreen & {
    preset: "drawTarget";
    options: DrawTargetOptions;
}

type DrawTargetOptions = {
    ranges: Array<number> | Array<Array<number>>;
    highlightAssign: boolean;
}

export type DrawTargetScreen = BaseScreenAvailable & {
    preset: "drawTarget";
    options: DrawTargetOptions;
}
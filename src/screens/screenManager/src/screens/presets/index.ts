import { DbScreen, Screen } from "../types";
import cpcView from "./cpcView";
import drawTarget from "./drawTarget";
import evaluation from "./evaluation";
import evaluationGallery from "./evaluationGallery";
import { validateDbScreenBase } from "./presets";
import imageViewer from "./imageViewer";
import { logger } from "../../logger";

export async function resolvePreset(screen: DbScreen): Promise<Array<Screen> | undefined> {
    if (!validateDbScreenBase(screen)) return undefined;
    switch (screen.preset) {
        case "evaluation":
            return await evaluation(screen);
        case "cpcView":
            return await cpcView(screen);
        case "imageViewer":
            return await imageViewer(screen);
        case "evaluationGallery":
            return await evaluationGallery(screen);
        case "drawTarget":
            return await drawTarget(screen);
        default:
            logger.warn(`Screen ${screen.id} has an unknown preset ${screen.preset}`);
            return undefined;
    }
}
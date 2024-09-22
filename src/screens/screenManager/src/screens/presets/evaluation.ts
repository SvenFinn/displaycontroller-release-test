import { Screens, validateDbScreenBase } from "./presets";
import { BaseScreenAvailable, DbScreen } from "../types";
import { logger } from "../../logger";
import { isEvaluationListing } from "@shared/evaluations";

export default async function evaluation(screen: DbScreen): Promise<Screens> {
    if (!validateEvaluationDb(screen)) {
        logger.warn(`Screen ${screen.id} is not a valid evaluation screen`);
        return [{
            available: false
        }]
    }
    const screenWType = screen as EvaluationDbScreen;
    const fileExists = (await fetch(`http://evaluations/api/evaluations/${screenWType.options.file}`)).ok;
    if (!fileExists) return [{
        available: false
    }]
    if (isEvaluationListing(fileExists)) return [{
        available: false
    }];
    return [
        {
            available: true,
            id: screenWType.id,
            subId: 0,
            preset: "evaluation",
            path: "/show/evaluations",
            options: screenWType.options,
            duration: screenWType.duration
        }
    ];
}

export function validateEvaluationDb(screen: DbScreen): boolean {
    if (!validateDbScreenBase(screen)) return false;
    if (screen.preset !== "evaluation") return false;
    const screenWType = screen as EvaluationDbScreen;
    if (!screenWType.options) return false;
    if (!screenWType.options.file) return false;
    return true;
}


export type EvaluationDbScreen = DbScreen & {
    preset: "evaluation";
    options: EvaluationOptions;
}

type EvaluationOptions = {
    file: string;
}

export type EvaluationScreen = BaseScreenAvailable & {
    preset: "evaluation";
    options: EvaluationOptions;
}
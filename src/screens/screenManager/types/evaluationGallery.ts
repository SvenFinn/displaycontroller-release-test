import { BaseDbScreen, isBaseDbScreen } from "./base";

export type EvaluationGalleryDbScreen = BaseDbScreen & {
    preset: "evaluationGallery";
    options: {
        path: string;
    };
}

export function isEvaluationGalleryDbScreen(screen: any): screen is EvaluationGalleryDbScreen {
    if (!isBaseDbScreen(screen)) return false;
    if (screen.preset !== "evaluationGallery") return false;
    const screenWType = screen as EvaluationGalleryDbScreen;
    if (!screenWType.options) return false;
    if (!screenWType.options.path) return false;
    return true;
}
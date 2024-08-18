import { CpcViewScreen, CpcViewDbScreen } from "./presets/cpcView";
import { DrawTargetScreen, DrawTargetDbScreen } from "./presets/drawTarget";
import { EvaluationScreen, EvaluationDbScreen } from "./presets/evaluation";
import { EvaluationGalleryDbScreen } from "./presets/evaluationGallery";
import { ViewerScreen, ViewerDbScreen } from "./presets/imageViewer";
import { Condition } from "./conditions/types";

export type Screen = ScreenAvailable | ScreenUnavailable;

export type ScreenAvailable = DrawTargetScreen | CpcViewScreen | EvaluationScreen | ViewerScreen;

export type BaseScreenAvailable = {
    available: true;
    id: number;
    subId: number;
    preset: string;
    path: string;
    options: Record<string, any>;
    duration: number;
}

export type ScreenUnavailable = {
    available: false;
}

export type DbScreen = {
    id: number;
    preset: string;
    options: DrawTargetDbScreen | CpcViewDbScreen | EvaluationDbScreen | EvaluationGalleryDbScreen | ViewerDbScreen;
    condition: Condition;
    visibleFrom: number;
    visibleUntil: number;
    duration: number;
    createdAt: Date;
    updatedAt: Date;
}
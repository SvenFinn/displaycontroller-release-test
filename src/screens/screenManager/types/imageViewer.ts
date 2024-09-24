import { BaseDbScreen, BaseScreenAvailable, isBaseDbScreen, isBaseScreenAvailable } from "./base";

export type ViewerDbScreen = BaseDbScreen & {
    preset: "imageViewer";
    options: {
        path: string;
    }
}

export function isViewerDbScreen(screen: any): screen is ViewerDbScreen {
    if (!isBaseDbScreen(screen)) return false;
    if (screen.preset !== "imageViewer") return false;
    const screenWType = screen as ViewerDbScreen;
    if (!screenWType.options) return false;
    if (!screenWType.options.path) return false;
    return true;
}

export type ViewerScreen = BaseScreenAvailable & {
    preset: "imageViewer";
    options: {
        file: string;
    }
}

export function isViewerScreen(screen: any): screen is ViewerScreen {
    if (!isBaseScreenAvailable(screen)) return false;
    if (screen.preset !== "imageViewer") return false;
    const screenWType = screen as ViewerScreen;
    if (!screenWType.options) return false;
    if (!screenWType.options.file) return false;
    return true;
}
import { Screens, validateDbScreenBase } from "./presets";
import { BaseScreenAvailable, DbScreen } from "../types";
import { logger } from "../../logger";

export default async function imageViewer(screen: DbScreen): Promise<Screens> {
    if (!validateViewerDb(screen)) {
        logger.warn(`Screen ${screen.id} is not a valid imageViewer screen`);
        return [{
            available: false
        }]
    }
    const screenWType = screen as ViewerDbScreen;
    let fileList: string[];
    try {
        fileList = await createFileList(screenWType.options.path);
    } catch (e) {
        logger.error(`Failed to fetch files for screen ${screen.id}`);
        return [{
            available: false
        }];
    }
    if (fileList.length === 0) return [{
        available: false
    }];
    // Length of fileList is larger than 1, so this map always
    // returns at least one element
    // @ts-ignore
    return fileList.map((file: string, index: number) => {
        return {
            available: true,
            id: screenWType.id,
            subId: index,
            preset: "viewer",
            options: {
                file: file
            },
            duration: screenWType.duration
        }
    });
}

async function createFileList(path: string): Promise<string[]> {
    const files = await fetch(`http://images/api/images/${path}`);
    if (!files.ok) return [];
    // Check if the response is a JSON object or HTML
    const contentType = files.headers.get("content-type");
    if (!contentType) return [];
    if (!contentType.includes("application/json")) return [];
    const fileList = await files.json() as [{ name: string, type: "folder" | "file" }];
    const mappedList = fileList.map(async (file: { name: string, type: "folder" | "file" }) => {
        if (file.type === "folder") return await createFileList(`${path}/${file.name}`);
        return `${path}/${file.name}`;
    });
    return (await Promise.all(mappedList)).flat();
}

export function validateViewerDb(screen: DbScreen): boolean {
    if (!validateDbScreenBase(screen)) return false;
    if (screen.preset !== "imageViewer") return false;
    const screenWType = screen as ViewerDbScreen;
    if (!screenWType.options) return false;
    if (!screenWType.options.path) return false;
    return true;
}

export type ViewerDbScreen = DbScreen & {
    preset: "viewer";
    options: {
        path: string;
    }
}

export type ViewerOptions = {
    path: string;
}

export type ViewerScreen = BaseScreenAvailable & {
    preset: "viewer";
    options: {
        file: string;
    }
}
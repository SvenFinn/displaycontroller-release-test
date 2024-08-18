import { Screens, validateDbScreenBase } from "./presets";
import { DbScreen } from "../types";
import { logger } from "../../logger";

export default async function evaluationGallery(screen: DbScreen): Promise<Screens> {
    if (!validateEvaluationGalleryDb(screen)) {
        logger.warn(`Screen ${screen.id} is not a valid evaluationGallery screen`);
        return [{
            available: false
        }]
    }
    const screenWType = screen as EvaluationGalleryDbScreen;
    const fileList = await createFileList(screenWType.options.path);
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
            preset: "evaluation",
            options: {
                file: file
            },
            duration: screenWType.duration
        }
    });
}

async function createFileList(path: string): Promise<string[]> {
    const files = await fetch(`http://evaluations/api/evaluations/${path}`);
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

export function validateEvaluationGalleryDb(screen: DbScreen): boolean {
    if (!validateDbScreenBase(screen)) return false;
    if (screen.preset !== "evaluationGallery") return false;
    const screenWType = screen as EvaluationGalleryDbScreen;
    if (!screenWType.options) return false;
    if (!screenWType.options.path) return false;
    return true;
}

export type EvaluationGalleryDbScreen = DbScreen & {
    preset: "evaluationGallery";
    options: {
        path: string;
    };
}
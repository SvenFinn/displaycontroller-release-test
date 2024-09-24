import { Screens } from ".";
import { EvaluationGalleryDbScreen } from "@shared/screens/evaluationGallery";
import { logger } from "../../logger";
import { isEvaluationListing } from "@shared/evaluations";

export default async function evaluationGallery(screen: EvaluationGalleryDbScreen): Promise<Screens> {
    const fileList = await createFileList(screen.options.path);
    const screens = fileList.map((file: string, index: number) => {
        return {
            available: true,
            id: screen.id,
            subId: index,
            preset: "evaluation",
            options: {
                file: file
            },
            duration: screen.duration
        }
    });
    if (screens.length === 0) {
        logger.warn(`No files found in path ${screen.options.path}`);
        return [{
            available: false
        }]
    }
    /*@ts-ignore*/
    return screens;
}

async function createFileList(path: string): Promise<string[]> {
    const files = await fetch(`http://evaluations/api/evaluations/${path}`);
    if (!files.ok) return [];
    // Check if the response is a JSON object or HTML
    const contentType = files.headers.get("content-type");
    if (!contentType) return [];
    if (!contentType.includes("application/json")) return [];
    const fileList = await files.json();
    if (!isEvaluationListing(fileList)) return [];
    const mappedList = fileList.map(async (file) => {
        if (file.type === "folder") return await createFileList(`${path}/${file.name}`);
        return `${path}/${file.name}`;
    });
    return (await Promise.all(mappedList)).flat();
}
export type EvaluationResponse = EvaluationActionResponse | EvaluationListing;

export type EvaluationActionResponse = {
    code: number;
    message: string;
};

export type EvaluationListing = Array<{
    name: string;
    type: "folder" | "file";
}>;

export function isEvaluationErrorResponse(obj: any): obj is EvaluationActionResponse {
    if (typeof obj !== "object") {
        return false;
    }
    return obj.code !== undefined && obj.message !== undefined;
}

export function isEvaluationListing(obj: any): obj is EvaluationListing {
    if (!Array.isArray(obj)) {
        return false;
    }
    for (const item of obj) {
        if (typeof item !== "object") {
            return false;
        }
        if (item.name === undefined || item.type === undefined) {
            return false;
        }
    }
    return true;
}
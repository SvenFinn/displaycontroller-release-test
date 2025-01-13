export type ImageResponse = ImageActionResponse | DirectoryListing;

export type ImageActionResponse = {
    code: number;
    message: string;
};

export type DirectoryListing = Array<{
    name: string;
    type: "folder" | "file";
}>;

export function isImageErrorResponse(obj: any): obj is ImageActionResponse {
    if (typeof obj !== "object") {
        return false;
    }
    return obj.code !== undefined && obj.message !== undefined;
}

export function isDirectoryListing(obj: any): obj is DirectoryListing {
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
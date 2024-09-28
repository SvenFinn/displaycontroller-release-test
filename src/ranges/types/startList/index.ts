export type StartList = {
    id: number;
    name: string;
    type: "default" | "price" | "league" | "round" | "final";
}

export function isStartList(startList: any): startList is StartList {
    if (!startList.id) return false;
    if (!startList.name) return false;
    if (!startList.type) return false;
    return true;
}
export type StartList = MostStartList | PriceStartList;

export function isStartList(startList: any): startList is StartList {
    if (typeof startList !== "object") return false;
    if (typeof startList.id !== "number") return false;
    if (typeof startList.name !== "string") return false;
    if (typeof (startList.active) !== "boolean") return false;
    if (typeof (startList.type) !== "string") return false;
    if (startList.type === "price") {
        if (!Array.isArray(startList.overrideDisciplines)) return false;
    }
    return true;
}

export type BaseStartList = {
    id: number,
    name: string,
    active: boolean
}

type MostStartList = BaseStartList & {
    type: "default" | "league" | "round" | "final"
}

type PriceStartList = BaseStartList & {
    type: "price",
    overrideDisciplines: Array<OverrideDiscipline>
}

export type OverrideDiscipline = {
    id: number,
    disciplineId: number,
    name: string,
    color: string,
}
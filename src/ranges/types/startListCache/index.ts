export type StartList = MostStartList | PriceStartList;

export function isStartList(startList: any): startList is StartList {
    if (typeof startList !== "object") return false;
    if (typeof startList.id !== "number") return false;
    if (typeof startList.name !== "string") return false;
    if (typeof (startList.active) !== "boolean") return false;
    if (typeof (startList.type) !== "string") return false;
    if (startList.type === "price") {
        if (!Array.isArray(startList.overrideDisciplines)) return false;
        for (const overrideDiscipline of startList.overrideDisciplines) {
            if (!isOverrideDiscipline(overrideDiscipline)) return false;
        }
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

export function isOverrideDiscipline(overrideDiscipline: any): overrideDiscipline is OverrideDiscipline {
    if (typeof overrideDiscipline !== "object") return false;
    if (typeof overrideDiscipline.id !== "number") return false;
    if (typeof overrideDiscipline.disciplineId !== "number") return false;
    if (typeof overrideDiscipline.name !== "string") return false;
    if (typeof overrideDiscipline.color !== "string") return false;
    return true;
}

export type OverrideDiscipline = {
    id: number,
    disciplineId: number,
    name: string,
    color: string,
}
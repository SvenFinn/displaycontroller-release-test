export type StartList = MostStartList | PriceStartList;

export function isStartList(startList: any): startList is StartList {
    if (!startList.id) return false;
    if (!startList.name) return false;
    if (!startList.active) return false;
    if (!startList.type) return false;
    if (startList.type === "price") {
        if (!startList.specialDisciplines) return false;
        if (!Array.isArray(startList.specialDisciplines)) return false;
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
    specialDisciplines: Array<SpecialDiscipline>
}

export type SpecialDiscipline = {
    id: number,
    disciplineId: number,
    name: string,
    color: string,
}
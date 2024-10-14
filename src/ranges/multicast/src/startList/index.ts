import { LocalClient } from "dc-db-local";
import { isStartList, OverrideDiscipline } from "@shared/ranges/startListCache/index"

const matchStartLists = new Map<string, number>();
const overrideDisciplines = new Map<number, Array<OverrideDiscipline>>();

export async function updateStartList(client: LocalClient) {
    const startList = await client.cache.findMany({
        where: {
            type: "startList"
        }
    });
    matchStartLists.clear();
    for (const list of startList) {
        if (!isStartList(list.value)) {
            continue;
        }
        matchStartLists.set(list.value.name, Number(list.key));
        if (list.value.type === "price") {
            overrideDisciplines.set(Number(list.key), list.value.overrideDisciplines);
        }
    }
}

export function getStartList(message: string): number | null {
    let currentStartList: number | null = null;
    let currentStartListName = "";
    for (const [name, key] of matchStartLists) {
        if (currentStartListName.length < name.length && message.match(new RegExp(name)) !== null) {
            currentStartList = key;
            currentStartListName = name;
        }
    }
    return currentStartList;
}

export function getOverrideDiscipline(startList: number, message: string): number | null {
    const disciplines = overrideDisciplines.get(startList);
    if (!disciplines) {
        return null;
    }
    let currentDisciplineName = "";
    let currentDiscipline: number | null = null;
    for (const discipline of disciplines) {
        if (currentDisciplineName.length < discipline.name.length && message.includes(`${discipline.name}\0`)) {
            currentDiscipline = discipline.id;
            currentDisciplineName = discipline.name;
        }
    }
    return currentDiscipline;
}
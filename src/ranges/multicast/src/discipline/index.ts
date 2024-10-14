import { LocalClient } from "dc-db-local";
import { isDiscipline } from "@shared/ranges/discipline/index";

const matchDiscipline = new Map<string, BigInt>();

export async function updateDisciplines(client: LocalClient) {
    const disciplines = await client.cache.findMany({
        where: {
            type: "discipline"
        }
    });
    matchDiscipline.clear();
    for (const discipline of disciplines) {
        if (!isDiscipline(discipline.value)) {
            continue;
        }
        matchDiscipline.set(`${discipline.value.name}\0`, discipline.key);
    }
}

export function getDiscipline(message: string): number | null {
    let currentDiscipline: null | number = null;
    let currentDisciplineName = "";
    for (const [name, key] of matchDiscipline) {
        if (currentDisciplineName.length < name.length && message.includes(name)) {
            currentDiscipline = Number(key);
            currentDisciplineName = name;
        }
    }
    return currentDiscipline;
}
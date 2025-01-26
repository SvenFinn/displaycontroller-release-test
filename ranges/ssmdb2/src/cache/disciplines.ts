import { LocalClient } from "dc-db-local";
import { InternalDiscipline } from "@shared/ranges/internal";

export const disciplineIdToObj = new Map<number, InternalDiscipline>();

export async function updateDisciplines(client: LocalClient) {
    const overrides = await client.cache.findMany({
        where: {
            type: "overrideDiscipline"
        }
    });
    disciplineIdToObj.clear();
    for (const override of overrides) {
        disciplineIdToObj.set(Number(override.key), {
            disciplineId: Number(override.key),
            roundId: 0
        });
    }
    const disciplines = await client.cache.findMany({
        where: {
            type: "discipline"
        }
    });
    for (const discipline of disciplines) {
        disciplineIdToObj.set(Number(discipline.key), {
            disciplineId: Number(discipline.key),
            roundId: 0
        });

    }
}

export function getDisciplineId(id: number, round: number): InternalDiscipline | null {
    const discipline = disciplineIdToObj.get(id) || null;
    if (discipline === null) {
        return null;
    }
    discipline.roundId = round;
    return discipline;
}

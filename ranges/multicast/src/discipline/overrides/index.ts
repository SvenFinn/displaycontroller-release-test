import { LocalClient } from "dc-db-local";
import { isDiscipline } from "@shared/ranges/discipline/index";
import { InternalDiscipline } from "@shared/ranges/internal";
import { isOverrideDiscipline, OverrideDiscipline } from "@shared/ranges/internal/startList";

const overrideDisciplines = new Map<number, Map<string, InternalDiscipline>>();

export async function updateOverrides(client: LocalClient) {
    const overrideDisciplinesData = await client.cache.findMany({
        where: {
            type: "overrideDiscipline"
        }
    });
    overrideDisciplines.clear();
    for (const overrideDisciplineDb of overrideDisciplinesData) {
        if (!isOverrideDiscipline(overrideDisciplineDb.value)) {
            continue;
        }
        const overrideDiscipline = overrideDisciplineDb.value;
        const originalDiscipline = await client.cache.findUnique({
            where: {
                type_key: {
                    type: "discipline",
                    key: overrideDiscipline.disciplineId
                }
            }
        });
        if (!originalDiscipline || !isDiscipline(originalDiscipline.value)) {
            continue;
        }
        const minRoundId = originalDiscipline.value.rounds.findIndex(round => round !== null);
        const startListId = Number(overrideDiscipline.startListId);
        if (!overrideDisciplines.has(startListId)) {
            overrideDisciplines.set(startListId, new Map());
        }
        overrideDisciplines.get(startListId)!.set(overrideDiscipline.name, {
            overrideId: Number(overrideDiscipline.id),
            roundId: minRoundId
        });
    }

}

export function getOverrideDiscipline(startListId: number, message: string): InternalDiscipline | null {
    const disciplines = overrideDisciplines.get(startListId);
    if (!disciplines) {
        return null;
    }
    const keys = Array.from(disciplines.keys()).sort((a, b) => b.length - a.length);// sort by length descending
    for (const name of keys) {
        if (message.includes(name)) {
            return disciplines.get(name) || null;
        }
    }
    return null;
}
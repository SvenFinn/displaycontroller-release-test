import { LocalClient } from "dc-db-local";
import { Discipline, isDiscipline } from "@shared/ranges/discipline";
import { isOverrideDiscipline } from "@shared/ranges/internal/startList";
import { InternalDiscipline, isInternalOverrideDiscipline } from "@shared/ranges/internal";

export const disciplines = new Map<number, Discipline>();
export const overrides = new Map<number, Discipline>();

export async function updateDisciplines(localClient: LocalClient) {
    const newDisciplines = await localClient.cache.findMany({
        where: {
            type: "discipline",
        },
    });
    disciplines.clear();
    for (const disciplineDb of newDisciplines) {
        const discipline = disciplineDb.value;
        if (!isDiscipline(discipline)) {
            continue;
        }
        disciplines.set(discipline.id, discipline);
    }
}

export async function updateOverrides(localClient: LocalClient) {
    const newOverrides = await localClient.cache.findMany({
        where: {
            type: "overrideDiscipline",
        },
    });
    overrides.clear();
    for (const overrideDb of newOverrides) {
        const override = overrideDb.value;
        if (!isOverrideDiscipline(override)) {
            continue;
        }
        const discipline = disciplines.get(override.id);
        if (!discipline) {
            continue;
        }
        discipline.color = override.color;
        override.name = override.name;
        overrides.set(override.id, discipline);
    }
}

export function getDiscipline(internalDiscipline: InternalDiscipline | null): Discipline | null {
    if (internalDiscipline == null) {
        return null;
    }
    if (isInternalOverrideDiscipline(internalDiscipline)) {
        return overrides.get(internalDiscipline.overrideId) || null;
    }
    return disciplines.get(internalDiscipline.disciplineId) || null;
}

export function getRoundId(internalDiscipline: InternalDiscipline): number {
    return internalDiscipline.roundId;
}
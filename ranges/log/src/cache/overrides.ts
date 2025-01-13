import { isOverrideDiscipline } from "@shared/ranges/internal/startList";
import { LocalClient } from "dc-db-local";

const overrideToDiscipline = new Map<number, number>();

export async function updateOverrides(client: LocalClient) {
    const overrides = await client.cache.findMany({
        where: {
            type: "overrideDiscipline"
        }
    });
    overrideToDiscipline.clear();
    for (const override of overrides) {
        if (!isOverrideDiscipline(override.value)) {
            continue;
        }
        overrideToDiscipline.set(Number(override.value.id), Number(override.value.disciplineId));
    }
}

export function getDisciplineId(overrideId: number): number | null {
    return overrideToDiscipline.get(overrideId) || null;
}
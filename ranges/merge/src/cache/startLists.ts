import { LocalClient } from "dc-db-local";
import { StartList } from "@shared/ranges/startList";
import { InternalStartList, isInternalStartList } from "@shared/ranges/internal/startList";

export const startLists = new Map<number, StartList>();

export async function updateStartLists(localClient: LocalClient) {
    const newStartLists = await localClient.cache.findMany({
        where: {
            type: "startList",
        },
    });
    startLists.clear();
    for (const startListDb of newStartLists) {
        const startList = startListDb.value;
        if (!isInternalStartList(startList)) {
            continue;
        }
        startLists.set(startList.id, {
            id: startList.id,
            name: startList.name,
            type: startList.type,
        });
    }
}

export function getStartList(startListId: number | null): StartList | null {
    if (startListId == null) {
        return null;
    }
    return startLists.get(startListId) || null;
}
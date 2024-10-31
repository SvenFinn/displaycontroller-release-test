import { LocalClient } from "dc-db-local";
import { isStartList } from "@shared/ranges/internal/startList";

const matchStartLists = new Map<string, number>();

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
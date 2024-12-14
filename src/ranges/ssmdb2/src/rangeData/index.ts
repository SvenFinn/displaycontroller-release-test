import { Ssmdb2Client } from "dc-db-ssmdb2";
import { InternalRange } from "@shared/ranges/internal";
import { LocalClient } from "dc-db-local";
import { Hits } from "@shared/ranges/hits";

const localClient = new LocalClient();

export async function getRangeData(ssmdb2Client: Ssmdb2Client, targetId: number): Promise<InternalRange | null> {
    const data = await ssmdb2Client.target.findUnique({
        where: {
            id: targetId
        }
    });
    if (data === null) {
        return null;
    }
    const hits = await getHits(ssmdb2Client, targetId);
    return {
        rangeId: data.rangeId,
        startListId: data.startListId,
        shooter: data.shooterId,
        hits: hits,
        discipline: {
            roundId: hits.length === 0 ? 0 : hits.length - 1,
            ...await getDiscipline(data.disciplineId)
        },
        source: "ssmdb2",
        ttl: 20000
    }
}

async function getHits(ssmdb2Client: Ssmdb2Client, targetId: number): Promise<Hits> {
    const hits = await ssmdb2Client.shot.findMany({
        where: {
            targetId: targetId
        }
    });
    const result: Hits = [];
    for (const hit of hits) {
        const roundId = hit.roundId - 1;
        if (result[roundId] === undefined) {
            result[roundId] = [];
        }
        result[roundId]?.push({
            id: hit.id,
            x: hit.x / 100,
            y: hit.y / 100,
            divisor: hit.dividerHundredth / 100,
            rings: hit.rings / 10,
            innerTen: hit.innerTen
        });
    }
    return result.map((round) => round?.sort((a, b) => a.id - b.id)).map((round) => round === undefined ? null : round);
}

async function getDiscipline(disciplineId: number): Promise<{ disciplineId: number } | { overrideId: number }> {
    const isOverride = await localClient.cache.findUnique({
        where: {
            type_key: {
                key: disciplineId,
                type: "overrideDiscipline"
            }
        }
    });
    if (isOverride !== null) {
        return {
            overrideId: disciplineId
        }
    } else {
        return {
            disciplineId
        }
    }
}
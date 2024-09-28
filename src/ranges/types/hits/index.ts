export type Hits = {
    [roundId: number]: Array<Hit>;
}

export function isHits(hits: any): hits is Hits {
    for (const roundId in hits) {
        if (!Array.isArray(hits[roundId])) return false;
        for (const hit of hits[roundId]) {
            if (!isHit(hit)) return false;
        }
    }
    return true;
}

export type Hit = {
    id: number;
    x: number;
    y: number;
    divisor: number;
    rings: number;
    innerTen: boolean;
}

export function isHit(hit: any): hit is Hit {
    if (!hit.id) return false;
    if (!hit.x) return false;
    if (!hit.y) return false;
    if (!hit.divisor) return false;
    if (!hit.rings) return false;
    if (!hit.innerTen) return false;
    return true;
}
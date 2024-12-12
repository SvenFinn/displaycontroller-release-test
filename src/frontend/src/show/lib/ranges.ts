import { Range } from "@shared/ranges";
import { floor, getNumberOfDecimalPlaces } from "./math";
import { DisciplineRound } from "@shared/ranges/discipline/round";
import { Hit } from "@shared/ranges/hits";

export function getRoundName(data: Range, roundId?: number): string | null {
    if (!data.active) return null;
    if (!data.discipline) return "Unbekannt";
    if (!roundId) roundId = data.round;
    const round = data.discipline.rounds[roundId];
    if (!round) return "Unbekannt";
    return round.name;
}

export function getHitString(data: Range, roundId?: number, index?: number): string | null {
    const hitArr = getHitArr(data, roundId, index);
    if (!hitArr) return null;
    const hitId = hitArr.shift();
    return `${hitId}: ${hitArr.join(" ")}`;
}

export function getHitArr(data: Range, roundId?: number, index?: number): Array<string> | null {
    if (!data.active) return null;
    if (!data.hits) return null;
    if (!roundId) roundId = data.round;
    const roundHits = data.hits[roundId];
    if (!roundHits) return null;
    if (!index) index = roundHits.length - 1;
    const hit = roundHits[index];
    if (!hit) return null;

    const round = getRound(data, roundId);
    if (!round) return null;

    switch (round.mode.mode) {
        case "rings":
            return [
                `${hit.id}`,
                `${floor(hit.rings, 1).toFixed(1)}${hit.innerTen ? '*' : ''}`]

        case "ringsDiv":
            return [
                `${hit.id}`,
                `${floor(hit.rings, 1).toFixed(1)}${hit.innerTen ? '*' : ''}`,
                `${floor(hit.divisor, 0).toFixed(0)}`
            ]

        case "divider": {
            const acc = getNumberOfDecimalPlaces(round.mode.accuracy);
            return [
                `${hit.id}`,

                `${floor(hit.divisor, acc).toFixed(acc)}`
            ];
        }

        case "fullHidden":
        case "hidden":
            if (round.counts == false) {
                return [
                    `${hit.id}`,
                    `${floor(hit.rings, 1).toFixed(1)}`
                ]
            } else {
                return [
                    "***"
                ]
            }

        case "hundred":
            return [
                `${hit.id}`,
                `${Math.floor((floor(hit.rings, 1) - 1) * 10 + 1)}`
            ]

        case "decimal":
            return [
                `${hit.id}`,

                `${Math.floor(hit.rings * 10) % 10}`
            ]

        case "circle":
            return [
                `${hit.id}`,
                `${hit.x}`,
                `${hit.y}`
            ]

        default:
            return null;
    }
}

export function getSeries(data: Range, roundId?: number, hitCount?: number): Array<string> {
    if (!data.active) return [];
    if (!data.hits) return [];
    if (!roundId) roundId = data.round;
    const round = getRound(data, roundId);
    if (!round) return [];
    if (!hitCount) hitCount = round.hitsPerSum;
    const hits = data.hits[roundId];
    if (!hits) return [];
    const series = [];
    for (let i = 0; i < hits.length; i += hitCount) {
        series.push(accumulateHits(hits, round, i, i + hitCount));
    }
    return series;
}

export function getTotal(data: Range, roundId?: number): string {
    if (!data.active) return "";
    if (!data.hits) return "";
    if (!roundId) roundId = data.round;
    const round = getRound(data, roundId);
    if (!round) return "";
    const hits = data.hits[roundId];
    if (!hits) return "";
    return accumulateHits(hits, round, 0, hits.length);
}

function accumulateHits(hits: Array<Hit>, round: DisciplineRound, startId: number, endId: number): string {
    const acc = getNumberOfDecimalPlaces("accuracy" in round.mode ? round.mode.accuracy : 0);
    const hitsToAccumulate = hits.slice(startId, endId);
    let sum = 0;
    if (round.mode.mode == "divider") {
        sum = Infinity;
    }
    let hitId = 0;
    for (const hit of hitsToAccumulate) {
        if (!hit) continue;
        switch (round.mode.mode) {
            case "divider":
                if (hit.divisor < sum) {
                    sum = floor(hit.divisor, acc);
                    hitId = hit.id;
                }
                break;
            case "rings":
            case "ringsDiv":
            case "fullHidden":
            case "hidden":
                sum += floor(hit.rings, acc);
                break;
            case "hundred":
                sum += (Math.floor(hit.rings) - 1) * 10 + 1;
                break;
            case "decimal":
                sum += Math.floor(hit.rings * 10) % 10;
                break;
            default:
                throw new Error("Unsupported mode");
        }
    }
    switch (round.mode.mode) {
        case "divider":
            if (sum == Infinity) return "";
            return `${sum.toFixed(acc)} (${hitId})`;
        case "hidden":
        case "fullHidden":
            if (round.counts) return "***";
            return sum.toFixed(acc);
        default:
            return sum.toFixed(acc);
    }
}

function getRound(data: Range, roundId?: number): DisciplineRound | null {
    if (!data.active) return null;
    if (!data.discipline) return null;
    if (!roundId) roundId = data.round;
    const round = data.discipline.rounds[roundId];
    if (!round) return null;
    return round;
}


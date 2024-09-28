import { Shooter, isShooter } from './shooter';
import { StartList, isStartList } from './startList';
import { Discipline, isDiscipline } from './discipline';
import { Hits, isHits } from './hits';


type BaseRange = {
    id: number;
}

function isBaseRange(range: any): range is BaseRange {
    return typeof range.id === "number";
}

export type InactiveRange = BaseRange & {
    active: false;
}

export function isInactiveRange(range: any): range is InactiveRange {
    if (!isBaseRange(range)) return false;
    const rangeWType = range as InactiveRange;
    return typeof rangeWType.active === "boolean" && !rangeWType.active;
}

export type ActiveRange = BaseRange & {
    active: true;
    // targetId: number;
    round: number;

    shooter: Shooter | null;
    startList: StartList | null;
    discipline: Discipline | null;
    hits: Hits | null;
    source: Source | null;
}

export function isActiveRange(range: any): range is ActiveRange {
    if (!isBaseRange(range)) return false;
    const rangeWType = range as ActiveRange;
    if (typeof rangeWType.active !== "boolean" || !rangeWType.active) return false;
    if (!rangeWType.round) return false;
    if (!isShooter(rangeWType.shooter) && !rangeWType.shooter === null) return false;
    if (!isStartList(rangeWType.startList) && !rangeWType.startList === null) return false;
    if (!isDiscipline(rangeWType.discipline) && !rangeWType.discipline === null) return false;
    if (!isHits(rangeWType.hits) && !rangeWType.hits === null) return false;
    if (!rangeWType.source) return false;
    return true;
}

export type Range = InactiveRange | ActiveRange;

export function isRange(range: any): range is Range {
    return isInactiveRange(range) || isActiveRange(range);
}

type Source = "multicast" | "log" | "ssmdb2";
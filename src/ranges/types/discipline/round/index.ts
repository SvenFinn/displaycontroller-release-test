import { DisciplineRoundMode, isDisciplineRoundMode } from './mode';
import { DisciplineRoundZoom, isDisciplineRoundZoom } from './zoom';

export type DisciplineRounds = Array<DisciplineRound | null>;

export function isDisciplineRounds(disciplineRounds: any): disciplineRounds is DisciplineRounds {
    if (!Array.isArray(disciplineRounds)) return false;
    for (const disciplineRound of disciplineRounds) {
        if (!isDisciplineRound(disciplineRound)) return false;
    }
    return true;
}

export type DisciplineRound = {
    id: number;
    name: string;

    mode: DisciplineRoundMode;
    maxHits: number;
    counts: boolean;

    zoom: DisciplineRoundZoom;
    layoutId: number;
    hitsPerSum: number;
    hitsPerView: number;

}

export function isDisciplineRound(disciplineRound: any): disciplineRound is DisciplineRound {
    if (!disciplineRound.id) return false;
    if (!disciplineRound.name) return false;
    if (!isDisciplineRoundMode(disciplineRound.mode)) return false;
    if (!disciplineRound.maxHits) return false;
    if (!disciplineRound.counts) return false;
    if (!isDisciplineRoundZoom(disciplineRound.zoom)) return false;
    if (!disciplineRound.layoutId) return false;
    if (!disciplineRound.hitsPerSum) return false;
    if (!disciplineRound.hitsPerView) return false;
    return true;
}
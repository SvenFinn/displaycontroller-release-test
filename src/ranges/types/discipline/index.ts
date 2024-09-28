import { DisciplineRounds, isDisciplineRounds } from './round';
import { DisciplineLayouts, isDisciplineLayouts } from './layout';

export type Discipline = {
    id: number;

    name: string;
    color: string;
    gauge: number;

    rounds: DisciplineRounds;
    layouts: DisciplineLayouts;

}

export function isDiscipline(discipline: any): discipline is Discipline {
    if (!discipline.id) return false;
    if (!discipline.name) return false;
    if (!discipline.color) return false;
    if (!discipline.gauge) return false;
    if (!isDisciplineRounds(discipline.rounds)) return false;
    if (!isDisciplineLayouts(discipline.layouts)) return false;
    return true;
}

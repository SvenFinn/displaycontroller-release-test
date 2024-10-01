import { Hits, isHits } from "../hits";
import { Source, isSource } from "../index";

export type InternalRange = {
    rangeId: number,
    shooter: Shooter,
    discipline: InternalDiscipline,
    startListId: number,
    hits: Hits,
    source: Source
}

export function isInternalRange(range: any): range is InternalRange {
    if (!range.rangeId) return false;
    if (!isShooter(range.shooter)) return false;
    if (!isInternalDiscipline(range.discipline)) return false;
    if (!range.startListId) return false;
    if (!isHits(range.hits)) return false;
    if (!isSource(range.source)) return false;
    return true;
}

type Shooter = ShooterById | ShooterByName;

export function isShooter(shooter: any): shooter is Shooter {
    return isShooterById(shooter) || isShooterByName(shooter);
}

export type ShooterById = number;

export function isShooterById(shooter: any): shooter is ShooterById {
    return typeof shooter === "number";
}

export type ShooterByName = {
    firstName: string,
    lastName: string,
}

export function isShooterByName(shooter: any): shooter is ShooterByName {
    if (!shooter.firstName) return false;
    if (!shooter.lastName) return false;
    return true;
}

export type InternalDiscipline = {
    disciplineId: number,
    overrideId: number,
    roundId: number,
}

export function isInternalDiscipline(discipline: any): discipline is InternalDiscipline {
    if (!discipline.disciplineId) return false;
    if (!discipline.overrideId) return false;
    if (!discipline.roundId) return false;
    return true;
}
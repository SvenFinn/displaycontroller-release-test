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
    if (typeof range !== "object") return false;
    if (typeof range.rangeId !== "number") return false;
    if (!isShooter(range.shooter)) return false;
    if (!isInternalDiscipline(range.discipline)) return false;
    if (typeof range.startListId !== "number") return false;
    if (!isHits(range.hits)) return false;
    if (!isSource(range.source)) return false;
    return true;
}

export type Shooter = ShooterById | ShooterByName;

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
    if (typeof shooter !== "object") return false;
    if (typeof shooter.firstName !== "string") return false;
    if (typeof shooter.lastName !== "string") return false;
    return true;
}

export type InternalDiscipline = {
    disciplineId: number,
    overrideId: number,
    roundId: number,
}

export function isInternalDiscipline(discipline: any): discipline is InternalDiscipline {
    if (typeof discipline !== "object") return false;
    if (typeof discipline.disciplineId !== "number") return false;
    if (typeof discipline.overrideId !== "number") return false;
    if (typeof discipline.roundId !== "number") return false;
    return true;
}
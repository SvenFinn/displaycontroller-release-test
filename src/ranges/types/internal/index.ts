import { Hits, isHits } from "../hits";
import { Source, isSource } from "../index";


export type InternalRange = {
    rangeId: number,
    shooter: Shooter | null,
    discipline: InternalDiscipline | null,
    startListId: number | null,
    hits: Hits,
    source: Source,
    ttl: number,
}

export function isInternalRange(range: any): range is InternalRange {
    if (typeof range !== "object") return false;
    if (typeof range.rangeId !== "number") return false;
    if (range.shooter !== null && !isShooter(range.shooter)) return false;
    if (range.discipline !== null && !isInternalDiscipline(range.discipline)) return false;
    if (range.startListId !== null && typeof range.startListId !== "number") return false;
    if (!isHits(range.hits)) return false;
    if (!isSource(range.source)) return false;
    if (typeof range.ttl !== "number") return false;
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
    if (typeof shooter !== "object" || shooter == null) return false;
    if (typeof shooter.firstName !== "string") return false;
    if (typeof shooter.lastName !== "string") return false;
    return true;
}

export type InternalDiscipline = InternalOverrideDiscipline | NormInternalDiscipline;

export function isInternalDiscipline(discipline: any): discipline is InternalDiscipline {
    return isInternalOverrideDiscipline(discipline) || isNormInternalDiscipline(discipline);
}

type BaseInternalDiscipline = {
    roundId: number,
}

function isBaseInternalDiscipline(discipline: any): discipline is BaseInternalDiscipline {
    if (typeof discipline !== "object") return false;
    if (typeof discipline.roundId !== "number") return false;
    return true;
}

type InternalOverrideDiscipline = BaseInternalDiscipline & {
    overrideId: number,
}

export function isInternalOverrideDiscipline(discipline: any): discipline is InternalOverrideDiscipline {
    if (!isBaseInternalDiscipline(discipline)) return false;
    discipline = discipline as InternalOverrideDiscipline;
    if (typeof discipline.overrideId !== "number") return false;
    return true;
}

type NormInternalDiscipline = BaseInternalDiscipline & {
    disciplineId: number,
}

export function isNormInternalDiscipline(discipline: any): discipline is NormInternalDiscipline {
    if (!isBaseInternalDiscipline(discipline)) return false;
    discipline = discipline as NormInternalDiscipline;
    if (typeof discipline.disciplineId !== "number") return false;
    return true;
}
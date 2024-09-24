function isBaseCondition(condition: any): condition is BaseCondition {
    if (!condition.invert) return false;
    if (condition.invert !== true && condition.invert !== false) return false;
    if (!condition.type) return false;
    return true;
}


type BaseCondition = {
    invert: boolean;
    type: string;
}

export type ConditionMinMax = BaseCondition & {
    type: "ranges_free_count" | "ranges_online_count";
    min: number;
    max: number;
}

export function isConditionMinMax(condition: any): condition is ConditionMinMax {
    if (!isBaseCondition(condition)) return false;
    if (condition.type !== "ranges_free_count" && condition.type !== "ranges_online_count") return false;
    const conditionWType = condition as ConditionMinMax;
    if (!conditionWType.min) return false;
    if (!conditionWType.max) return false;
    return true;
}

export type ConditionNumber = BaseCondition & {
    type: "range_free" | "range_online";
    number: number;
}

export function isConditionNumber(condition: any): condition is ConditionNumber {
    if (!isBaseCondition(condition)) return false;
    if (condition.type !== "range_free" && condition.type !== "range_online") return false;
    const conditionWType = condition as ConditionNumber;
    if (!conditionWType.number) return false;
    return true;
}

export type ConditionNone = BaseCondition & {
    type: "all_ranges_free" | "meyton_available";
}

export function isConditionNone(condition: any): condition is ConditionNone {
    if (!isBaseCondition(condition)) return false;
    if (condition.type !== "all_ranges_free" && condition.type !== "meyton_available") return false;
    return true;
}
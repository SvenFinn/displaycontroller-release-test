import { Condition, ConditionNumber } from "./types";
import { validateNumberCondition } from "./base";

export async function range_online(condition: Condition): Promise<boolean> {
    if (!validateNumberCondition(condition)) return false;
    if (condition.type != "range_online") return false;
    const conditionWType = condition as ConditionNumber;
    // TODO: Implement this function
    return true;
}
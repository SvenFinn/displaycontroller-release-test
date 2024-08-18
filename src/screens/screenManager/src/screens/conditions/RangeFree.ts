import { Condition, ConditionNumber } from "./types";
import { validateNumberCondition } from "./base";

export async function range_free(condition: Condition): Promise<boolean> {
    if (!validateNumberCondition(condition)) return false;
    if (condition.type != "range_free") return false;
    const conditionWType = condition as ConditionNumber;
    // TODO: Implement this function
    return true;
}


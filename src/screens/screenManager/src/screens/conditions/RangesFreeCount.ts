import { validateMinMaxCondition } from "./base";
import { Condition, ConditionMinMax } from "./types";

export async function ranges_free_count(condition: Condition): Promise<boolean> {
    if (!validateMinMaxCondition(condition)) return false;
    if (condition.type != "ranges_free_count") return false;
    const conditionWType = condition as ConditionMinMax;
    // TODO: Implement this function
    return true;
}

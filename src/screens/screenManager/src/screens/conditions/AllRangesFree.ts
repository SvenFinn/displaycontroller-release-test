import { validateNoneCondition } from "./base";
import { Condition } from "./types";

export async function all_ranges_free(condition: Condition): Promise<boolean> {
    if (!validateNoneCondition(condition)) return false;
    if (condition.type != "all_ranges_free") return false;
    // TODO: Implement this function
    return true;
}
import { validateNoneCondition } from "./base";
import { Condition } from "./types";

export async function meyton_available(condition: Condition): Promise<boolean> {
    if (!validateNoneCondition(condition)) return false;
    if (condition.type != "meyton_available") return false;
    return true;
}
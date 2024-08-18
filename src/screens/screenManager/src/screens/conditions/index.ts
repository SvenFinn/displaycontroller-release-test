import { DbScreen } from "../types";
import { validateNoneCondition } from "./base";
import { all_ranges_free } from "./AllRangesFree";
import { meyton_available } from "./MeytonAvailable";
import { range_free } from "./RangeFree";
import { range_online } from "./RangeOnline";
import { ranges_free_count } from "./RangesFreeCount";
import { ranges_online_count } from "./RangesOnlineCount";

export async function checkCondition(screen: DbScreen) {
    if (!screen.condition) return true;
    if (!validateNoneCondition(screen.condition)) return false;
    switch (screen.condition.type) {
        case "all_ranges_free":
            return all_ranges_free(screen.condition);
        case "meyton_available":
            return meyton_available(screen.condition);
        case "range_free":
            return range_free(screen.condition);
        case "range_online":
            return range_online(screen.condition);
        case "ranges_free_count":
            return ranges_free_count(screen.condition);
        case "ranges_online_count":
            return ranges_online_count(screen.condition);
        default:
            return false;
    }
}
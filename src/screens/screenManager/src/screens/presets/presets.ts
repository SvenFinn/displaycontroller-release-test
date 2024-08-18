import { Screen } from "../types";
import { DbScreen } from "../types";


export type Screens = [Screen, ...Screen[]];

export function validateDbScreenBase(screen: DbScreen): boolean {
    if (!screen.id) return false;
    if (!screen.preset) return false;
    if (!screen.options) return false;
    if (!screen.visibleFrom) return false;
    if (!screen.visibleUntil) return false;
    if (!screen.duration) return false;
    if (!screen.createdAt) return false;
    if (!screen.updatedAt) return false;
    return true;
}
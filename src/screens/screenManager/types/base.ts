import { Condition, isScreenCondition } from './conditions';

export type BaseDbScreen = {
    id: number;
    preset: string;
    options: any;
    condition: Condition | null;
    visibleFrom: number;
    visibleUntil: number;
    duration: number;
    createdAt: Date;
    updatedAt: Date;
}

export function isBaseDbScreen(screen: any): screen is BaseDbScreen {
    if (!screen.id) return false;
    if (!screen.preset) return false;
    if (!screen.options) return false;
    if (screen.condition && !isScreenCondition(screen.condition)) return false;
    if (!screen.visibleFrom) return false;
    if (!screen.visibleUntil) return false;
    if (!screen.duration) return false;
    if (!screen.createdAt) return false;
    if (!screen.updatedAt) return false;
    return true;
}

export type BaseScreenAvailable = {
    available: true;
    id: number;
    subId: number;
    preset: string;
    path: string;
    options: Record<string, any>;
    duration: number;
}

export function isBaseScreenAvailable(screen: any): screen is BaseScreenAvailable {
    if (!screen.available) return false;
    if (!screen.id) return false;
    if (!screen.subId) return false;
    if (!screen.preset) return false;
    if (!screen.path) return false;
    if (!screen.options) return false;
    if (!screen.duration) return false;
    return true;
}

export type ScreenUnavailable = {
    available: false;
}

export function isScreenUnavailable(screen: any): screen is ScreenUnavailable {
    return !screen.available;
}
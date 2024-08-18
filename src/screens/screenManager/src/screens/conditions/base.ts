import { Condition } from './types'

export function validateMinMaxCondition(condition: Condition): boolean {
    if (!validateNoneCondition(condition)) return false
    // @ts-ignore
    if (!condition.min) return false
    // @ts-ignore
    if (!condition.max) return false
    return true
}

export function validateNumberCondition(condition: Condition): boolean {
    if (!validateNoneCondition(condition)) return false
    // @ts-ignore
    if (!condition.number) return false
    return true
}

export function validateNoneCondition(condition: Condition): boolean {
    if (!condition.invert) return false
    if (!condition.type) return false
    return true
}
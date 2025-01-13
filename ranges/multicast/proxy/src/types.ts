export type RangeProxyType = {
    ip: string,
    message: string
}

export function isRangeProxy(obj: any): obj is RangeProxyType {
    return typeof obj.ip == "string" && typeof obj.message === "string";
}
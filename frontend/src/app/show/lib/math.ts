
export function floor(x: number, decimals: number): number {
    return Number(`${Math.floor(Number(`${x}e${decimals}`))}e-${decimals}`);
}

export function round(x: number, decimals: number): number {
    return Number(`${Math.round(Number(`${x}e${decimals}`))}e-${decimals}`);
}

export function getNumberOfDecimalPlaces(x: number): number {
    const text = x.toString();

    if (text.indexOf("e-") > -1) {
        const [, trail] = text.split("e-");

        const dec = parseInt(trail, 10);
        return dec;
    }

    if (Math.floor(x) !== x) {
        return x.toString().split(".")[1].length || 0;
    }
    return 0;
}
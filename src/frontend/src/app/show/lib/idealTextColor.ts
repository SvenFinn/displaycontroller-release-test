export function idealTextColor(bgColor: string): string {
    const r = bgColor.substring(1, 3);
    const g = bgColor.substring(3, 5);
    const b = bgColor.substring(5, 7);

    const components = {
        R: parseInt(r, 16),
        G: parseInt(g, 16),
        B: parseInt(b, 16)
    };
    const nThreshold = 105;

    const bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);

    return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
}
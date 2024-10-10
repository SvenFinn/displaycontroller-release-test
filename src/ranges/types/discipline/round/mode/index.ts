export type DisciplineRoundMode = DisciplineRoundModeRings | DisciplineRoundModeDivider | DisciplineRoundModeCircle | DisciplineRoundModeFullHidden | DisciplineRoundModeHundred | DisciplineRoundModeRingsDiv | DisciplineRoundModeHidden | DisciplineRoundModeDecimal;

type DisciplineRoundModeRings = {
    mode: "rings",
    accuracy: number
}

type DisciplineRoundModeDivider = {
    mode: "divider",
    accuracy: number
}

type DisciplineRoundModeCircle = {
    mode: "circle"
}

type DisciplineRoundModeFullHidden = {
    mode: "fullHidden"
}

type DisciplineRoundModeHundred = {
    mode: "hundred"
}

type DisciplineRoundModeRingsDiv = {
    mode: "ringsDiv",
    accuracy: number
}

type DisciplineRoundModeHidden = {
    mode: "hidden"
}

type DisciplineRoundModeDecimal = {
    mode: "decimal",
}

export function isDisciplineRoundMode(disciplineRoundMode: any): disciplineRoundMode is DisciplineRoundMode {
    if (typeof disciplineRoundMode !== "object") return false;
    if (typeof disciplineRoundMode.mode !== "string") return false;
    if (disciplineRoundMode.mode !== "rings" && disciplineRoundMode.mode !== "divider" && disciplineRoundMode.mode !== "ringsDiv") return true;
    if (typeof disciplineRoundMode.accuracy !== "number") return false;
    return true;
}
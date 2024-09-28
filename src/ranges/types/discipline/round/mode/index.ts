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
    if (!disciplineRoundMode.mode) return false;
    if (disciplineRoundMode.mode === "rings" && !disciplineRoundMode.accuracy) return false;
    if (disciplineRoundMode.mode === "divider" && !disciplineRoundMode.accuracy) return false;
    if (disciplineRoundMode.mode === "ringsDiv" && !disciplineRoundMode.accuracy) return false;
    return true;
}
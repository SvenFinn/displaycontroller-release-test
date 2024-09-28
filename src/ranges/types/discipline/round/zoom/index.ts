export type DisciplineRoundZoom = DisciplineRoundZoomFixed | DisciplineRoundZoomAuto | DisciplineRoundZoomNone;

type DisciplineRoundZoomFixed = {
    mode: "fixed",
    value: number,
}

type DisciplineRoundZoomAuto = {
    mode: "auto",
}

type DisciplineRoundZoomNone = {
    mode: "none",
}


export function isDisciplineRoundZoom(disciplineRoundZoom: any): disciplineRoundZoom is DisciplineRoundZoom {
    if (!disciplineRoundZoom.mode) return false;
    if (disciplineRoundZoom.mode === "fixed" && !disciplineRoundZoom.value) return false;
    return true;
}
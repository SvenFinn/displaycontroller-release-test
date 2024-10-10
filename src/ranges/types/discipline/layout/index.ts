export type DisciplineLayouts = {
    [layoutId: number]: DisciplineLayout;
}

export type DisciplineLayout = Array<DisciplineLayoutRing>;

export type DisciplineLayoutRing = {
    value: number;
    diameter: number;
    colored: boolean;
}

export function isDisciplineLayouts(disciplineLayouts: any): disciplineLayouts is DisciplineLayouts {
    for (const layoutId in disciplineLayouts) {
        if (!Array.isArray(disciplineLayouts[layoutId])) return false;
        for (const disciplineLayoutRing of disciplineLayouts[layoutId]) {
            if (!isDisciplineLayoutRing(disciplineLayoutRing)) return false;
        }
    }
    return true;
}

export function isDisciplineLayoutRing(disciplineLayoutRing: any): disciplineLayoutRing is DisciplineLayoutRing {
    if (typeof disciplineLayoutRing !== "object") return false;
    if (typeof disciplineLayoutRing.value !== "number") return false;
    if (typeof disciplineLayoutRing.diameter !== "number") return false;
    if (typeof disciplineLayoutRing.colored !== "boolean") return false;
    return true;
}
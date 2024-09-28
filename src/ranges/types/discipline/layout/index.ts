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
    if (!disciplineLayoutRing.value) return false;
    if (!disciplineLayoutRing.diameter) return false;
    if (!disciplineLayoutRing.colored) return false;
    return true;
}
export type LogLine = {
    rangeId: number,
    targetId: number,
    action: "d" | "i",
    shooter: {
        name: string,
        id: number,
        team: string,
        club: string,
        class: {
            name: string,
            id: number,
        },
    },
    discipline: {
        name: string,
        id: number,
    },
    round: {
        name: string,
        id: number,
    },
    hit: {
        id: number,
        x: number,
        y: number,
        distance: number,
        innerRing: boolean,
        rings: number,
        timestamp: Date,
    },
}
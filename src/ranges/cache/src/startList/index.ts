import { SmdbClient } from "dc-db-smdb";
import { SpecialDiscipline, StartList } from "@shared/ranges/startListCache"
import { StartListTypes } from "dc-db-smdb/generated/client";

export async function getStartListCache(smdbCLient: SmdbClient): Promise<Array<StartList>> {
    const startListsDb = await smdbCLient.startList.findMany({
        where: {
            id: {
                gt: 0 // Special case, because Meyton uses 0 as a "empty" value
            }
        },
        select: {
            id: true,
        }
    });
    const startLists = await Promise.all(startListsDb.map(async startList => {
        return await getStartList(smdbCLient, startList.id);
    }));
    return startLists.filter(startList => startList !== null) as StartList[];
}

async function getStartList(smdbClient: SmdbClient, startListId: number): Promise<StartList | null> {
    const startListDb = await smdbClient.startList.findUnique({
        where: {
            id: startListId
        },
        select: {
            id: true,
            type: true,
            startDate: true,
            endDate: true,
            name: true,
        }
    });
    if (!startListDb) {
        return null;
    }
    let startListDbActive: boolean = false;
    if (startListDb.startDate && startListDb.endDate) {
        const startDate = new Date(startListDb.startDate);
        const endDate = new Date(startListDb.endDate);
        const currentDate = new Date();
        startListDbActive = startDate <= currentDate && currentDate <= endDate;
    }
    const startList: StartList = {
        id: startListDb.id,
        name: startListDb.name,
        active: startListDbActive,
        type: getStartListType(startListDb.type),
        specialDisciplines: await getSpecialDisciplines(smdbClient, startListDb.id),
    };
    return startList;
}

function getStartListType(type: StartListTypes): StartList["type"] {
    switch (type) {
        case StartListTypes.default:
            return "default";
        case StartListTypes.league:
            return "league";
        case StartListTypes.roundRobin:
            return "round";
        case StartListTypes.final:
            return "final";
        case StartListTypes.priceShooting:
            return "price";
    }
}

async function getSpecialDisciplines(smdbClient: SmdbClient, startListId: number): Promise<Array<SpecialDiscipline>> {
    const specialDisciplinesDb = await smdbClient.startList.findUnique({
        where: {
            id: startListId
        },
        include: {
            priceShooting: {
                select: {
                    id: true,
                    disciplineId: true,
                    name: true,
                    color: true,
                }
            }
        }
    });
    if (!specialDisciplinesDb) {
        return [];
    }
    return specialDisciplinesDb.priceShooting.map(specialDiscipline => {
        return {
            id: specialDiscipline.id,
            disciplineId: specialDiscipline.disciplineId,
            name: specialDiscipline.name,
            color: specialDiscipline.color,
        }
    });
}

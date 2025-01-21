import { InternalRange } from "@shared/ranges/internal";
import { Ssmdb2Client } from "dc-db-ssmdb2";
import { getRangeData } from "./range";

export async function getRanges(ssmdb2Client: Ssmdb2Client): Promise<InternalRange[]> {
    const localTime = new Date((new Date()).setMinutes((new Date()).getMinutes() - new Date().getTimezoneOffset()));
    const targets = await ssmdb2Client.target.findMany(
        {
            where: {
                timestamp:
                {
                    gt: new Date(localTime.getTime() - 1000)
                }
            },
            select: {
                rangeId: true,
                id: true,
                timestamp: true,
            },
            orderBy: {
                timestamp: 'desc'
            },
            distinct: ['rangeId'],
        });
    return (await Promise.all(targets.map(async (target) => getRangeData(ssmdb2Client, target.id)))).filter((range) => range !== null) as InternalRange[];
}
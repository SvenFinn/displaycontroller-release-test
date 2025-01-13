import { LocalClient } from "dc-db-local";


export async function getRangeId(prismaClient: LocalClient, rangeIp: string): Promise<number | null> {
    const range = await prismaClient.knownRanges.findUnique({
        where: {
            ipAddress: rangeIp
        }
    });
    if (!range) {
        const rangeIdStr = rangeIp.split(".")?.pop();
        if (!rangeIdStr) {
            throw new Error(`Could not resolve range id for ip ${rangeIp}`);
        }
        let rangeId = parseInt(rangeIdStr);
        if (isNaN(rangeId)) {
            throw new Error(`Could not resolve range id for ip ${rangeIp}`);
        }
        const exists = await prismaClient.knownRanges.findUnique({
            where: {
                rangeId: rangeId
            }
        });
        if (exists) {
            return null;
        }
        await prismaClient.knownRanges.create({
            data: {
                rangeId: rangeId,
                ipAddress: rangeIp
            }
        });
        return rangeId;
    }
    return range.rangeId;
}
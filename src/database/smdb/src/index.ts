import { PrismaClient as SmdbClient } from '../generated/client';
import { LocalClient } from "dc-db-local";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.MEYTON_DB_USER || !process.env.MEYTON_DB_PASS) {
    throw new Error("Please provide the MEYTON_DB_USER and MEYTON_DB_PASS environment variables");
}

export { PrismaClient as SmdbClient } from '../generated/client';

export async function createSMDBClient(local?: LocalClient): Promise<SmdbClient> {
    if (!local) {
        local = new LocalClient();
    }
    const server = (await local.parameter.findUnique({
        where: {
            key: "MEYTON_SERVER_IP"
        }
    }))?.strValue;
    if (!server) {
        throw new Error("MEYTON_SERVER_IP parameter not found");
    }
    const smdbClient = new SmdbClient({
        datasources: {
            db: {
                url: `mysql://${process.env.MEYTON_DB_USER}:${process.env.MEYTON_DB_PASS}@${server}:3306/SMDB`
            }
        }
    });
    await smdbClient.$connect();
    return smdbClient;
}
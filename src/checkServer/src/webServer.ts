import express, { Request, Response, Express } from "express";
import { AdvServerState } from "./types";
import { logger } from "dc-logger";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger-output.json';

const app: Express = express();

let serverInf: AdvServerState = {
    online: false
};

let sockets: Response[] = [];

app.use('/api/serverState/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/api/serverState", (req: Request, res: Response) => {
    //#swagger.summary = 'Get whether the server is currently online & compatible'
    res.status(200).send(serverInf.online ? serverInf.compatible : false);
    /*
    #swagger.responses[200] = {
        description: 'Server is online and compatible',
        schema: true
    }
    */
});

app.get("/api/serverState/full", (req: Request, res: Response) => {
    // #swagger.summary = 'Get the full state of the server'
    res.status(200).send(serverInf);
    /*
    #swagger.responses[200] = {
        description: 'Server state',
        schema: {
            oneOf: [
                    { $ref: '#/components/schemas/AdvServerStateOnline' },
                    { $ref: '#/components/schemas/AdvServerStateOffline' }
            ],
        }
    }
    */
});

app.get("/api/serverState/sse", (req: Request, res: Response) => {
    // #swagger.summary = 'Server Sent Events Channel for the server state'
    // #swagger.description = 'Server Sent Events Channel, reporting the current state of the meyton server as a JSON-encoded boolean.<br>The connection will be kept alive until the client closes it.'
    logger.info("New sse connection");
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Content-Encoding': 'none',
    };
    res.writeHead(200, headers);
    /* #swagger.responses[200] = {
        description: 'Server Sent Events Channel',
        schema: true
    }*/

    res.write("retry: 10000\n\n");
    res.write(`data: ${serverInf.online ? serverInf.compatible : false}\n\n`);

    sockets.push(res);

    req.on("close", () => {
        sockets = sockets.filter((socket) => socket !== res);
    });
});

export function updateServerState(newServerInf: AdvServerState) {
    logger.info("Sending sse");
    serverInf = newServerInf;
    sockets.forEach((socket) => {
        socket.write(`data: ${serverInf.online ? serverInf.compatible : false}\n\n`);
    });
}

app.listen(80, () => {
    logger.info("Listening on port 80");
});
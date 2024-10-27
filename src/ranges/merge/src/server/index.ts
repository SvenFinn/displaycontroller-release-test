import express, { Express, Request, Response } from 'express';
import { LocalClient } from 'dc-db-local';
import { rangesData } from '../data';
import { logger } from '../logger';

const app: Express = express();
const localClient: LocalClient = new LocalClient();

export type rangesSSE = {
    ranges: number[] | null;
    response: Response;
}

let sseConnections: rangesSSE[] = [];

app.get('/api/ranges(/)?', async (req: Request, res: Response) => {
    res.status(200).send([...rangesData.keys()]);
});

app.get('/api/ranges/free(/)?', async (req: Request, res: Response) => {
    const freeRanges = [...rangesData.keys()].filter((range) => {
        const rangeData = rangesData.get(range);
        if (rangeData && rangeData.active === true) {
            return rangeData.shooter === null;
        }
        return false;
    })
    res.status(200).send(freeRanges);
});

app.get('/api/ranges/:range(/)?', async (req: Request, res: Response) => {
    const range: number = parseInt(req.params.range);
    if (rangesData.has(range)) {
        res.status(200).send(rangesData.get(range));
    } else {
        res.status(404).send('Range not found');
    }
});

app.get('/api/ranges/sse', async (req: Request, res: Response) => {
    const rangesSSE: rangesSSE = { ranges: null, response: res };
    if (req.query.ranges) {
        const ranges: number[] = JSON.parse(req.query.ranges.toString());
        rangesSSE.ranges = ranges;
    }
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Content-Encoding': 'none',
    };
    res.writeHead(200, headers);

    res.write("retry: 10000\n\n");
    if (rangesSSE.ranges) {
        for (const range of rangesData.keys()) {
            if (rangesSSE.ranges.includes(range)) {
                res.write(`data: ${JSON.stringify(rangesData.get(range))}\n\n`);
            }
        }
    } else {
        for (const range of rangesData.keys()) {
            res.write(`data: ${JSON.stringify(rangesData.get(range))}\n\n`);
        }
    }

    sseConnections.push(rangesSSE);

    req.on("close", () => {
        sseConnections = sseConnections.filter((obj) => obj !== rangesSSE);
    });
});

app.get('/api/ranges/known(/)?', async (req: Request, res: Response) => {
    const knownRanges = await localClient.knownRanges.findMany();
    res.status(200).send(knownRanges);
});

app.get('/api/ranges/known/:rangeIp(/)?', async (req: Request, res: Response) => {
    const rangeIp: string = req.params.rangeIp;
    const knownRange = await localClient.knownRanges.findUnique(
        {
            where: {
                ipAddress: rangeIp,
            },
        }
    );
    if (knownRange) {
        res.status(200).send(knownRange);
    } else {
        res.status(404).send('Known range not found');
    }
});

app.post('/api/ranges/known/:rangeIp(/)?', async (req: Request, res: Response) => {
    const rangeIp: string = req.params.rangeIp;
    const rangeId = parseInt(req.body);
    if (isNaN(rangeId)) {
        res.status(400).send('Invalid range ID');
        return;
    }
    const elements = rangeIp.split('.');
    if (elements.length !== 4 || elements.some((element) => isNaN(parseInt(element)) || parseInt(element) < 0 || parseInt(element) > 255)) {
        res.status(400).send('Invalid IP address');
        return;
    }
    const knownRange = await localClient.knownRanges.upsert({
        where: {
            ipAddress: rangeIp,
        },
        create: {
            ipAddress: rangeIp,
            rangeId: rangeId,
        },
        update: {
            rangeId: rangeId,
        },
    });
    res.status(200).send(knownRange);
});

app.delete('/api/ranges/known/:rangeIp(/)?', async (req: Request, res: Response) => {
    const rangeIp: string = req.params.rangeIp;
    const knownRange = await localClient.knownRanges.delete({
        where: {
            ipAddress: rangeIp,
        },
    });
    res.status(200).send(knownRange);
});

app.listen(80, () => {
    logger.info('Listening on port 80');
});
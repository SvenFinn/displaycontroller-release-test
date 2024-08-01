import express, { Express, Request } from "express";
import * as fs from "fs";
import pino from "pino";
import path from "path";

const logger = pino({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
        },
    },
});

const basePath = path.resolve(`${__dirname}/../html`);

const app: Express = express();

app.get("/api/evaluations/?*", (req: Request, res) => {
    logger.info(`GET ${req.params[0]}`);
    if (req.params[0].includes("..")) {
        logger.info("Found .. in path");
        res.status(404).send("File not found");
        return;
    }
    const path = `${basePath}/${req.params[0]}`;
    if (!fs.existsSync(path)) {
        logger.info("File not found");
        res.status(404).send("File not found");
        return
    }
    if (fs.lstatSync(path).isDirectory()) {
        logger.info("Scanning directory");
        const files = fs.readdirSync(path);
        const response = files.map((file) => {
            return {
                name: file,
                type: fs.lstatSync(`${path}/${file}`).isDirectory() ? "folder" : "file"
            }
        });
        res.status(200).send(response);
    } else {
        res.status(200).sendFile(path);
    }
});

app.listen(80, () => {
    logger.info("Listening on port 80");
});
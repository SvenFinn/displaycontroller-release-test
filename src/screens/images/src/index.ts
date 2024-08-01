import express, { Express, Request } from "express";
import * as dotenv from "dotenv";
import * as fs from "fs";
import fileUpload from "express-fileupload";
import { fromPath } from "pdf2pic";
import pino from "pino";

dotenv.config();
const logger = pino({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
        },
    },
});

const basePath = `${__dirname}/files`;

const app: Express = express();
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
}));

app.get("/api/images/?*", (req: Request, res) => {
    logger.info(`GET ${req.params[0]}`);
    if (req.params[0].includes("..")) {
        logger.info("Found .. in path");
        res.status(404).sendFile("img/404.png", { root: __dirname });
        return;
    }
    const path = `${basePath}/${req.params[0]}`;
    if (!fs.existsSync(path)) {
        logger.info("File not found");
        res.status(404).sendFile("img/404.png", { root: __dirname });
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

async function handleFiles(files: fileUpload.FileArray, path: string) {
    for (const [key, file] of Object.entries(files)) {
        if (Array.isArray(file)) {
            for (const f of file) {
                logger.debug(`Handling file ${f.name}`);
                await handleFile(f, path);
            }
        } else {
            logger.debug(`Handling file ${file.name}`);
            await handleFile(file, path);
        }
    }
}

async function handleFile(file: fileUpload.UploadedFile, path: string) {
    if (file.mimetype === "application/pdf") {
        logger.info("Converting PDF to images");
        if (fs.existsSync(`${path}/${file.name}`)) {
            fs.rmSync(`${path}/${file.name}`, { recursive: true });
        }
        fs.mkdirSync(`${path}/${file.name}`);
        const pdf = fromPath(file.tempFilePath, {
            density: 300,
            savePath: path + "/" + file.name,
            saveFilename: "page",
            format: "png",
            preserveAspectRatio: true,
        });
        await pdf.bulk(-1);
    } else {
        await file.mv(`${path}/${file.name}`);
    }
}

app.post("/api/images/?*", async (req: Request, res) => {
    logger.info(`POST ${req.params[0]}`);
    if (req.params[0].includes("..")) {
        logger.info("Found .. in path");
        res.status(400).send("Cannot create file");
        return;
    }
    const path = `${basePath}/${req.params[0]}`;
    if (!fs.existsSync(path)) {
        logger.debug("Creating folder");
        await new Promise<void>((resolve, reject) => {
            fs.mkdir(path, { recursive: true }, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
        res.status(200).send("Folder created");
    }
    if (!req.files) {
        res.status(400).send("No files uploaded");
        return;
    }
    try {
        await handleFiles(req.files, path);
        res.status(200).send("Files uploaded");
    } catch (err) {
        logger.warn(err);
        res.status(500).send("Error uploading files");
    }
});

app.delete("/api/images/?*", (req: Request, res) => {
    logger.info(`DELETE ${req.params[0]}`);
    if (req.params[0].includes("..")) {
        res.status(400).send("Cannot delete file");
        return;
    }
    const path = `${basePath}/${req.params[0]}`;
    if (!fs.existsSync(path)) {
        res.status(404).send("File not found");
        return;
    }
    if (fs.lstatSync(path).isDirectory()) {
        fs.rm(path, { recursive: true }, (err) => {
            if (err) {
                res.status(500).send("Error deleting folder");
                return;
            }
            res.status(200).send("Folder deleted");
        });
    } else {
        fs.unlink(path, (err) => {
            if (err) {
                res.status(500).send("Error deleting file");
                return;
            }
            res.status(200).send("File deleted");
        });
    }
});


app.listen(80, () => {
    logger.info("Server is running on port 80");
});

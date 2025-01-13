import { LogLine } from "./types"
import { logger } from "dc-logger";

export function parseLine(line: string): undefined | LogLine {
    logger.debug("Parsing line", line);
    const values = line.split(";");
    for (let i = 0; i < values.length; i++) {
        values[i] = values[i].replace(/^"|"$/g, "");
        values[i] = values[i].trim();
    }
    if (values.length != 30) {
        logger.warn("log line was smaller than expected");
        return undefined;
    }
    try {
        const logInformation: LogLine = {
            rangeId: parseInt(values[0]),
            targetId: parseTargetId(values[26]) || -1,
            action: values[27] as "d" | "i",
            shooter: {
                name: values[6],
                id: parseInt(values[7]),
                team: values[8],
                club: values[9],
                class: {
                    name: values[10],
                    id: parseInt(values[11]),
                },
            },
            discipline: {
                name: values[2],
                id: parseInt(values[3]),
            },
            round: {
                name: values[4],
                id: parseInt(values[5]),
            },
            hit: {
                id: parseInt(values[13]),
                x: parseFloat(values[17]) / 100,
                y: parseFloat(values[18]) / 100,
                distance: parseFloat(values[19]),
                innerRing: values[28] === "IZ",
                rings: parseFloat(values[16].replace(/,/gi, ".")),
                timestamp: parseTimeStamp(values[15] + " " + values[14]) || new Date(),
            }
        }
        return logInformation;
    } catch (error) {
        return undefined;
    }
}

function parseTargetId(targetId: string): undefined | number {
    if (targetId.match("0x") != null) {
        const intTargetId = parseInt(targetId, 16);
        if (intTargetId > 2147483647) {
            return intTargetId - 4294967296;
        }
        return intTargetId;
    }
    return undefined;
}

function parseTimeStamp(timestamp: string): undefined | Date {
    const splitTimestamp = timestamp.split(" ");
    if (splitTimestamp.length != 2) {
        return undefined;
    }
    const fixedTimestamp = splitTimestamp.map((value) => {
        return value.trim();
    }).filter((value) => {
        return value.length > 0;
    });
    const date = fixedTimestamp[0].split(".");
    const tempTime = fixedTimestamp[1].split(":");
    if (date.length != 3 || tempTime.length != 3) {
        return undefined;
    }
    const time = [tempTime[0], tempTime[1], ...tempTime[2].split(".")];
    const year = parseInt(date[2]);
    const month = parseInt(date[1]) - 1;
    const day = parseInt(date[0]);
    const hours = parseInt(time[0]);
    const minutes = parseInt(time[1]);
    const seconds = parseInt(time[2]);
    const milliseconds = parseInt(time[3]);
    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours) || isNaN(minutes) || isNaN(seconds) || isNaN(milliseconds)) {
        return undefined;
    }
    return new Date(year, month, day, hours, minutes, seconds, milliseconds);
}
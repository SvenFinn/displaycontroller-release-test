import { Hits } from "@shared/ranges/hits";
import { LogLine } from "../logReader/types";
import { InternalDiscipline, InternalRange, isInternalOverrideDiscipline, InternalShooterById } from "@shared/ranges/internal"
import { logger } from "dc-logger";
import { TTLHandler } from "dc-ranges-ttl";
import { Channel } from "amqplib";
import { isSameShooter } from "../cache/shooter";
import { getDisciplineId } from "../cache/overrides";

export class RangeGen {
    private readonly rangeId: number;
    private targetId: number;
    private shooter: InternalShooterById | null;
    private disciplineId: number;
    private hits: Hits;
    private multicast: TTLHandler<InternalRange>;

    constructor(rangeId: number,) {
        this.rangeId = rangeId;
        this.targetId = 0;
        this.shooter = null;
        this.disciplineId = 0;
        this.hits = [];
        this.multicast = new TTLHandler();
    }

    public addLogLine(logLine: LogLine) {
        if (logLine.rangeId !== this.rangeId) {
            logger.warn("RangeId mismatch", logLine.rangeId, this.rangeId);
            return;
        }
        if (this.targetId != logLine.targetId) {
            logger.info(`TargetId changed, resetting range ${this.rangeId}`);
            this.targetId = logLine.targetId;
            this.disciplineId = logLine.discipline.id;
            this.hits = [];
        }
        if (this.shooter !== logLine.shooter.id) {
            if (logLine.shooter.id == 0) {
                this.shooter = null;
            } else {
                this.shooter = logLine.shooter.id;
            }
        }
        this.addHit(logLine);
    }

    public async setMulticastInfo(multicastInfo: InternalRange) {
        if (multicastInfo.rangeId !== this.rangeId) {
            return
        }
        this.multicast.setMessage(multicastInfo);
    }

    private async addHit(logLine: LogLine) {
        logger.debug(`Adding hit to range ${this.rangeId}`);
        if (!this.hits[logLine.round.id]) {
            this.hits[logLine.round.id] = [];
        }
        // Delete hit
        if (logLine.action === "d") {
            const hits = this.hits[logLine.round.id];
            if (!hits) {
                return;
            }
            // Check if hit exists
            const hitExists = hits.find(hit => hit.id === logLine.hit.id);
            if (hitExists) {
                // Remove hit and renumber the rest
                this.hits[logLine.round.id] = hits.filter(hit => hit.id !== logLine.hit.id);
                for (let i = 0; i < hits.length; i++) {
                    const hit = hits[i];
                    if (hit.id > logLine.hit.id) {
                        hit.id--;
                    }
                }
            }
        } else {
            // Add hit
            const hits = this.hits[logLine.round.id] || [];

            const hitExists = hits.find(hit => hit.id === logLine.hit.id);
            if (hitExists) {
                // Renumber the rest of hits
                for (let i = 0; i < hits.length; i++) {
                    if (hits[i].id < logLine.hit.id) {
                        continue;
                    } else {
                        hits[i].id++;
                    }
                }
            }
            this.hits[logLine.round.id]?.push({
                id: logLine.hit.id,
                x: logLine.hit.x,
                y: logLine.hit.y,
                divisor: logLine.hit.distance,
                rings: logLine.hit.rings,
                innerTen: logLine.hit.innerRing,
            });
            this.hits[logLine.round.id]?.sort((a, b) => a.id - b.id);
        }
    }

    private getRoundId(): number {
        if (this.hits.length === 0) {
            return 0;
        }
        return this.hits.length - 1;
    }

    private isShooter(): boolean {
        if (!this.shooter) {
            return false;
        }
        const multicastInfo = this.multicast.getMessage();
        if (multicastInfo === null || !multicastInfo.shooter) {
            return false;
        }
        return isSameShooter(this.shooter, multicastInfo.shooter);
    }

    private getDiscipline(): InternalDiscipline | null {
        const multicastInfo = this.multicast.getMessage();
        if (multicastInfo === null || !multicastInfo.discipline) {
            if (this.disciplineId === 0) {
                return null;
            }
            return {
                disciplineId: this.disciplineId,
                roundId: this.getRoundId(),
            }
        }
        if (isInternalOverrideDiscipline(multicastInfo.discipline)) {
            const multicastDisciplineId = getDisciplineId(multicastInfo.discipline.overrideId);
            if (multicastDisciplineId === this.disciplineId) {
                return {
                    overrideId: multicastInfo.discipline.overrideId,
                    roundId: this.getRoundId(),
                }
            }
        }
        return {
            disciplineId: this.disciplineId,
            roundId: this.getRoundId(),
        }
    }

    public async getRange(): Promise<InternalRange | null> {
        logger.debug(`Generating rangeData for range ${this.rangeId}`);
        const multicastInfo = this.multicast.getMessage();
        if (!this.shooter || this.hits.length === 0 || multicastInfo == null) {
            return null;
        };
        if (!await this.isShooter()) {
            return null
        }
        return {
            rangeId: this.rangeId,
            shooter: this.shooter,
            discipline: await this.getDiscipline(),
            startListId: multicastInfo.startListId,
            hits: this.hits,
            source: "log",
            ttl: 20000
        }
    }

    public async sendRange(channel: Channel) {
        const rangeData = await this.getRange();
        if (rangeData !== null) {
            logger.info(`Sending log data for range ${this.rangeId}`);
            channel.publish("ranges.log", "", Buffer.from(JSON.stringify(rangeData)));
        }
    }
}

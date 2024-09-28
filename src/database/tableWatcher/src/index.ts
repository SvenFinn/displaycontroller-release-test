import { PrismaClient } from '@prisma/client';
import { EventEmitter } from 'events';

export class TableWatcher extends EventEmitter {
    private prisma: PrismaClient;
    private tables: string[];
    private interval: number;
    private checksums: Record<string, number> = {};
    private nodeInterval: NodeJS.Timeout | null = null;
    private serverState: boolean = false;

    constructor(prisma: PrismaClient, tables: string[], interval: number = 10000) {
        super();
        this.prisma = prisma;
        this.tables = tables;
        this.interval = interval;
        for (let i = 0; i < this.tables.length; i++) {
            this.checksums[this.tables[i]] = 0;
        }

    }

    public async start() {
        this.stop();
        this.nodeInterval = setInterval(() => this.watch(), this.interval);
    }

    public async stop() {
        if (this.nodeInterval !== null) {
            clearInterval(this.nodeInterval);
        }
    }

    public async setInterval(interval: number) {
        this.interval = interval;
        this.start();
    }

    private async watch() {
        let changed: string[] = [];
        await Promise.all(this.tables.map(async (table) => {
            try {
                let checksum = await this.prisma.$queryRawUnsafe(`CHECKSUM TABLE ${table}`) as { Checksum: number };
                if (checksum.Checksum !== this.checksums[table]) {
                    changed.push(table);
                    this.checksums[table] = checksum.Checksum;
                }
            } catch (error) {
                console.error(error);
                return;
            }
        }));
        if (changed.length > 0) {
            this.emit('change', changed);
        }
    }
}
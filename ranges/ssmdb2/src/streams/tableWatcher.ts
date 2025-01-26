import { Ssmdb2Client } from "dc-db-ssmdb2";
import { TableWatcherFast } from "dc-table-watcher";
import { Readable } from "stream";

export class TableWatcherStream extends Readable {
    private tableWatcher: TableWatcherFast;

    constructor(prisma: Ssmdb2Client, tables: string[], interval?: number, fastInterval?: number, fastTimeout?: number) {
        super({ objectMode: true });
        this.tableWatcher = new TableWatcherFast(prisma, tables, interval, fastInterval, fastTimeout);
        this.tableWatcher.on('change', (tables: string[]) => {
            this.push(tables);
        });
        this.tableWatcher.start();
    }

    _read() {
        // Do nothing
    }
}
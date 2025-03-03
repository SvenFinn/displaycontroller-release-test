import { InternalRange } from "@shared/ranges/internal";
import { Transform, TransformCallback } from "stream";
import { logger } from "dc-logger";

export class DebounceStream extends Transform {
    private ranges: Map<number, NodeJS.Timeout> = new Map();
    private debounceTime: number;

    constructor(debounceTime: number) {
        super({ objectMode: true });
        this.debounceTime = debounceTime;
    }

    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
        const range = chunk as InternalRange;
        logger.debug(`Debouncing range ${range.rangeId}`);
        if (this.ranges.has(range.rangeId)) {
            clearTimeout(this.ranges.get(range.rangeId)!);
        }
        this.ranges.set(range.rangeId,
            setTimeout(() => {
                this.push(range);
                this.ranges.delete(range.rangeId);
            }, this.debounceTime)
        );
        callback();
    }
}
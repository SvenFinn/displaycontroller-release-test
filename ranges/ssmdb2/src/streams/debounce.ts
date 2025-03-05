import { InternalRange } from "@shared/ranges/internal";
import { Transform, TransformCallback } from "stream";
import { logger } from "dc-logger";

type RangeDebounce = {
    data: InternalRange;
    debounce: NodeJS.Timeout;
}

export class DebounceStream extends Transform {
    private ranges: Map<number, RangeDebounce> = new Map();
    private debounceTime: number;

    constructor(debounceTime: number) {
        super({ objectMode: true });
        this.debounceTime = debounceTime;
    }

    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
        const range = chunk as InternalRange;
        logger.debug(`Received range ${range.rangeId} from RangeDataStream`);
        if (this.ranges.has(range.rangeId)) {
            clearTimeout(this.ranges.get(range.rangeId)!.debounce);
        }
        this.ranges.set(range.rangeId, {
            data: range,
            debounce: setTimeout(() => {
                this.push(range);
                this.ranges.delete(range.rangeId);
            }, this.debounceTime)
        });
        callback();
    }
}
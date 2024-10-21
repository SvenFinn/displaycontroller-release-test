import { EventEmitter } from "node:events";

export class TTLHandler<MessageType> extends EventEmitter {
    private message: MessageType | null = null;
    private ttl: number = 0;

    constructor() {
        super();
        setInterval(this.decreaseTTL.bind(this), 1000);
    }

    public setMessage(message: MessageType) {
        this.message = message;
        this.ttl = 30;
        if (typeof (message) === "object" && message !== null) {
            // @ts-ignore
            if (typeof (message.ttl) === "number") {
                // @ts-ignore
                this.ttl = message.ttl;
            }
        }
        this.emit("message", this.message);
    }

    public getMessage(): MessageType | null {
        return this.message;
    }

    private decreaseTTL() {
        if (this.ttl > 0) {
            this.ttl--;
            if (this.ttl === 0) {
                this.message = null;
                this.emit("message", this.message);
            }
        }
    }
}
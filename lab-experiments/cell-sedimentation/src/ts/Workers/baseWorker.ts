import type { WorkerMessage } from "./worker-types";

// Base worker
export abstract class BaseWorker {
    constructor() {
        self.onmessage = (e) => this.handleMessage(e.data);
    }

    protected post<T>(msg: WorkerMessage<T>) {
        (self as any).postMessage(msg);
    }
    protected error(reason: string, fatal?: boolean) {
        const msg = {
            type: "error",
            payload: {
                reason: reason,
                fatal: fatal
            }
        };
        (self as any).postMessage(msg);
    }

    protected abstract handleMessage(msg: WorkerMessage): void;
}

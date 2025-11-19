// Message types
export type WorkerMessage<T=any> = {
    type: string;
    payload?: T;
};

export type InitMessage = { 
    type: "init", 
    payload: { xr0: number, xw0: number } 
};

export type ProduceMessage = { type: "produce" };
export type DataMessage = { type: "data"; payload: any }


export type ConsumerMessage =
    | { type: "consume"; payload: any }
    | { type: "complete" }

// Base worker
export abstract class BaseWorker {
    constructor() {
        self.onmessage = (e) => this.handleMessage(e.data);
    }

    protected post<T>(msg: WorkerMessage<T>) {
        (self as any).postMessage(msg);
    }

    protected abstract handleMessage(msg: WorkerMessage): void;
}

// Message types
export type WorkerMessage<T=any> = {
    type: string;
    payload?: T;
};

export type InitMessage = { 
    type: "init", 
    payload: {
        initConditions: { xr0: number, xw0: number },
    }
};

export type ErrorMessage = {
    type: "message",
    payload: { reason: string, fatal?: boolean }
};

export type ProduceMessage = { type: "produce" };
export type DataMessage = { type: "data"; payload: any }


export type ConsumerMessage =
    | { type: "consume"; payload: any }
    | { type: "complete" }

export type DoubleBufferExport = {
    bufferA: SharedArrayBuffer;
    bufferB: SharedArrayBuffer;
    stateBuffer: ArrayBufferLike;
    length: number;
}

// Make TS Compiler happy
export type TypedArrayConstructor<T> = {
  new (buffer: ArrayBufferLike): T;
  readonly BYTES_PER_ELEMENT: number;
}; 

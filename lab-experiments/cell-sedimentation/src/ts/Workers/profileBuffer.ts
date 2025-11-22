import type { DoubleBufferExport, TypedArrayConstructor } from "./worker-types";

/**
 * Double buffer class for controlled reading from/writing to a thread-safe buffer
 */
export class DoubleBuffer<T extends Float32Array> {
    private readonly bufferA: SharedArrayBuffer;
    private readonly bufferB: SharedArrayBuffer;
    private readonly state: Int32Array;
    private readonly View: TypedArrayConstructor<T>;
    private readonly length: number;

    constructor (length: number, View: TypedArrayConstructor<T>, stateBuffer?: SharedArrayBuffer) {
        this.length = length;
        this.View = View;

        const bytes = length * View.BYTES_PER_ELEMENT;;

        this.bufferA = new SharedArrayBuffer(bytes);
        this.bufferB = new SharedArrayBuffer(bytes);

        // state[0] tells which array is readable;
        // 0 is A, 1 is B
        this.state = stateBuffer ? new Int32Array(stateBuffer) : new Int32Array(new SharedArrayBuffer(4));
    }

    /**
     * Format pertinent double-buffer information as an object to send to a worker
     * @returns object containing buffers, state buffer, and length.
     */
    export = (): DoubleBufferExport => {
        return {
            bufferA: this.bufferA,
            bufferB: this.bufferB,
            stateBuffer: this.state.buffer,
            length: this.length
        };
    }

    /**
     * Get the current readable buffer
     */
    getReadable = (): T => {
        // Get the current readable buffer (atomically)
        const index = Atomics.load(this.state, 0);
        return (index === 0) 
            ? new this.View(this.bufferA) as T
            : new this.View(this.bufferB) as T;
    }

    /**
     * Get the current writable buffer
     */
    getWritable = (): T => {
        const index = Atomics.load(this.state, 0);
        return index === 0
            ? new this.View(this.bufferB) // reader reads A, so producer writes B
            : new this.View(this.bufferA);
    }

    /** 
     * Swap readable/writable buffers. Producer calls this after writing. 
     */
    swap() {
        const next = Atomics.load(this.state, 0) === 0 ? 1 : 0;
        Atomics.store(this.state, 0, next);
        Atomics.notify(this.state, 0);
    }

    /** 
     * Block until new data is available (optional; worker-only safe). 
     */
    waitForSwap() {
        const current = Atomics.load(this.state, 0);
        Atomics.wait(this.state, 0, current);
    }
}

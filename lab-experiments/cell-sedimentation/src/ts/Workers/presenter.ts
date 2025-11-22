import type { Profile, InitConc } from "../../types/globals";
import { CONC_ARRAY_SIZE, conc_r, conc_w, PROFILE_LENGTH } from "../calcs";
import { DoubleBuffer } from "./profileBuffer";
import producerURL from "./producer.ts?url";
import type { InitMessage } from "./worker-types";
import { lerp } from "../helpers";

// Lives on the main thread
export class Presenter {
    private buffer: DoubleBuffer<Profile>;
    private producer: Worker;
    private current: Profile;
    private next: Profile;

    constructor(initConc: InitConc) {
        this.buffer = new DoubleBuffer(PROFILE_LENGTH, Float32Array);
        this.producer = new Worker(producerURL);

        // Initialize producer
        const initMsg: InitMessage = {
            type: "init",
            payload: {
                initConditions: initConc,
                bufferDetails: this.buffer.export()
            }
        };
        this.producer.postMessage(initMsg);

        // Initialize profile
        const cr0 = conc_r(initConc.xr0);
        const cw0 = conc_w(initConc.xw0);
        const init: number[] = new Array(PROFILE_LENGTH);
        init[0] = 0; // time
        init[1] = 0; // top
        for (let i=2;i<CONC_ARRAY_SIZE+2;i++) {
            init[i] = cr0;
        }
        for (let i=2+CONC_ARRAY_SIZE;i<2*CONC_ARRAY_SIZE+2;i++) {
            init[i] = cw0;
        }
        this.current = new Float32Array(init);
        this.next = new Float32Array(init);
    }

    private getNextSol = () => {
        const readable = this.buffer.getReadable();
        if (readable[0] === this.next[0]) {
            return false;
        }
        this.next.set(readable);
        return true;
    }

    public step = (dt: number): Profile => {
        const current = this.current;
        const next = this.next;

        // Figure out the timestep
        let currentTime = current[0];
        let nextTime = next[0];
        let s = (nextTime > currentTime) ? dt / (nextTime - currentTime) : 1;

        // Determine how far to interpolate, and fetch the next if needed
        if (s >= 1) {
            dt -= nextTime - currentTime;
            this.current = this.next;
            const loaded = this.getNextSol();
            if (!loaded) {
                // still loading
                return this.current;
            }
            else {
                // next is ready; swap and reduce that amount of time.
                dt -= (nextTime - currentTime);
                currentTime = current[0];
                nextTime = next[0];
                s = dt / (nextTime - currentTime);
            }
        }

        // Linearly interpolate the current towards the next
        for (let i=0;i<PROFILE_LENGTH;i++) {
            current[i] = lerp(current[i], next[i], s);
        }

        return current;
    }
}
import type { Profile, InitConc } from "../../types/globals";
import { createProfile, PROFILE_LENGTH } from "../calcs";
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
    private nextIsReady = false;

    constructor(initConc: InitConc) {
        this.buffer = new DoubleBuffer(PROFILE_LENGTH, Float32Array);
        console.log("Creating web worker...");
        this.producer = new Worker(producerURL);
        this.producer.onmessage = (e) => console.log(e.data);

        // Initialize producer
        const initMsg: InitMessage = {
            type: "init",
            payload: {
                initConditions: initConc,
                bufferDetails: this.buffer.export()
            }
        };
        this.producer.postMessage(initMsg);

        // Initialize profiles
        this.current = createProfile(initConc);
        this.next = createProfile(initConc);
    }

    private _await_ready_soln = () => {

    }

    /**
     * Fetch the next solution in the 
     * @returns 
     */
    private getNextSol = () => {

        const readable = this.buffer.getReadable();
        if (readable[0] === this.next[0]) {
            return false;
        }
        this.next.set(readable);
        this.producer.postMessage({ type: "produce" });
        return true;
    }

    /**
     * Step the profile towards its next known state using the timestep provided
     * @param dt timestep (s)
     * @returns true if the buffer is ready; false if not
     */
    public step = (dt: number): boolean => {
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
                return false;
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

        return true;
    }

    public getCurrent = () => {
        return this.current;
    }
}
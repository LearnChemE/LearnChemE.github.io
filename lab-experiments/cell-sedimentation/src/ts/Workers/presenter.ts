import type { Profile, InitConc } from "../../types/globals";
import { createProfile, PROFILE_LENGTH, SOLVER_TIMESTEP } from "../calcs";
import producerURL from "./producer.ts?worker&url";
import type { InitMessage, WorkerMessage } from "./worker-types";
import { lerp, makeDeferred, type Deferred } from "../helpers";

// Lives on the main thread
export class Presenter {
    private producer: Worker;
    private current: Profile;
    private next: Profile;
    private promise: Deferred<Profile>;

    constructor(initConc: InitConc) {
        console.log("Creating web worker...");
        this.producer = new Worker(producerURL, {
            type: "module"
        });

        // Initialize producer
        const initMsg: InitMessage = {
            type: "init",
            payload: {
                initConditions: initConc,
            }
        };
        this.producer.postMessage(initMsg);

        // Initialize profiles
        this.current = createProfile(initConc);
        this.next = createProfile(initConc);
        this.promise = this.requestNextSol();
    }

    /**
     * Request the deferred solution to the next timeframe.
     * @returns Profile at next major time step after this.next
     */
    private requestNextSol = (): Deferred<Profile> => {
        const def = makeDeferred<Profile>();
        
        // Handle solution response by resolving the promise
        this.producer.addEventListener("message", (e) => {
            const msg = e.data as WorkerMessage;
            if (msg.type !== "data") throw new Error(`Worker sent message: ${e}`);
            def.resolve(msg.payload);
        }, { once: true });

        // Request the next soln
        this.producer.postMessage({ type: "produce", payload: SOLVER_TIMESTEP });
        return def;
    }

    /**
     * Fetch the next solution from the promise if its ready, or 
     * @returns whether sol is ready
     */
    private getNextSol = (): boolean => {
        if (this.promise.isReady()) {
            this.next = this.promise.value;
            this.promise = this.requestNextSol();
            return true;
        } else {
            // Not ready; fallback to loading state
            // console.log("%c[Presenter] " + `%c Next solution pending...`, "color: green", "color: white")
            return false;
        }
    }

    /**
     * Step the profile towards its next known state using the timestep provided
     * @param dt timestep (s)
     * @returns true if the buffer is ready; false if not
     */
    public step = (dt: number): Profile => {
        // Figure out the timestep
        let currentTime = this.current[0];
        let nextTime = this.next[0];
        // console.log("%c[Presenter] " + `%c Stepping from t=${currentTime} to t=${currentTime + dt} (next at t=${nextTime})`, "color: green", "color: white")
        let s = (nextTime > currentTime) ? dt / (nextTime - currentTime) : 1;

        // Determine how far to interpolate, and fetch the next if needed
        if (s >= 1) {
            // console.log("%c[Presenter]" + `%c dt=${dt}: s=${s} > 1 ; Checking for next solution`, "color:green", "color:white")
            dt -= nextTime - currentTime;
            this.current = this.next;
            const loaded = this.getNextSol();
            if (!loaded) {
                // still loading
                return this.current;
            }
            else {
                // next is ready; swap and reduce that amount of time.
                currentTime = this.current[0];
                nextTime = this.next[0];
                s = dt / (nextTime - currentTime);
            }
        }

        // Linearly interpolate the current towards the next
        for (let i=0;i<PROFILE_LENGTH;i++) {
            this.current[i] = lerp(this.current[i], this.next[i], s);
        }

        return this.current.slice();
    }

    public getCurrent = () => {
        return this.current;
    }

    public terminate = () => {
        this.producer.terminate();
    }
}
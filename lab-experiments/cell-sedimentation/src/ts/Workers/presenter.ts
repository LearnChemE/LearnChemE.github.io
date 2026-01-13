import type { Profile, InitConc } from "../../types/globals";
import { createProfile, PROFILE_LENGTH, SOLVER_TIMESTEP } from "../calcs";
import producerURL from "./producer.ts?worker&url";
import type { InitMessage, WorkerMessage } from "./worker-types";
import { constrain, lerp, makeDeferred, type Deferred } from "../helpers";

class TopRecorder {
    private size: number;
    private window: number[] = [];
    private max = 0;

    constructor (size=5) {
        this.size = size;
    }

    public shift(next: number) {
        this.window.push(next);
        if (this.window.length > this.size) this.window.shift();
    };

    public isFinished() {
        const dif = this.window[this.window.length-1] - this.window[0];
        if (dif > this.max) this.max = dif;

        return (dif < this.max * .2) && (this.max !== 0) && (this.window.length === this.size)
    }
}

export type PresenterStepResult = {
    status: "ready" | "loading" | "finished";
    profile: Profile;
};

// Lives on the main thread
export class Presenter {
    private producer: Worker;
    private current: Profile;
    private next: Profile;
    private promise: Deferred<Profile>;
    private top: TopRecorder;
    private finished: boolean = false;

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

        // Figure out the correct sizing for the top
        const totConc = initConc.xr0 + initConc.xw0;
        let topSize = 3 + 18 * ((totConc * 100) ** 2 / 65 ** 2) // 3 at lowest, 21 at highest\
        topSize = constrain(topSize, 3, 21);
        topSize = Math.floor(topSize);

        // Initialize profiles
        this.current = createProfile(initConc);
        this.next = createProfile(initConc);
        this.promise = this.requestNextSol();
        this.top = new TopRecorder(topSize);
        
        this.top.shift(this.next[1]);
    }

    private finish() {
        console.log("Finished!");
        this.finished = true;
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
            if (msg.type !== "data") {
                console.dir(e)
                throw new Error(`Worker sent message: ${e}`);
            }
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
            // Store the new top in the recorder
            this.top.shift(this.next[1]);
            // Determine if the calculations are finished
            if (this.top.isFinished()) {
                this.finish();
            }

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
    public step = (dt: number): PresenterStepResult => {
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
                return {
                    status: "loading",
                    profile: this.current
                };
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

        return {
            status: this.finished ? "finished" : "ready",
            profile: this.current.slice()
        };
    }

    public getCurrent = () => {
        return this.current;
    }

    public terminate = () => {
        this.producer.terminate();
    }
}
import { describe, it, vi } from "vitest";
import producerURL from "./producer.js?url"
import "@vitest/web-worker"
import type { InitMessage } from "./worker-types";
import { DoubleBuffer } from "./profileBuffer";
import { PROFILE_LENGTH } from "../calcs";
import { Presenter } from "./presenter";
import { plotArrs } from "../../setupTests";

describe("Worker initiation and startup", () => {
    it ("creates a worker and sends a message", () => {
        const buffer = new DoubleBuffer(PROFILE_LENGTH, Float32Array);
        const producer = new Worker(producerURL);

        const initmsg: InitMessage = { 
            type: "init", 
            payload: {
                initConditions: {
                    xr0: 0.05,
                    xw0: 0.05
                },
                bufferDetails: buffer.export()
            }
        };
        producer.postMessage(initmsg);
    });

    it ("does a test run of the presenter class", async () => {
        vi.useFakeTimers();
        const presenter = new Presenter({ xr0: .05, xw0: .05 });
        const profiles = [];
        profiles.push(Array.from(presenter.getCurrent()));

        let t=0;
        setTimeout(() => {
            t += 1000;
            console.log(`[presenter] t=${(t/1000).toFixed(1)}`)
            const nextProf = presenter.step(1000);
            profiles.push(Array.from(nextProf));
        }, 1000);

        const x: number[] = Array.from({ length: PROFILE_LENGTH }, (_,i) => i);
        await plotArrs(x, profiles);
    }, 20e3);
}); 
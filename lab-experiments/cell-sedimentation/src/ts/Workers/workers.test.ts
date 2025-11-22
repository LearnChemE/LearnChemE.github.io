import { describe, it } from "vitest";
import producerURL from "./producer.js?url"
import "@vitest/web-worker"
import type { InitMessage } from "./worker-types";
import { DoubleBuffer } from "./profileBuffer";
import { PROFILE_LENGTH } from "../calcs";

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
}); 
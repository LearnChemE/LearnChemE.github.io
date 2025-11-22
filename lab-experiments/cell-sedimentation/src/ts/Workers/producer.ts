import type { Profile } from "../../types/globals";
import { ProfileSolver } from "../calcs";
import { DoubleBuffer } from "./profileBuffer";
import { BaseWorker, type InitMessage, type WorkerMessage } from "./worker-types";


/**
 * Producer class. On request, iterates its solver and sends the resulting data.
 */
class ProducerWorker extends BaseWorker {
    private solver: ProfileSolver | undefined = undefined;
    private buffer: DoubleBuffer<Profile> | undefined = undefined;

    protected handleMessage(msg: WorkerMessage): void {
        if (msg.type === "init") {
            msg = msg as InitMessage;
            const payload = msg.payload;
            if (!payload) {
                this.error("no initializer payload");
            }
            if (!payload.bufferDetails) {
                this.post({ type: "error", payload: { reason: "no initializer payload" } });
            }
            const { xr0, xw0 } = payload.initConditions ?? { xr0: 0.05, xw0: 0.05 };
            const { len, buf } = payload.bufferDetails;
            this.solver = new ProfileSolver(xr0, xw0);
            this.buffer = new DoubleBuffer<Profile>(len, Float32Array, buf);
            this.produce();
            return;
        }

        if (msg.type === "produce") {
            this.produce();
            return;
        }
    }

    private produce = () => {
        // Return if not init
        if (!this.solver || !this.buffer) {
            this.error("uninitialized solver or buffer");
            return;
        }

        // Always generate data when available
        const sol = this.solver.calculate_step();
        const buf = this.buffer!.getWritable();
        buf.set(sol); // Copy data
        this.buffer.swap();
    }
}

new ProducerWorker();
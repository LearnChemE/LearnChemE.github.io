import { BaseWorker } from "./baseWorker";
import type { DataMessage, InitMessage, WorkerMessage } from "./worker-types";
import createSedimentModule from '../../wasm/sediment.js';
import type { SedimentSolver } from "../../wasm/sediment";

const sedimentModule = await createSedimentModule();
const { SedimentSolver } = sedimentModule;

try {
/**
 * Producer class. On request, iterates its solver and sends the resulting data.
 */
class ProducerWorker extends BaseWorker {
    private solver: SedimentSolver | undefined = undefined;

    protected handleMessage(msg: WorkerMessage): void {
        if (msg.type === "init") {
            console.log("Recieved init message");
            msg = msg as InitMessage;
            const payload = msg.payload;
            if (!payload) {
                this.error("no initializer payload");
            }
            const { xr0, xw0 } = payload.initConditions ?? { xr0: 0.05, xw0: 0.05 };
            this.solver = new SedimentSolver(xr0, xw0);
            return;
        }

        if (msg.type === "produce") {
            console.log("Recieved produce message");
            const time = msg.payload;
            this.produce(time);
            return;
        }
    }

    private produce = (time: number) => {
        if (!this.solver) {
            this.error("uninitialized solver or buffer");
            return;
        }

        // Always generate data when available
        const status = this.solver.solve(time);
        console.log(status)
        if (!status) {
            throw new Error("Solver failed to converge");
        }

        const view = this.solver.getConcentrationView();
        const sol = new Float32Array(view);
        
        const msg: DataMessage = { type: "data", payload: sol };
        this.post(msg);
        // printProducer("Result produced and sent");
    }
}

new ProducerWorker();

}
catch (e) {
    self.postMessage({ type: "fatal", payload: e });
}
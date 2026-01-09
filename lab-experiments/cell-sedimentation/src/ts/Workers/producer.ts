import { BaseWorker } from "./baseWorker";
import type { DataMessage, InitMessage, WorkerMessage } from "./worker-types";
import createSedimentModule from '../../wasm/sediment.js';
import type { SedimentSolver } from "../../wasm/sediment";
import type { InitConc } from "../../types/globals.js";

try {
/**
 * Producer class. On request, iterates its solver and sends the resulting data.
 */
class ProducerWorker extends BaseWorker {
    private solver: SedimentSolver | Promise<SedimentSolver>;
    private ics: InitConc | Promise<InitConc>;
    private resolveIcs!: (value: InitConc | PromiseLike<InitConc>) => void;

    constructor() {
        // It's important to call super before we start loading any modules.
        super();

        // Create a promise to load in the initial conditions (we will resolve this externally when the init message is recieved).
        this.ics = new Promise<InitConc>(resolve => {
            this.resolveIcs = resolve;
        });

        // Create a promise to create the solver when all else is resolved.
        this.solver = new Promise<SedimentSolver>(async resolve => {
            // Load the wasm module
            const module = await createSedimentModule();
            const { SedimentSolver } = module;
            // Await ICs
            const { xr0, xw0 } = await this.ics;
            // Initialize the solver to resolve promise
            resolve(new SedimentSolver(xr0, xw0));
        });
    }

    protected handleMessage(msg: WorkerMessage): void {
        if (msg.type === "init") {
            msg = msg as InitMessage;
            const payload = msg.payload;
            if (!payload) {
                this.error("no initializer payload");
            }
            const ics = (payload.initConditions ?? { xr0: 0.05, xw0: 0.05 });
            this.resolveIcs(ics);
            // Resolve IC promise
            return;
        }

        if (msg.type === "produce") {
            const time = msg.payload;
            this.produce(time);
            return;
        }
    }

    private produce = async (time: number) => {
        const solver = await this.solver;

        // Always generate data when available
        const status = solver.solve(time)
        if (!status) {
            throw new Error("Solver failed to converge");
        }

        const view = solver.getConcentrationView();
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
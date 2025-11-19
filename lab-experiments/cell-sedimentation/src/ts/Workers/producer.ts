import { ProfileSolver } from "../calcs";
import { BaseWorker, type InitMessage, type WorkerMessage } from "./worker-types";


/**
 * Producer class. On request, iterates its solver and sends the resulting data.
 */
class ProducerWorker extends BaseWorker {
    private solver: ProfileSolver | undefined = undefined;
    private running: boolean = false;

    protected handleMessage(msg: WorkerMessage): void {
        if (msg.type === "init") {
            msg = msg as InitMessage;
            const { xr0, xw0 } = msg.payload ?? { xr0: 0.05, xw0: 0.05 };
            this.solver = new ProfileSolver(xr0, xw0);
            return;
        }

        if (msg.type === "produce") {
            this.produce();
            return;
        }
    }

    private produce = () => {
        // Return if already running or if no solver
        if (this.running || !this.solver) return;
        this.running = true;

        // Always generate data when available
        while (this.running) {
            const sol = this.solver.calculate_step();
            this.post({ type: "data", payload: sol });
        }
    }
}

new ProducerWorker();
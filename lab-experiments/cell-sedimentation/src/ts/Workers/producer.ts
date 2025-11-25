import { ProfileSolver } from "../calcs";
import { BaseWorker } from "./baseWorker";
import type { DataMessage, InitMessage, WorkerMessage } from "./worker-types";

const printProducer = (str: string) => console.log("%c[Producer] " + `%c${str}`, "color: red", "color: white");

try {
/**
 * Producer class. On request, iterates its solver and sends the resulting data.
 */
class ProducerWorker extends BaseWorker {
    private solver: ProfileSolver | undefined = undefined;

    protected handleMessage(msg: WorkerMessage): void {
        if (msg.type === "init") {
            msg = msg as InitMessage;
            const payload = msg.payload;
            if (!payload) {
                this.error("no initializer payload");
            }
            const { xr0, xw0 } = payload.initConditions ?? { xr0: 0.05, xw0: 0.05 };
            this.solver = new ProfileSolver(xr0, xw0);
            return;
        }

        if (msg.type === "produce") {
            printProducer("Recieved produce message")
            this.produce();
            return;
        }
    }

    private produce = () => {
        if (!this.solver) {
            this.error("uninitialized solver or buffer");
            return;
        }

        // Always generate data when available
        const sol = this.solver.calculate_step();
        const msg: DataMessage = { type: "data", payload: sol };
        this.post(msg);
    }
}

new ProducerWorker();

}
catch (e) {
    self.postMessage({ type: "fatal", payload: e });
}
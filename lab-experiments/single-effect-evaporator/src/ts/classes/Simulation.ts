import type { ControlType, EvaporatorState } from "../../types";
import { calculateEvaporator } from "../calcs";
import type { DigitalLabel } from "./Label";

export type SimulationDescriptor = {
    flowCtrl: ControlType,
    tempCtrl: ControlType,
    steamFlowLabel: DigitalLabel,
    steamTempLabel: DigitalLabel
}

export class Simulation {
    private state: EvaporatorState; 
    private setSteamTempLabel: (val: number) => void;
    private setSteamFlowLabel: (val: number) => void;
    
    constructor(descriptor: SimulationDescriptor) {
        // Create state object
        this.state = {
            feedFlow: descriptor.flowCtrl,
            feedTemp: descriptor.tempCtrl,
            steamFlow: 0,
            steamTemp: 500,
            steamPres: 0,
            evapFlow: 0,
            concFlow: 0,
            concComp: 0,
            concTemp: 25
        }

        // Save label callbacks
        this.setSteamFlowLabel = (val: number) => descriptor.steamFlowLabel.setLabel(val);
        this.setSteamTempLabel = (val: number) => descriptor.steamTempLabel.setLabel(val);

        this.animate();
    }

    private animate = () => {
        // let prevtime = 0;

        const frame = () => {
            // // Calculate dt
            // const deltaTime = Math.min(time - prevtime, 200);
            // prevtime = time;

            // Calculate
            this.state = calculateEvaporator(this.state);

            // Update labels
            this.setSteamFlowLabel(this.state.steamFlow)
            this.setSteamTempLabel(this.state.steamTemp)

            // Request next frame
            requestAnimationFrame(frame);
        }

        // Start the loop
        requestAnimationFrame(frame);
    }
}


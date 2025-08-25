import type { ControlType, EvaporatorState } from "../../types";
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
            evapFlow: 0,
            concFlow: 0,
            concComp: 0,
            concTemp: 25
        }

        // Save label callbacks
        this.setSteamFlowLabel = descriptor.steamFlowLabel.setLabel;
        this.setSteamTempLabel = descriptor.steamTempLabel.setLabel;

        this.animate();
    }

    private calculate = (deltaTime: number) => {
        console.log(deltaTime);
    }

    private animate = () => {
        let prevtime = 0;

        const frame = (time: number) => {
            // Calculate dt
            const deltaTime = Math.min(time - prevtime, 200);
            prevtime = time;
            // Calculate
            this.calculate(deltaTime);
            // Request next frame
            requestAnimationFrame(frame);
        }

        // Start the loop
        requestAnimationFrame(frame);
    }
}


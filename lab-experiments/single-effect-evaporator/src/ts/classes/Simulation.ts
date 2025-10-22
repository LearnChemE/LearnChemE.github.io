import type { EvaporatorState, SimulationDescriptor } from "../../types";
import { calculateEvaporator } from "../calcs";
import type { Outlet } from "./Outlet";

export class Simulation {
    private state: EvaporatorState; 
    private setTankTempLabel: (val: number) => void;
    private setSteamTempLabel: (val: number) => void;
    private setSteamFlowLabel: (val: number) => void;
    private setEvapFlowLabel: (val: number) => void;
    private setPressureLabel: (val: number) => void;
    private condensate: Outlet;
    private concentrate: Outlet;
    
    constructor(descriptor: SimulationDescriptor) {
        // Create state object
        this.state = {
            feedFlow: descriptor.flowCtrl,
            feedTemp: descriptor.tempCtrl,
            steamPres: descriptor.presCtrl,
            steamFlow: 0,
            steamTemp: 500,
            evapFlow: 0,
            concFlow: 0,
            concComp: 0,
            concTemp: 209.9
        }

        this.condensate = descriptor.condensate;
        this.concentrate = descriptor.concentrate;

        // Save label callbacks
        this.setSteamFlowLabel = (val: number) => descriptor.steamFlowLabel.setLabel(val);
        this.setTankTempLabel  = (val: number) => descriptor.concTempLabel.setLabel(val);
        this.setEvapFlowLabel  = (val: number) => descriptor.evapLabel.setLabel(val);
        this.setPressureLabel  = (val: number) => descriptor.pressureLabel.setLabel(val);
        this.setSteamTempLabel = (val: number) => descriptor.steamTempLabel.setLabel(val);

        this.animate();
    }

    private animate = () => {
        let prevtime = 0;

        const frame = (time: number) => {
            // Calculate dt
            const deltaTime = Math.min(time - prevtime, 200);
            prevtime = time;

            // Calculate
            this.state = calculateEvaporator(this.state, deltaTime);

            // Update labels
            this.setSteamFlowLabel(this.state.steamFlow);
            this.setSteamTempLabel(this.state.steamTemp);
            this.setTankTempLabel(this.state.concTemp);
            this.setEvapFlowLabel(this.state.evapFlow);
            this.setPressureLabel(1);
            
            // Update outlets
            this.condensate.setStreamConditions(this.state.steamFlow, 0);
            this.concentrate.setStreamConditions(this.state.concFlow, this.state.concComp);

            // Request next frame
            requestAnimationFrame(frame);
        }

        // Start the loop
        requestAnimationFrame(frame);
    }
}


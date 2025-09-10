import { PUMP_FLOWRATE_GAIN, vec2 } from "./globals";
import State from "../js/state";
import { constrain } from "../js/helpers";

class Beaker {
    private element: HTMLElement;
    private coord: vec2;
    private dim: vec2;
    // For lerping
    private volume: number;

    constructor(id: string, initialVolume: number) {
        // Get the element
        let e: HTMLElement = document.getElementById(id);
        // Get coordinates
        let x: number = Number(e.getAttribute("x"));
        let y: number = Number(e.getAttribute("y"));
        // Get dimensions
        let w: number = Number(e.getAttribute("width"));
        let h: number = Number(e.getAttribute("height"));

        // Set privates
        this.element = e;
        this.coord = vec2(x, y);
        this.dim = vec2(w, h);

        // Set initial fill
        this.setVolume(initialVolume);
    }

    /**
     * Update rendering
     * @param vol New volume of tank
     */
    public setVolume = (vol: number) => {
        let coord = this.coord;
        let dim = this.dim;
        let e = this.element;

        this.volume = vol
        vol = constrain(vol / 1000, 0, 1);

        // Change the attributes
        e.setAttribute("y", `${coord.y + dim.y * (1 - vol)}`);
        e.setAttribute("height", `${dim.y * vol}`);
    }

    /**
     * Change the volume by a specific amount, accounting for bounds
     * @param volToAdd amount of volume to add to beaker
     */
    public addVolume = (volToAdd: number) => {
        let newVol = this.volume + volToAdd;
        // TODO: set bounds on new volume

        // Set the new volume
        this.setVolume(newVol);
    }

    /**
     * Get the current beaker volume
     * @returns beaker volume
     */
    public getVolume = () => {
        return this.volume;
    }
}

// Some state enums
const NOT_STARTED = 0;
const FILLING_ANI = 1;
const RECYCLE     = 2;
const CATCH_WEIGH = 3;

export class BeakerHolder {
    private beakerL: Beaker;
    private beakerR: Beaker;
    private state: number = NOT_STARTED;
    private callback: () => any | null;

    constructor(catchAndWeighCallback?: () => any) {
        this.beakerL = new Beaker("Beaker Fill", 1000);
        this.beakerR = new Beaker("Beaker Fill_2", 0);
        this.callback = catchAndWeighCallback;
    }

    private fillAnimation = async () => {
        if (this.state !== FILLING_ANI) return;

        let prevTime: number | null = null;

        const frame = (time: number) => {
            if (prevTime === null) prevTime = time;

            // Calculate deltaTime
            const deltaTime = time - prevTime;
            prevTime = time;

            // Set flowrate
            let flowrate = State.valveLift * PUMP_FLOWRATE_GAIN * deltaTime / 1000;
            this.beakerL.addVolume(-flowrate);
            this.callback?.();
            // console.log(this.beakerL.getVolume())

            // Only request another frame if you are still in catch and weigh
            if (this.beakerL.getVolume() <= 80) {
                // Stop the pumps if the water level is lower than the pump
                const pumpBtn = document.getElementById("pump-btn");
                State.pumpIsRunning = false;
                pumpBtn.className = "btn btn-secondary";
                pumpBtn.innerHTML = "start pump";
                State.valveLift = 0;
            }
            if (this.state === FILLING_ANI) {
                requestAnimationFrame(frame);
            }
        };
        
        requestAnimationFrame(frame);
    }

    private catchAndWeigh = async () => {
        if (this.state !== CATCH_WEIGH) return;

        let prevTime: number | null = null;

        const frame = (time: number) => {
            if (prevTime === null) prevTime = time;

            // Calculate deltaTime
            const deltaTime = time - prevTime;
            prevTime = time;

            // Only request another frame if you are still in catch and weigh
            if (this.beakerL.getVolume() <= 80) {
                // Stop the pumps if the water level is lower than the pump
                const pumpBtn = document.getElementById("pump-btn");
                State.pumpIsRunning = false;
                pumpBtn.className = "btn btn-secondary disabled";
                pumpBtn.innerHTML = "start pump";
                State.valveLift = 0;
                const removeDisable = () => pumpBtn.classList.remove("disabled");
                document.getElementById("reset-btn").addEventListener("click", removeDisable);
            }

            // Set flowrate
            let flowrate = State.pumpIsRunning ? State.valveLift * PUMP_FLOWRATE_GAIN * deltaTime / 1000 : 0;
            this.beakerL.addVolume(-flowrate);
            this.beakerR.addVolume( flowrate);
            this.callback?.();

            // console.log(this.beakerL.getVolume())


            // Only request another frame if you are still in catch and weigh
            if (this.state === CATCH_WEIGH) {
                requestAnimationFrame(frame);
            }
        };

        requestAnimationFrame(frame);
    }

    public setCatchWeighCallback = (callback: () => any | null) => {
        this.callback = callback;
    }

    /**
     * Set the current state of the beakers
     * @param mode new mode
     */
    public setMode = (mode: number) => {
        // Set the state
        this.state = mode;

        switch (mode) {
            // Reset
            case NOT_STARTED:
                this.beakerL.setVolume(1000);
                this.beakerR.setVolume(0);
                break;

            // Start animation
            case FILLING_ANI:
                this.fillAnimation();
                break;

            // Recycle (do nothing)
            case RECYCLE:
                break;

            // Catch and weigh mode
            case CATCH_WEIGH:
                this.catchAndWeigh();
                break;

            // Shouldn't ever reach here
            default:
                console.warn(`Unknown state enumerant passed to beakers: ${mode}`);
                break;
        }
    };

    /**
     * Get the current beaker mode
     * @returns value of beaker.state
     */
    public getMode = () => {
        return this.state;
    }
}
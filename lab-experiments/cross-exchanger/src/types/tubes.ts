const TOTAL_TUBE_AMOUNT = 32; // mL TODO: make this accurate with the fill animation
const TOTAL_VOLUME = 1000;
const ROOM_TEMP = 25; // C
const INIT_TANK_TEMP = 60; // C

const UA_TANK = 1e-1; // W / K
const UA_TUBE = 1e-0; // W / K
const CP = 4.184; // J / g / K
const RHO = 0.998 // g / mL

export class Balance {
    private tankFill: number = TOTAL_VOLUME; // mL
    private tankTemp: number = INIT_TANK_TEMP; // C
    private tubeFill: number = 0; // mL
    private tubeTemp: number = 25; // C

    private d_tubeVol: number = 0;

    public getTankTemp() { return this.tankTemp }
    public getTubeTemp() { return this.tubeTemp }

    public getTubeFill() { return this.tubeFill }
    public setTubeFill(amt: number) {
        // Scale from [0,1] to [0, TOTAL_TUBE_AMOUNT]
        amt = amt * TOTAL_TUBE_AMOUNT;

        // Check if amount in the tubes changed
        if (amt > this.tubeFill) {
            // Water flowed from tank to tube
            this.d_tubeVol += amt - this.tubeFill;
        }
        else if (amt < this.tubeFill) {
            // Water flowed from tube to tank
            this.d_tubeVol -= amt - this.tubeFill;
        }

        // Set volumes for the balance
        this.tankFill = TOTAL_VOLUME - amt;
        this.tubeFill = amt;
    }

    public integrate(flowrate: number, deltaTime: number, fanIsOn: boolean) {
        const dt = deltaTime / 1000;
        const tankTemp = this.tankTemp;
        const tubeTemp = this.tubeTemp;
        const tube_UA = fanIsOn ? UA_TUBE * 10 : UA_TUBE;

        // Calculate heat rates
        // flowrate += this.d_tubeVol / deltaTime;
        // this.d_tubeVol = 0;
        const dQdt_tank = UA_TANK * (ROOM_TEMP - tankTemp) + flowrate * CP * (tubeTemp - tankTemp);
        const dQdt_tube = tube_UA * (ROOM_TEMP - tubeTemp) + flowrate * CP * (tankTemp - tubeTemp);

        // Translate to rhs
        const dT_tank = this.tankFill !== 0 ? dQdt_tank / RHO / this.tankFill / CP * dt : 0; // K / s
        const dT_tube = this.tubeFill !== 0 ? dQdt_tube / RHO / this.tubeFill / CP * dt : 0; // K / s

        // Evolve
        this.tankTemp += dT_tank;
        this.tubeTemp += dT_tube;
        // console.log(`Tank: ${this.tankTemp.toFixed(8)}\nTube: ${this.tubeTemp.toFixed(8)}`);
    }
}
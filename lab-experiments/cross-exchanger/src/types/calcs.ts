const TOTAL_TUBE_AMOUNT = 32; // mL TODO: make this accurate with the fill animation
const TOTAL_VOLUME = 1000;
const ROOM_TEMP = 25; // C
const INIT_TANK_TEMP = 60; // C

const UA_TANK = 1e-1; // W / K
const UA_TUBE = 2e-1; // W / K
const UA_HEX = 25; // W / K
const CP = 4.184; // J / g / K
const RHO = 0.998 // g / mL

const CP_AIR = 1.006; // J / g / K
const MDOT_AIR = 20; // g / s

function calcQ(t1: number, T1: number, Ca: number, Cl: number) {
    const [Cmin , Cmax] = [Ca, Cl].sort();
    const C = Cmin / Cmax;
    const NTU = UA_HEX / Cmin;

    // Calculate effectiveness
    let ep: number;
    // Correlation depends on which fluid is mixed
    if (Cmin === Ca) {
        // Cmin is the mixed fluid
        ep = 1 - Math.exp(-(1 - Math.exp(-NTU * C)) / C);
    }
    else {
        // Cmin is the unmixed fluid
        ep = 1 / C * (1 - Math.exp(-C * (1 - Math.exp(-NTU))));
    }

    // Calculate the max heat transfer rate
    const Qmax = Cmin * (T1 - t1);
    // Use to find the actual heat transfer rate
    const Q = ep * Qmax;
    return Q;
}

export class Balance {
    private tankFill: number = TOTAL_VOLUME; // mL
    private tankTemp: number = INIT_TANK_TEMP; // C
    private tubeFill: number = 0; // mL
    private tubeTemp: number = 25; // C
    private airTemp : number = 25; // C

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

    public integrate(flowrate: number, deltaTime: number, fanIsOn: boolean, liqInHex: boolean) {
        const dt = deltaTime / 1000;
        const tankTemp = this.tankTemp;
        const tubeTemp = this.tubeTemp;

        // Calculate HEX Values
        const C_liq = flowrate * CP;
        const C_air = fanIsOn ? MDOT_AIR * CP_AIR : 0.2 * CP_AIR;

        // Calculate heat exchange from HEX
        const Qhex = (flowrate > 0 && liqInHex) ? calcQ(25, this.tubeTemp, C_air, C_liq) : 0;
        console.log(`Qhex:`, Qhex);

        // // Calculate heat rates
        const dQdt_tank = UA_TANK * (ROOM_TEMP - tankTemp) + flowrate * CP * (tubeTemp - tankTemp);
        const dQdt_tube = UA_TUBE * (ROOM_TEMP - tubeTemp) + flowrate * CP * (tankTemp - tubeTemp) - Qhex;

        // Use the hex energy balance to calculate the theoretical air temp
        const airTempTheoretical = 25 + Qhex / C_air;
        // // Use a moving average filter over the last 2 seconds to make the actual less awful
        // const avgHi = this.airTemp + (airTempTheoretical - this.airTemp) * deltaTime / 5000;
        this.airTemp = airTempTheoretical;//Math.min(airTempTheoretical, avgHi);

        // Translate to rhs
        const dT_tank = this.tankFill !== 0 ? dQdt_tank / RHO / this.tankFill / CP * dt : 0; // K / s
        const dT_tube = this.tubeFill !== 0 ? dQdt_tube / RHO / this.tubeFill / CP * dt : 0; // K / s

        // Evolve
        this.tankTemp += dT_tank;
        this.tubeTemp += dT_tube;

    }

    public getAirTemp = () => {
        return this.airTemp;
    }

    public reset = () => {
        this.tankFill = TOTAL_VOLUME;
        this.tubeFill = 0;
        this.tankTemp = INIT_TANK_TEMP;
        this.tubeTemp = ROOM_TEMP;
    }
}
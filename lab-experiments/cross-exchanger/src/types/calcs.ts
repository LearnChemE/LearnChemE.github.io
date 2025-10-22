const TOTAL_TUBE_AMOUNT = 32; // mL TODO: make this accurate with the fill animation
const TOTAL_VOLUME = 1000;
const ROOM_TEMP = 25; // C
const INIT_TANK_TEMP = 60; // C

const UA_TANK = 1e-1; // W / K
const UA_TUBE = 2e-0; // W / K
const UA_HEX = 25; // W / K
export const CP = 4.184; // J / g / K
const RHO = 0.998 // g / mL

const INNER_RES = 4.8372e-4; // m**2 K / W

export const CP_AIR = 1.006; // J / g / K
export const MDOT_AIR = 20; // g / s

/**
 * Calculate the inner tube h value based on flowrate
 * @param flowrate water flowrate in hex (g / s)
 * @returns h_i (W / m2 / K)
 */
export function calcInnerHVal(flowrate: number) {
    const Pr = 5.05; // Prandtl number
    const asp = 3.105e-3 / .11054; // Tube aspect ratio
    const u = flowrate / RHO * 23; // Fluid velocity, m / s
    const Re = u * 4085.5; // Reynolds number

    // Calculate Nusselt number
    const Nu = 0.36 * (Re ** .8) * (Pr ** (1/3)) * (asp ** .055)
    return Nu * 189.592; // W / m2 / K
}

export function calcUA(flowrate: number) {
    const hi_inv = 1 / calcInnerHVal(flowrate);
    const Ui = 1 / (4.8372e-4 + hi_inv); // U based on inner area (m2 K / W)
    return 
}

export function calcQ(t1: number, T1: number, Ca: number, Cl: number) {
    const UA = UA_HEX * Math.sqrt(Cl / (37.5 * CP));
    const [Cmin , Cmax] = [Ca, Cl].sort((a,b) => a - b);
    const C = Cmin / Cmax;
    const NTU = UA / Cmin;

    // Calculate effectiveness
    // Correlation for both fluids unmixed
    const ep = 1 - Math.exp((Math.exp(-C * NTU ** 0.78) - 1) / C / NTU ** -0.22);

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
        const C_liq = flowrate * CP; // W / K
        const C_air = fanIsOn ? MDOT_AIR * CP_AIR : 0.2 * CP_AIR;

        // Calculate heat exchange from HEX
        const Qhex = (flowrate > 0 && liqInHex) ? calcQ(25, this.tankTemp, C_air, C_liq) : 0;

        // Calculate heat rates
        const dQdt_tank = UA_TANK * (ROOM_TEMP - tankTemp) + C_liq * (tubeTemp - tankTemp);
        const dQdt_tube = UA_TUBE * (ROOM_TEMP - tubeTemp) + C_liq * (tankTemp - tubeTemp) - Qhex;

        // Use the hex energy balance to calculate the theoretical air temp
        this.airTemp += (25 - this.airTemp + Qhex / C_air) * dt; 

        // Translate to rhs
        const dT_tank = this.tankFill !== 0 ? dQdt_tank / RHO / this.tankFill / CP * dt : 0; // K / s
        let dT_tube;
        if (this.tubeFill <= 0) {
            dT_tube = 0;
        }
        else if (flowrate === 0) {
            dT_tube = dQdt_tube / RHO / this.tubeFill / CP * dt;
        }
        else {
            const c = Math.max(C_liq, RHO * this.tubeFill * CP)
            dT_tube = dQdt_tube / c * dt; // K / s
        }

        // Evolve
        this.tankTemp += dT_tank;
        this.tubeTemp += dT_tube;
        // this.tubeTemp = Qhex > 0 ? -Qhex / C_liq + tankTemp : tankTemp;

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
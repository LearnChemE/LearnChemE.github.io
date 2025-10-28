const TOTAL_TUBE_AMOUNT = 32; // mL TODO: make this accurate with the fill animation
const TOTAL_VOLUME = 1000;
const ROOM_TEMP = 25; // C
const INIT_TANK_TEMP = 60; // C

const UA_TANK = 1e-1; // W / K
const UA_TUBE = 2e-0; // W / K
export const CP = 4.184; // J / g / K
const RHO = 0.998 // g / mL

const OUTER_RES = 3.766821E-04; // m**2 K / W
const DH_TUBES = 3.29e-3; // m

export const CP_AIR = 1.006; // J / g / K
export const MDOT_AIR = 20; // g / s

/**
 * Calculate Reynolds number of tube flow from flowrate (mL/s)
 * @param flowrate mL / s
 * @returns Reynold's number for water in tube
 */
function Re(flowrate: number) {
    const A =2.27419e-1; // cm2
    const RH = 994.702; // kg / m3
    const MU = 7.56E-4; // kg / m / s
    // Convert cc/s to reynolds number
    const vel = flowrate / .994702 / A / 100 / 6; // m / sW
    return RH * vel * DH_TUBES / MU;
}

/**
 * Calculate Nu from Re
 * @param Re Reynold's number
 * @returns Nusselt number from tube flow regime
 */
function Nu(Re: number) {
    const asp = .029727; // inverse asp, D / L
    return 0.036 * Re**0.8 * 5.05**(1/3) * asp**.055;
}

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
    const k = .623; // W / m / K
    const Ai = 0.018362596; // m2

    // Get reynold and nusselt numbers
    const re = Re(flowrate);
    const nu = Nu(re);
    // Get h from nusselt
    const hi = nu * k / DH_TUBES; // W / m2 / K
    
    // Add in series to get U (based on inner diameter)
    const Ui = 1 / (OUTER_RES + 1 / hi); // W / m2 / K
    return Ui * Ai; // W / K
}

export function calcQ(t1: number, T1: number, Ca: number, Cl: number) {
    const q = Cl / CP; // mL / s
    const UA = calcUA(q);
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
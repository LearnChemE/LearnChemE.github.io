import type { EvaporatorState } from "../types";

const UA = 1e2; // W / K
const STEAM_TEMP = 273.15 + 212; // deg C
const EVAPORATOR_PRESSURE = 1; // bar
const X_IN = 0.1;

const MASS_IN_EVAPORATOR = 10; // kg
const EVAPORATOR_HEAT_CAPACITTY = 10000; // J
const DIFFUSE = 1e-5;

/**
 * Calculate saturated pressure from temperature
 */
function antoines(T: number) {
    if(T < 379) {
        const A = 4.6543;
        const B = 1435.264;
        const C = -64.848;
        return 10 ** (A - B / (T + C));
    } else {
        const A = 3.55959;
        const B = 643.748;
        const C = -198.043;
        return 10 ** (A - B / (T + C));
    }
}

/**
 * Calculate sugar water solution's heat capacity based on temperature (K) and mole fraction
 * @param T temperature (K)
 * @param x mole fraction sugar
 */
function Cp(T: number, x: number) {
    // Equation for heat capacity of sugar solution
    // Source: https://onlinelibrary.wiley.com/doi/pdf/10.1002/9781444320527.app1
    const Tc = T - 273.15;
    let cp = 1 - ( 0.6 - 0.0018 * Tc ) * x; // heat capacity (kcal/kg)
    cp *= 4.1868; // heat capacity (kJ/kg)
    cp *= 1000; // heat capacity (J/kg)
    return cp;
}

/**
 * Calculate enthalpy of vaporization for water at a given temperature
 * @param T temperature (K)
 * @returns deltaHvap (J/kg)
 */
function dHvap(T: number) {
    // Equation for heat of vaporization of saturated water
    // Source: https://mychemengmusings.wordpress.com/2019/01/08/handy-equations-to-calculate-heat-of-evaporation-and-condensation-of-water-steam/
    const Tc = T - 273; // temperature in celsius
    let H_vap = 193.1 - 10950 * Math.log( ( 374 - Tc ) / 647) * ( 374 - Tc )**0.785 / ( 273 + Tc ); // heat of vaporization (kJ/kg)
    H_vap *= 1000; // heat of vaporization converted to J/kg
    return H_vap;  
}

/**
 * Calculate the roots of a polynomial equation.
 * @param poly 
 * @returns 
 */
function quadraticRoots(poly: number[]) {
    const [a, b, c] = poly;
    const denom = 2 * a;
    const disc = b ** 2 - 4 * a * c;

    const left = -b / denom;
    const right = Math.sqrt(disc) / denom;

    return [ left - right, left + right ];
}

/**
 * Determine the concentrate flow
 * @param T temperature of tank
 * @param mdot_feed feed flowrate
 * @returns mdot_conc (kg / min)
 */
function concentrate_flow(T: number, mdot_feed: number) {
    const pvap = antoines(T);
    // console.log(`Pressure: ${pvap}`)
    if (pvap <= EVAPORATOR_PRESSURE)  {
        // Not boiling
        return mdot_feed;
    }
    else {
        const poly = [ 1 , DIFFUSE * (pvap - EVAPORATOR_PRESSURE) - mdot_feed , -X_IN * mdot_feed * DIFFUSE * pvap ];
        const [lo, hi] = quadraticRoots(poly);
        const min = X_IN * mdot_feed;

        // Return the one that falls in the correct range
        if (lo >= min && lo <= mdot_feed) return lo
        else if (hi >= 0 && hi <= mdot_feed) return hi
        else return X_IN * mdot_feed // Everything goes to the concentrate
    }
}

export function calculateEvaporator(state: EvaporatorState, deltaTime: number) {
    const dt = deltaTime / 1000;
    // Read the current state
    const mdot_feed = state.feedFlow.value;
    const temp_feed = state.feedTemp.value + 273.15;
    var temp_conc = state.concTemp + 273.15;
    const temp_stm  = STEAM_TEMP;
    
    // Heat transferred from steam trap to vessel
    const heat_rate = (mdot_feed !== 0) ? UA * (temp_stm - temp_conc) : 0;
    // Flow rates out from vessel
    const mdot_conc = concentrate_flow(temp_conc, mdot_feed);
    const mdot_evap = mdot_feed - mdot_conc;
    const x_c = (mdot_conc !== 0) ? X_IN * mdot_feed / mdot_conc : X_IN;
    // console.log(`evaporate flow: ${mdot_evap}\nconcentrate flow: ${mdot_conc}\nmole frac: ${x_c}`);
    // Energy in minus energy out
    const in_minus_out = mdot_feed * (Cp(temp_feed, X_IN) * temp_feed - Cp(temp_conc, x_c) * temp_conc);
    // Energy lost to evaporation
    const cons = dHvap(temp_conc) * mdot_evap;
    // const cons = 0;
    if (mdot_evap > 0) console.warn(`Rate of consumption: ${cons/1000} kW`)

    // Use energy bal to evolve (no generation)
    const acc = in_minus_out + heat_rate - cons;
    if (mdot_evap > 0) console.warn(acc)


    // Evolve the temperature
    const dTdt = acc / (MASS_IN_EVAPORATOR * Cp(temp_conc, x_c) + EVAPORATOR_HEAT_CAPACITTY);
    temp_conc += dTdt * dt;

    // Calculate current state
    const mdot_stm = (mdot_feed !== 0) ? heat_rate / dHvap(temp_stm) : 0;

    // Set state
    state.evapFlow = mdot_evap;
    state.steamFlow = mdot_stm;
    state.concFlow = mdot_conc;
    state.concComp = x_c;
    state.concTemp = temp_conc - 273.15;
    state.steamPres = antoines(STEAM_TEMP);
    state.steamTemp = STEAM_TEMP - 273.15;

    // console.log(temp_conc)

    return state;
}

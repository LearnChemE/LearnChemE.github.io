import type { EvaporatorState } from "../types";

const UA = 2000; // W / K
const EVAPORATOR_PRESSURE = 1; // bar
const X_IN = 0.1;

const MASS_IN_EVAPORATOR = 10; // kg
const EVAPORATOR_HEAT_CAPACITTY = 5000; // J

// /**
//  * Calculate saturated pressure from temperature
//  */
// function antoines(T: number) {
//     if(T < 399.94) {
//         const A = 4.6543;
//         const B = 1435.264;
//         const C = -64.848;
//         return 10 ** (A - B / (T + C));
//     } else {
//         const A = 3.55959;
//         const B = 643.748;
//         const C = -198.043;
//         return 10 ** (A - B / (T + C));
//     }
// }

/**
 * Calculate saturated temperature from pressure
 */
function inv_antoines(P: number) {
    const logP = Math.log10(P);
    const [A, B, C] = (P > 2.35) ? 
        [ 3.55959,  643.748, -198.043 ] : 
        [  4.6543, 1435.264,  -64.848 ];
        
    return B / (A - logP) - C;
}
const TVap1bar = inv_antoines(EVAPORATOR_PRESSURE);

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
 * Handle the per-frame integration of the evaporator mass + energy balances
 * @param state simulation state object
 * @param deltaTime time since last frame
 * @returns state object with updated data
 */
export function calculateEvaporator(state: EvaporatorState, deltaTime: number) {
    const dt = deltaTime / 1000;
    // Read the current state
    const mdot_feed = state.feedFlow.value;
    const temp_feed = state.feedTemp.value + 273.15;
    var temp_conc = state.concTemp + 273.15;
    const pres_stm  = state.steamPres.value;
    const temp_stm = inv_antoines(pres_stm);
    
    // Heat transferred from steam trap to vessel
    const heat_rate = UA * (temp_stm - temp_conc);
    // Energy in minus energy out
    const in_minus_out = mdot_feed * (Cp(temp_feed, X_IN) * temp_feed - Cp(temp_feed, X_IN) * temp_conc);

    // Use energy bal to evolve without consumption first
    const acc_noCons = in_minus_out + heat_rate;
    // Flow rates out from vessel
    const x_c = (state.concFlow !== 0) ? X_IN * mdot_feed / state.concFlow : X_IN;
    const a = (MASS_IN_EVAPORATOR * Cp(temp_conc, x_c) + EVAPORATOR_HEAT_CAPACITTY)
    const dTdt_noCons = acc_noCons / a;
    const newT_noCons = temp_conc + dTdt_noCons * dt;

    console.log(newT_noCons, TVap1bar)
    let mdot_conc, mdot_evap;
    if (newT_noCons > TVap1bar) {
        const deltaT_cons = newT_noCons - TVap1bar;
        const max_cons = deltaT_cons * a; // Maximum power available for evaporation

        // Calculate the actual rates based on the surplus energy
        mdot_evap = Math.min(60 * max_cons / dHvap(temp_conc), mdot_feed * (1 - x_c) * .99);
        mdot_conc = mdot_feed - mdot_evap;

        // Calculate how much power is actually going to evaporation
        const cons = mdot_evap * dHvap(temp_conc) / 60;
        // Evolve
        const dTdt = (in_minus_out + heat_rate - cons) / a;
        temp_conc = temp_conc + dTdt * dt;
    } else {
        // Approximately no evaporation; keep previous results
        mdot_conc = mdot_feed;
        mdot_evap = 0;
        temp_conc = newT_noCons;
    }


    // Calculate steam rate
    const mdot_stm = heat_rate / dHvap(temp_stm) * 60;

    // debug
    // console.log(`in - out = ${in_minus_out}\ngen = ${heat_rate}\ncons = ${cons}`)
    // if (mdot_evap > 0) console.warn(`Rate of consumption: ${cons/1000} kW`)
    console.log(`Evap: ${mdot_evap}\nConc: ${mdot_conc}\nxc: ${x_c}`)
    // if (mdot_evap > 0) console.warn(`dTdt: ${dTdt}`)

    // Set state
    state.evapFlow = mdot_evap;
    state.steamFlow = mdot_stm;
    state.concFlow = mdot_conc;
    state.concComp = x_c;
    state.concTemp = temp_conc - 273.15;
    state.steamTemp = temp_stm - 273.15;
    // console.log(state.steamTemp)

    // console.log(temp_conc)

    return state;
}

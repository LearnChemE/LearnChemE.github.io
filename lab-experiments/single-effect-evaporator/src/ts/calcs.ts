import type { EvaporatorState } from "../types";

declare const __DEV__: boolean;
if (__DEV__) {
var sendTestData = (await import("../debug")).default;
}

const MW_SUCROSE = 342.2965; // g / mol
const MW_WATER = 18; // g / mol

const UA = 1.4e3; // W / K
const EVAPORATOR_PRESSURE = 1; // bar
const X_IN = 0.05;
const Y_IN = X_IN / MW_SUCROSE / (X_IN / MW_SUCROSE + (1 - X_IN) / MW_WATER);

const MASS_IN_EVAPORATOR = 0.25; // kg

/**
 * Convert mass fraction sucrose to mole fraction sucrose
 * @param massFrac 
 * @returns mole frac
 */
function moleFrac(massFrac: number) {
    const moles = massFrac / MW_SUCROSE;
    return moles / (moles + (1 - massFrac) / MW_WATER);
}

// /**
//  * Convert mole fraction sucrose to mass fraction sucrose
//  * @param moleFrac 
//  * @returns mass frac
//  */
// function massFrac(moleFrac: number) {
//     const mass = moleFrac * MW_SUCROSE;
//     return mass / (mass + (1 - moleFrac * MW_WATER));
// }

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

/**
 * Calculate sugar water solution's heat capacity (J/kg) based on temperature (K) and mole fraction
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

// console.log(TVap3bar - 273)
let debugt = 0;
/**
 * Handle the per-frame integration of the evaporator mass + energy balances
 * @param state simulation state object
 * @param deltaTime time since last frame
 * @returns state object with updated data
 */
export function calculateEvaporator(state: EvaporatorState, deltaTime: number) {
    const dt = deltaTime / 1000;
    // Read the current state
    const mdot_feed = state.feedFlow.value / 60; // kg / s
    const temp_feed = state.feedTemp.value + 273.15; // K
    var temp_conc = state.concTemp + 273.15; // K
    const pres_stm  = state.steamPres.value; // bar
    const temp_stm = inv_antoines(pres_stm); // K
    
    // Heat transferred from steam trap to vessel
    const heat_rate = UA * (temp_stm - temp_conc); // W
    // Composition
    const x_c = state.concComp; // Use existing composition
    const m_c = x_c * MASS_IN_EVAPORATOR; // kg sucrose in evaporator
    const y_c = moleFrac(x_c); // mole frac
    // Energy in minus energy out
    const in_minus_out = mdot_feed * (Cp(temp_feed, Y_IN) * temp_feed - Cp(temp_conc, y_c) * temp_conc); // W

    // Use energy bal to evolve without consumption first
    const acc_noCons = in_minus_out + heat_rate; // W
    // Flow rates out from vessel
    // const x_c = (state.concFlow !== 0) ? X_IN * mdot_feed / state.concFlow : X_IN; // mass frac
    
    const a = (MASS_IN_EVAPORATOR * Cp(temp_conc, y_c) + 10); // 1 / Capacity [J / K]
    const dTdt_noCons = acc_noCons / a;
    const newT_noCons = temp_conc + dTdt_noCons * dt;

    let mdot_conc, mdot_evap;
    console.log(`mol frac: ${y_c.toFixed(2)}\nmass frac: ${x_c.toFixed(2)}`);
    const Tboil = inv_antoines(EVAPORATOR_PRESSURE / (1 - y_c));
    if (newT_noCons >= Tboil - .05) {
        const deltaT_cons = Math.max(newT_noCons - Tboil, temp_conc - Tboil);
        // You essentially create a P-only controller here, so you need to force the value down
        const max_cons = Math.max(deltaT_cons * a + in_minus_out + heat_rate, deltaT_cons * a); // Maximum power available for evaporation (W)

        // Calculate the actual rates based on the surplus energy
        const dH = Math.max(dHvap(temp_conc), dHvap(temp_feed))
        mdot_evap = Math.min(max_cons / dH, mdot_feed * (1 - x_c)); // kg / s
        mdot_conc = mdot_feed - mdot_evap; // kg / s

        // Calculate how much power is actually going to evaporation
        const cons = mdot_evap * dH;
        // console.log(cons, max_cons)
        // Evolve
        const dTdt = (in_minus_out + heat_rate - cons) / a;
        // console.log(temp_conc + dTdt * dt, newT_noCons)
        temp_conc = temp_conc + dTdt * dt;
        console.log("temp, boiling:", (temp_conc - 273.15).toFixed(2), (Tboil - 273.15).toFixed(2));
    } else {
        // Approximately no evaporation; keep previous results
        mdot_conc = mdot_feed;
        mdot_evap = 0;
        temp_conc = newT_noCons;
    }

    // Calculate RoC of sucrose
    const dmdt = mdot_feed * X_IN - mdot_conc * x_c;

    // Calculate steam rate
    const mdot_stm = heat_rate / dHvap(temp_stm); // kg / s

    // debug
// if (__DEV__) {
//     if (debugt++ % 3 == 0) {
//     const temp_msg = {
//         thi: temp_stm,
//         tci: temp_feed,
//         tco: temp_conc
//     }
//     const flow_msg = {
//         feed: mdot_feed * 60,
//         steam: mdot_stm * 60,
//         evap: mdot_evap * 60,
//         conc: mdot_conc * 60
//     }
//     const comp_msg = {
//         feed: X_IN,
//         conc: x_c
//     }
//     sendTestData(temp_msg, "temperature");
//     sendTestData(flow_msg, "flowrates");
//     sendTestData(comp_msg, "composition");
//     }
// }

    // Set state
    state.evapFlow = mdot_evap * 60; // kg / min
    state.steamFlow = mdot_stm * 60; // kg / min
    state.concFlow = mdot_conc * 60; // kg / min
    state.concComp = (m_c + dmdt * dt) / MASS_IN_EVAPORATOR;
    console.log(state.concComp)
    state.concTemp = temp_conc - 273.15;
    state.steamTemp = temp_stm - 273.15;
    // console.log(state.steamTemp)

    // console.log(temp_conc)

    return state;
}

import type { EvaporatorState } from "../types";

const UA = 1e-3; // W / K
const DELTA_H_VAP = 5000; // J / mol / K
const STEAM_TEMP = 500; // deg C
const EVAPORATOR_PRESSURE = 3; // bar
const CP = 4184; // J / kg / K
const X_IN = 0.1;

/**
 * Calculate saturated pressure from temperature
 */
function antoines(T: number) {
    const A = 100;
    const B = 100;
    const C = 100;
    return 10 ** (A - B / (T + C));
}

/**
 * Calculate saturated temperature from pressure
 */
function inverse_antoines(P: number) {
    const A = 100;
    const B = 100;
    const C = 100;
    return B / (Math.log10(P) - A) - C;
}

export function calculateEvaporator(state: EvaporatorState) {
        // Read the current state
        const temp_conc = inverse_antoines(EVAPORATOR_PRESSURE);
        const temp_stm  = STEAM_TEMP;
        const mdot_feed = state.feedFlow.value;
        const temp_feed = state.feedTemp.value;
        

        // Calculate the heating rate
        const heat_rate = UA * (temp_stm - temp_conc);
        const mdot_evap = (heat_rate - mdot_feed * CP * (temp_conc - temp_feed)) / DELTA_H_VAP;
        const mdot_stm  = heat_rate / DELTA_H_VAP;
        const mdot_conc = mdot_feed - mdot_evap;

        // Set state
        state.evapFlow = mdot_evap;
        state.steamFlow = mdot_stm;
        state.concFlow = mdot_conc
        state.concComp = X_IN * mdot_feed / mdot_conc
        state.steamPres = antoines(STEAM_TEMP);
        state.steamTemp = STEAM_TEMP;

        return state;
}
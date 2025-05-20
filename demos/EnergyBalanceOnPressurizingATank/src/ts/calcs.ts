/**
 * ****** Energy balance with water: ******
 *      m_1 U_1 + m_2 H_2 = (m_1 + m_2) U_final
 * where
 *      q_1 = ((V_1/m_1) - V_1,l) / (V_1,v - V_1,l)
 *      U_1 = q_1 U_1,v + (1-q_1) U_1,l
 * thus,
 *      q_f = (V_1 / (m_1 + m_2) - V_2,l) / (V_2,v - V_2,l)
 *      U_f = q_f U_2,v + (1 - q_f) U_2,l
 * 
 * Final temp is saturation temp at final pressure (P final === P2)
 * 
 */

import { State } from "../main";
import { FluidType, type CalculatedValues } from "../types";
import { secantMethod } from "./secant";

/*
type GlobalState = {
    canvas: Renderer | undefined;

    playState: PlayState;
    fluidType: FluidType;

    linePressure: number;
    lineTemperature:number;
    tankPressure: number;
};
*/

const VOLUME = 0.1 // m3
const MASS_1 = 1 // kg

/**
 * Need: Initial and final vapour fractions,
 * sat temp for each pressure (range 1 to 15 bar),
 * spec volumes for "
 * internal nrg for "
 * enthalpy vals .. "
 */
export function calculations(t: number) {

    var fluidType = State.fluidType;

    if (fluidType == FluidType.WATER) {
        if (State.steamTable === null) return;
        steamCalcs(t);
    }
    else {

    }
}

/**
 * Run the calculations for steam. 
 * Note that the steam table must be loaded before calling this function.
 * @param t Interpolant for play animation
 * @returns CalculatedValues object for current time
 */
const steamCalcs = (t: number) => {
    var linePres = State.linePressure;
    var initTankPres = State.tankPressure;
    var steamTable = State.steamTable!;

    // Calculate current tank pressure based on interpolant
    var tankPres = initTankPres + t * (linePres - initTankPres);

    // Helper to lookup and validate
    const checkLookup = (pressure: number, col: string): number => {
        let val = steamTable.interpolate(pressure, col);
        if (val === null)
            throw new Error(`${col} lookup null at pressure ${pressure}`);
        else return val;
    }

    // Find relavant params
    var tankTemp = checkLookup(tankPres, 'T(C)');
    var vol_l1 = checkLookup(initTankPres, 'Vl(m3/kg)');
    var vol_v1 = checkLookup(initTankPres, 'Vv(m3/kg)');
    var vol_lf = checkLookup(tankPres, 'Vl(m3/kg)');
    var vol_vf = checkLookup(tankPres, 'Vv(m3/kg)');
    var u_l1 = checkLookup(initTankPres, 'Ul(kJ/kg)');
    var u_v1 = checkLookup(initTankPres, 'Uv(kJ/kg)');
    var u_l2 = checkLookup(tankPres, 'Ul(kJ/kg)');
    var u_v2 = checkLookup(tankPres, 'Uv(kJ/kg)');
    var h_2 = checkLookup(tankPres, 'Hv(kJ/kg)');

    // Setup calculation
    const massFromLine = (m2: number) => {
        // Initial energy balance
        let q_1 = (VOLUME / MASS_1 - vol_l1) / (vol_v1 - vol_l1);
        let u_1 = q_1 * u_v1 + (1 - q_1) * u_l1;
        // Final energy balance
        let q_f = (VOLUME / (MASS_1 + m2) - vol_lf) / (vol_vf - vol_lf);
        let u_f = q_f * u_v2 + (1 - q_f) * u_l2;
        // Return difference
        return MASS_1 * u_1 + m2 * h_2 - (MASS_1 + m2) * u_f;
    }

    // Solve using secant method
    var m2 = secantMethod(massFromLine, 0, 10)!;
    console.log(m2)
    console.log(massFromLine(m2!));

    if (m2 === null)
        console.warn(`Warning: secant method not solved at ${tankPres} bar`);

    // Now get actual quality
    let quality = (VOLUME / (MASS_1 + m2!) - vol_lf) / (vol_vf - vol_lf);


    // Fill out result object and return
    var result: CalculatedValues = {
        tankPressure: tankPres,
        tankTemperature: tankTemp!,
        tankComposition: 1 - quality
    }

    console.log(result)

    return result;
}


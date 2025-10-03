import { type Accessor, type Setter } from "solid-js";
import { animate } from "../../ts/helpers";
import type { KettleProps } from "./Kettle";
import { dHvap } from "../../ts/calcs";

const chamberVolume = 5; // gal
const UA0 = 5; // kW / K
const MIN_UA = 5; // kW / K
const Cp = 4.1868; // kJ / kg / K
const rho_kg_gal = 3.78; // kg / gal

// interface KettleProps {
//   // Inputs
//   feedRate: () => number; // in gal/min
//   steamTemp: () => number; // in C
//
//   // Outputs
//   onOutletChange?: (outletTemp: number) => void; // Callback for outlet temperature change, in Celsi
//   onEvaporateChange?: (evapCh: number) => void; // Callback for evaporation change, in gal/m
//   onConcentrateChange?: (concCh: number) => void; // Callback for concentration change, in gal/m
// };

export interface ChamberFills { 
    // Fill Accessors
    chamberFill     : Accessor<number>,
    pathFill        : Accessor<number>,
    overflowFill    : Accessor<number>,
    // Fill Setters
    setChamberFill  : Setter<number>,
    setPathFill     : Setter<number>,
    setOverflowFill : Setter<number>,
    // Evaporate
    internalEvaporateRate   : Accessor<number>,
    setInternalEvaporateRate: Setter<number>,
};

export function animateChamberMassBalance(props: KettleProps, fills: ChamberFills) {
    // Variables only seen by this
    let overflowRate = 0;

    // Animate the chamber itself
    animate((dt: number) => {
        // Update chamber fill based on feed rate
        const fill = fills.chamberFill();
        const flow = props.feedRate();
        // Pixels tall
        const height = 127 * fill;

        // Calculate new fill level
        const fillIn = flow / chamberVolume * dt / 60; // Convert to per minute, then normalize to chamber volume
        overflowRate = (height > 124) ? (height - 124) * 20 / 3 : 0;
        const fillOut = overflowRate * dt / 60 / chamberVolume;

        let newFill = fill + fillIn - fillOut;
        newFill = Math.min(1, newFill); // Clamp under 1

        // Update and continue animation if not full
        fills.setChamberFill(newFill);
        // Always run this animation
        return true;
    });

    // Animate the path until it is filled...
    let filling: boolean = false;
    animate((dt: number) => {
        // Determine whether to start the animation
        const start = (fills.chamberFill() * 127 > 124);
        if (start) filling = true;

        // If not started, keep waiting
        if (!filling) return true;

        // Update chamber fill based on feed rate
        const fill = fills.pathFill();

        // Calculate new fill level
        let newFill = filling ? fill + dt : 0; // Only one second to fill
        newFill = Math.min(1, newFill); // Clamp under 1

        // Update and continue animation until full
        fills.setPathFill(newFill);
        return (newFill !== 1);
    }, 
    // ...Then animate the overflow
    () => animate((dt: number) => {
        // Update chamber fill based on feed rate
        const fill = fills.overflowFill();
        const flowIn = overflowRate;
        const flowOut = fill * 20; // GPM

        // Calculate new fill level
        let newFill = fill + (flowIn - flowOut) * dt/60 / .5;
        newFill = Math.min(1, newFill); // Clamp under 1
        // console.log(`Overflow fill: ${newFill.toFixed(3)}`);

        // Update and continue animation if not full
        fills.setOverflowFill(newFill);
        // Update the outlet
        props.onOutletChange?.(flowOut * 3785 / 60);
        return true;
    }));
}

/**
 * Energy balance to calculate the steam flowrate
 * @param chamberFill Fill ratio of the chamber (fraction)
 * @param steamTemp Temperature of steam (C)
 * @param chamberTemp Temperature of the chamber (K)
 * @returns Steam Flowrate (g/s)
 */
export function calculateSteamOut(chamberFill: number, steamTemp: number, chamberTemp: number) {
    const UA = Math.max(chamberFill * UA0, MIN_UA);

    // Heat rate
    const Qs = UA * (steamTemp - chamberTemp); // W
    const mdot_s = Qs / dHvap(steamTemp); // kg / s
    return 1000 * mdot_s; // g / s
}

export function animateChamberEnergyBalance(props: KettleProps, fills: ChamberFills) {

    // Animate the energy balance
    animate((dt: number) => {
        const fillFrac = fills.chamberFill();
        const Tc = props.outTemp();
        const Tk = Tc + 273.15;

        // If unfilled, avoid dividing by zero
        if (fillFrac === 0) {
            return true;
        }
        // Feed rate
        const mdot_in = props.feedRate() * 3.785 / 60; // GPM to kg/s
        // HEX UA value
        const UA = Math.max(fillFrac * UA0, MIN_UA);

        // Balance
        const nrg_in_minus_out = mdot_in * Cp * (298.15 - Tk);
        const nrg_gen = UA * (props.steamTemp() - Tc);
        const nrg_cons = 0; // TODO: how do

        // Evolve
        const acc = nrg_in_minus_out + nrg_gen - nrg_cons; // kW
        const dTdt = acc / (rho_kg_gal * Cp * chamberVolume); // K / s
        props.onOutTempChange(Tc + dTdt * dt);

        return true;
    });

}
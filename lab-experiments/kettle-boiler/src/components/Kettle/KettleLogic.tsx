import { type Accessor, type Setter } from "solid-js";
import { animate } from "../../ts/helpers";
import type { KettleProps } from "./Kettle";
import { dHvap, FEED_RATE_GAIN } from "../../ts/calcs";

const chamberVolume = 0.5; // L
const chamberCapac_kg = chamberVolume * 0.998; // kg
const chamberHeatCapac = 100; // J / K
const Cp = 4186.8; // J / kg / K
const rho = .998; // kg / L
const MAX_FLOWRATE = FEED_RATE_GAIN / 60; // L / s

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
    const OVERFLOW_PIXELS_MAX = 5;
    // Variables only seen by this
    let overflowRate = 0;

    // Animate the chamber itself
    animate((dt: number) => {
        // Update chamber fill based on feed rate
        const fill = fills.chamberFill();
        const flow = props.feedRate() / 60; // L / s
        // Pixels tall
        const height = 129 * fill;

        // Calculate new fill level
        const fillIn = flow / chamberVolume * dt; // normalize to chamber volume (unitless)
        overflowRate = (height > 124) ? (height - 124) * MAX_FLOWRATE / OVERFLOW_PIXELS_MAX : 0;
        const fillOut = overflowRate * dt / chamberVolume; // unitless
        const evapOut = fills.internalEvaporateRate() * dt / chamberCapac_kg; // unitless

        let newFill = fill + fillIn - fillOut - evapOut;
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
        const start = (fills.chamberFill() * 129 > 124);
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
        const fill = fills.overflowFill() * MAX_FLOWRATE;
        const flowIn = overflowRate; // L / s
        const flowOut = fill; // L / s

        // Calculate new fill level
        let newFill = fill + (flowIn - flowOut) * dt;
        newFill = Math.min(1, newFill); // Clamp under 1

        // Update and continue animation if not full
        fills.setOverflowFill(newFill / MAX_FLOWRATE);
        // Update the outlet
        props.onOutletChange?.(flowOut * 1000); // mL / s
        return true;
    }));
}

export function animateChamberEnergyBalance(props: KettleProps, fills: ChamberFills) {

    // Animate the energy balance
    animate((dt: number) => {
        const fillFrac = fills.chamberFill();
        const fillMass = fillFrac * chamberCapac_kg; // mass in shell
        const Tc = props.outTemp();
        const Ts = props.steamTemp();

        // Calc Heat rate
        const UA = 674;//Math.max(fillFrac * UA0, MIN_UA); // W / K
        const heat_rate = UA * (Ts - Tc); // W

        // Feed rate
        const mdot_in = rho * props.feedRate() / 60; // LPM to kg/s
        const T_in = 25; // C
        
        // Balance
        const nrg_in = (fillMass > 0) ? mdot_in * Cp * (T_in - Tc) : 0; // W
        const totCapac = fillMass * Cp + chamberHeatCapac; // J / K
        
        let cons = 0, evap = 0;
        // Solve for evaporation
        const Tboil = 100; // K
        if (fillFrac > 0) {
            // Energy required to keep at boiling point\
            // Because this is differential, we only need to supply enough energy to cover losses
            cons = UA * (Ts - Tboil) + mdot_in * Cp * (T_in - Tboil); // W
            cons = cons > 0 ? cons : 0; // W
            // Use consumption to solve mass balance
            evap = cons / dHvap(Tboil) / 1000; // kg / s 
        }

        // Evolve
        const acc = nrg_in + heat_rate - cons; // W
        const dTdt = acc / totCapac; // K / s
        const cond = heat_rate / dHvap(props.steamTemp()); // W kg / kJ == g / s
        props.onOutTempChange(Tc + dTdt * dt);
        props.onEvaporateChange?.(evap);
        props.onSteamOutChange?.(cond);
        console.log(cond)

        return true;
    });

}
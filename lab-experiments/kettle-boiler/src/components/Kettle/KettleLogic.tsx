import { type Accessor, type Setter } from "solid-js";
import { animate } from "../../ts/helpers";
import type { KettleProps } from "./Kettle";

const chamberVolume = 3; // gal

interface ChamberFills { 
    chamberFill     : Accessor<number>,
    pathFill        : Accessor<number>,
    overflowFill    : Accessor<number>,
    setChamberFill  : Setter<number>,
    setPathFill     : Setter<number>,
    setOverflowFill : Setter<number>,
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
        console.log(`Overflow fill: ${newFill.toFixed(3)}`);

        // Update and continue animation if not full
        fills.setOverflowFill(newFill);
        return true;
    }));

    // Animate the overflow
}

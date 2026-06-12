import { createContext, createMemo, createSignal, onMount, type Accessor, type Setter } from "solid-js";
import { BedCalc, GasCylinder, resetSignal, V2_BED_ANGLE, type BedDescriptor } from "../globals";

export type ContextDescriptor = {
    tempK: Accessor<number>,
    cylinder: Accessor<GasCylinder>,
    v2Angle: Accessor<number>,
    sccmSP: Accessor<number>,
    onOut: (val: { y: number, u: number }) => void;
};

// Context definition and creation for column calculations
export type BedContextType = {
    bed: BedCalc;
    bedUpdated: Accessor<boolean>;
};
export const BedContext = createContext<BedContextType>();
export const BedContextProvider = (props: { children: any, descriptor: ContextDescriptor }) => {
    const [bedUpdated, setBedUpdated] = createSignal(false);

    // From cylinder
    const presBar = createMemo(() => {
        const cyl = props.descriptor.cylinder();
        return cyl.linePres();
    })
    const yIn = createMemo(() => {
        const cyl = props.descriptor.cylinder();
        console.log("y in:", cyl.yCO2)
        return cyl.yCO2;
    });

    const flowing = createMemo(() => {
        const v2a = props.descriptor.v2Angle();
        return (v2a === V2_BED_ANGLE) ? true : false;
    });

    const bedDescriptor: BedDescriptor = {
        // Inputs
        tempK: props.descriptor.tempK,
        presBar,
        yIn,
        flowing,
        sccm: props.descriptor.sccmSP,
        // Outputs
        onOut: props.descriptor.onOut as Setter<{ y: number, u: number }>,
        onUpdate: () => setBedUpdated(v => !v)
    };

    const bed = new BedCalc(bedDescriptor);
    // if (SIM_MODE === "desorption") bed.fill();
    bed.play();
    const store: BedContextType = { bed, bedUpdated };

    onMount(() => {
        resetSignal.subscribe(() => {
            bed.reset();
            // if (SIM_MODE === "desorption") bed.fill();
            bed.play();
        });
    });

    return (
    <BedContext.Provider value={store}>
        {props.children}
    </BedContext.Provider>
    );
}


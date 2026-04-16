import { createContext, createMemo, type Accessor, type Setter } from "solid-js";
import { BedCalc, GasCylinder, type BedDescriptor } from "../globals";

export type ContextDescriptor = {
    tempK: Accessor<number>,
    cylinder: Accessor<GasCylinder>,
    v2Angle: Accessor<number>,
    massSP: Accessor<number>,
    onYOut: (val: number) => null;
};

// Context definition and creation for column calculations
export type BedContextType = {
    bed: BedCalc;
};
export const BedContext = createContext<BedContextType>();
export const BedContextProvider = (props: { children: any, descriptor: ContextDescriptor }) => {
    const { children, descriptor } = props;

    // From cylinder
    const presBar = createMemo(() => {
        const cyl = descriptor.cylinder();
        return cyl.linePres();
    })
    const yIn = createMemo(() => {
        const cyl = descriptor.cylinder();
        console.log("y in:", cyl.yCO2)
        return cyl.yCO2;
    });

    const open = createMemo(() => {
        const v2a = descriptor.v2Angle();
        return (v2a === 180) ? true : false;
    });

    const bedDescriptor: BedDescriptor = {
        // Inputs
        tempK: descriptor.tempK,
        presBar,
        yIn,
        open,
        mdot: descriptor.massSP,
        // Outputs
        on_yOut: descriptor.onYOut as Setter<number>
    };

    const bed = new BedCalc(bedDescriptor);
    bed.play();
    const store: BedContextType = { bed };

    return (
    <BedContext.Provider value={store}>
        {children}
    </BedContext.Provider>
    );
}


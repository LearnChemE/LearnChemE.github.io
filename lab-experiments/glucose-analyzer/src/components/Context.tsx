import { createContext, createSignal, onMount, type Accessor, type Signal } from "solid-js";
import { Fluids, resetSignal, type FluidComposition } from "../globals";
import { AnimationTimer } from "../globals/animate";

export type ContextDescriptor = {
    aniTimer: AnimationTimer;
    injTimer: AnimationTimer;
    playing: Accessor<boolean>;
};

// Context definition and creation for column calculations
export type ReactorContextType = {
    aniTimer: AnimationTimer;
    injTimer: AnimationTimer;
    topFluid: Signal<FluidComposition>;
    botFluid: Signal<FluidComposition>;
    playing: Accessor<boolean>;
};
export const RxrContext = createContext<ReactorContextType>();
export const RxrContextProvider = (props: { children: any, descriptor: ContextDescriptor }) => {
    // const [ctxUpdate, setCtxUpdate] = createSignal(false);

    const topFluid = createSignal(Fluids[0].contains);
    const botFluid = createSignal(Fluids[1].contains);
    console.log(Fluids[0])

    // Create the store for the context object
    const store: ReactorContextType = { 
        aniTimer: props.descriptor.aniTimer,
        injTimer: props.descriptor.injTimer,
        topFluid,
        botFluid,
        playing: props.descriptor.playing
     };

    onMount(() => {
        resetSignal.subscribe(() => {
            // On reset here
            
        });
    });

    return (
    <RxrContext.Provider value={store}>
        {props.children}
    </RxrContext.Provider>
    );
}


import { createContext, onMount } from "solid-js";
import { resetSignal } from "../globals";
import { AnimationTimer } from "../globals/animate";

export type ContextDescriptor = {
    aniTimer: AnimationTimer;
};

// Context definition and creation for column calculations
export type ReactorContextType = {
    aniTimer: AnimationTimer;
};
export const RxrContext = createContext<ReactorContextType>();
export const RxrContextProvider = (props: { children: any, descriptor: ContextDescriptor }) => {
    // const [ctxUpdate, setCtxUpdate] = createSignal(false);

    // Create any necessary memos and signals here
    // const [vol, setVol] = createSignal(REACTOR_VOL_INIT);

    // Create calculations objects, etc

    // Create the store for the context object
    const store: ReactorContextType = { 
        aniTimer: props.descriptor.aniTimer
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


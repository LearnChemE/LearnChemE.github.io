import { createContext, createSignal, onMount } from "solid-js";
import { REACTOR_VOL_INIT, resetSignal } from "../globals";

export type ContextDescriptor = {
    
};

// Context definition and creation for column calculations
export type ReactorContextType = {
    vol: () => number;
    setVol: (v: number) => void;
};
export const RxrContext = createContext<ReactorContextType>();
export const RxrContextProvider = (props: { children: any, descriptor: ContextDescriptor }) => {
    // const [ctxUpdate, setCtxUpdate] = createSignal(false);

    // Create any necessary memos and signals here
    const [vol, setVol] = createSignal(REACTOR_VOL_INIT);

    // Create calculations objects, etc

    // Create the store for the context object
    const store: ReactorContextType = { vol, setVol };

    onMount(() => {
        resetSignal.subscribe(() => {
            // On reset here
            setVol(REACTOR_VOL_INIT);
        });
    });

    return (
    <RxrContext.Provider value={store}>
        {props.children}
    </RxrContext.Provider>
    );
}


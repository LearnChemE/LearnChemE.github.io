import { createContext, onMount } from "solid-js";
import { resetSignal } from "../globals";

export type ContextDescriptor = {
    
};

// Context definition and creation for column calculations
export type ReactorContextType = {

};
export const RxrContext = createContext<ReactorContextType>();
export const RxrContextProvider = (props: { children: any, descriptor: ContextDescriptor }) => {
    // const [bedUpdated, setBedUpdated] = createSignal(false);

    // Create any necessary memos and signals here

    // Create calculations objects, etc

    // Create the store for the context object
    const store: ReactorContextType = { };

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


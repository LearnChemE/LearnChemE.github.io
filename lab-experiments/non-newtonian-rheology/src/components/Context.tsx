import { createContext, onMount } from "solid-js";
import { resetSignal } from "../globals";

export type ContextDescriptor = {
    
};

// Context definition and creation for column calculations
export type AppContextType = {
    
};
export const AppContext = createContext<AppContextType>();
export const AppContextProvider = (props: { children: any, descriptor: ContextDescriptor }) => {
    // const [ctxUpdate, setCtxUpdate] = createSignal(false);

    // Create the store for the context object
    const store: AppContextType = { 
        
     };

    onMount(() => {
        resetSignal.subscribe(() => {
            // On reset here
            
        });
    });

    return (
    <AppContext.Provider value={store}>
        {props.children}
    </AppContext.Provider>
    );
}


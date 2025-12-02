import { createContext, createSignal, useContext, type JSX } from "solid-js";
import "./Magnifier.css";

// Context for magnifier state
export interface MagnifierContextType {
  registerEmitter: (key: string, ref: SVGElement) => void;
  unregisterEmitter: (key: string) => void;
  setLensPosition: (pos: { x: number, y: number }) => void;
  setActiveKey: (key: string | null) => void;
  lensPosition: () => { x: number; y: number };
  activeKey: () => string | null;
  getEmitterRef: (key: string) => SVGElement | undefined;
}

const MagnifierContext = createContext<MagnifierContextType>();

// Provider component
export function MagnifierProvider(props: { children: JSX.Element }) {
  const [emitters, setEmitters] = createSignal<Map<string, SVGElement>>(new Map());
  const [lensPosition, setLensPosition] = createSignal({ x: 0, y: 0 });
  const [activeKey, setActiveKey] = createSignal<string | null>(null);

  const registerEmitter = (key: string, ref: SVGElement) => {
    console.log(`Emitter ${key}: ${ref}`)
    setEmitters(prev => {
      const next = new Map(prev);
      next.set(key, ref);
      return next;
    });
  };

  const unregisterEmitter = (key: string) => {
    setEmitters(prev => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  };

  const getEmitterRef = (key: string) => {
    return emitters().get(key);
  };

  return (
    <MagnifierContext.Provider
      value={{
        registerEmitter,
        unregisterEmitter,
        setLensPosition,
        setActiveKey,
        lensPosition,
        activeKey,
        getEmitterRef
      }}
    >
      {props.children}
    </MagnifierContext.Provider>
  );
}

// Hook to access magnifier context
export function useMagnifier() {
  const context = useContext(MagnifierContext);
  if (!context) {
    throw new Error('useMagnifier must be used within MagnifierProvider');
  }
  return context;
}

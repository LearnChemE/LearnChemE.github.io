// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
interface WasmModule {
}

export interface ClassHandle {
  isAliasOf(other: ClassHandle): boolean;
  delete(): void;
  deleteLater(): this;
  isDeleted(): boolean;
  // @ts-ignore - If targeting lower than ESNext, this symbol might not exist.
  [Symbol.dispose](): void;
  clone(): this;
}
export interface CoCurrentCalc extends ClassHandle {
  solve(): void;
  getResultView(_0: number): any;
  getTEval(): any;
}

interface EmbindModule {
  CoCurrentCalc: {
    new(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number): CoCurrentCalc;
  };
}

export type MainModule = WasmModule & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;

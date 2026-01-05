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
export interface SedimentSolver extends ClassHandle {
  initialize(_0: number, _1: number): void;
  solve(_0: number): boolean;
  getConcentrationView(): any;
}

interface EmbindModule {
  SedimentSolver: {
    new(_0: number, _1: number): SedimentSolver;
  };
}

export type MainModule = WasmModule & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;

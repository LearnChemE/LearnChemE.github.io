import type { Accessor } from "solid-js";
import { expMemo } from "./signals";
import type { FluidProps } from "./config";

export function createForceMemo(rpm: Accessor<number>, fluid: Accessor<FluidProps>) {
    return expMemo(() => {
        const rotRate = rpm();

        return 0;
    }, 1000, 0.01);

}
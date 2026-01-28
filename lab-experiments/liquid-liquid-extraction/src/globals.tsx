import { createMemo, createSignal } from "solid-js";
import { DEFAULT_NUMBER_OF_STAGES, STAGE_HEIGHT, ZERO_STAGE_PADDING } from "./ts/config";

// Global signals for application state
export const [numberOfStages, setNumberOfStages] = createSignal(DEFAULT_NUMBER_OF_STAGES);
export const paddingTop = createMemo(() => Math.max(0, (1 - numberOfStages()) * STAGE_HEIGHT + ZERO_STAGE_PADDING));
import { createMemo, createSignal } from "solid-js";
import { COLUMN_BASE_VOL, COLUMN_VOL_PER_STAGE, DEFAULT_NUMBER_OF_STAGES, STAGE_HEIGHT, ZERO_STAGE_PADDING } from "./ts/config";

// Global signals for application state
export const [numberOfStages, setNumberOfStages] = createSignal(DEFAULT_NUMBER_OF_STAGES);
export const [resetEvent, setResetEvent] = createSignal(false);
export const [colFull, setColFull] = createSignal(false);
export const paddingTop = createMemo(() => Math.max(0, (1 - numberOfStages()) * STAGE_HEIGHT + ZERO_STAGE_PADDING));

/**
 * Height adjustment based on number of stages. Max of 176 at 8 stages
 */
export const paddedHeight = createMemo(() => Math.max(0, STAGE_HEIGHT * (numberOfStages() - 1) - ZERO_STAGE_PADDING));
export const columnVolume = createMemo(() => COLUMN_BASE_VOL + COLUMN_VOL_PER_STAGE * numberOfStages());
export const triggerResetEvent = () => setResetEvent(!resetEvent());
import type { Composition } from "../calcs";

// Configuration constants for the liquid-liquid extraction lab experiment
export const STAGE_HEIGHT = 32;
export const DEFAULT_NUMBER_OF_STAGES = 8;
export const ZERO_STAGE_PADDING = 48;

export const SOLVENT_MAX_RATE = 10;
export const FEED_MAX_RATE = 10;

export const COLUMN_BASE_VOL = 8; // L
export const COLUMN_VOL_PER_STAGE = 3; // L

export const FEED_COMP: Composition = [.52, .43];
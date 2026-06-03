import type { Composition } from "../calcs";

const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');

export const MEB_MODE = (mode === "meb");

// Configuration constants for the liquid-liquid extraction lab experiment
export const STAGE_HEIGHT = 32;
export const DEFAULT_NUMBER_OF_STAGES = MEB_MODE ? 4 : 2;
export const MIN_STAGES = MEB_MODE ? 3 : 1;
export const MAX_STAGES = MEB_MODE ? 5 : 8;
export const ZERO_STAGE_PADDING = 48;

export const SOLVENT_MAX_RATE = 10;
export const FEED_MAX_RATE = 10;

export const COLUMN_BASE_VOL = 8; // L
export const COLUMN_VOL_PER_STAGE = 3; // L

export const FEED_COMP: Composition = [.52, .43];

export const INIT_FEED_LIFT = 0.75;
export const INIT_SOLV_LIFT = 0.5;

export const MIN_EFFICIENCY = 50; // %
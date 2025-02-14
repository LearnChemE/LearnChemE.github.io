// state.js
import { draw, drainDiameterDropdown, liquidHeightDropdown, ratio, tableY, legWidth, surfaceWidth } from './constants.js';

export let isRotated = false;
export let waterHeight = (parseFloat(liquidHeightDropdown.value)) * ratio;
export let diameter = parseFloat(drainDiameterDropdown.value) * ratio;
export let fillTankPath;
export let valveGroup = null;
export let fillTankPathData;
export let timerInterval;
export let elapsedTime = 0;
export let droplets = [];
export let animationFrameId;
export let valveCenterY = tableY - legWidth - surfaceWidth - diameter / 2;

export function setValveGroup(group) {
    valveGroup = group;
}

export function setFillTankPath(group) {
    fillTankPath = group;
}

export function setFillTankPathData(group) {
    fillTankPathData = group;
}

export function setIsRotated(group) {
    isRotated = group;
}

export function setDroplets(group) {
    waterHeight = group;
}

export function setElapsedTime(group) {
    elapsedTime = group;
}

export function setTimeInterval(group) {
    timerInterval = group;
}

export function setWaterHeight(group) {
    waterHeight = group;
}

export function setAnimateFrameId(group) {
    animationFrameId = group;
}

export function setDiameter(group) {
    diameter = group;
}
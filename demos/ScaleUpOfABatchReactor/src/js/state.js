export let panStart = { x: 0, y: 0 };
export let isPanning = false;
export function setOutletMoleFraction(value) { outletMoleFraction = value; }
export function setIsPanning(value) { isPanning = value; }
export function getIsPanning() { return isPanning; }
export function setPanStart(value) { panStart = value; }
export function getPanStart() { return panStart; }
export const canvasWidth = 1000;
export const canvasHeight = 600;

export const mainCylWidth = 60;
export const mainCylHeight = 250;
export const nozzleRect1Width = 30;
export const nozzleRect1Height = 12;
export const nozzleRect2Width = 15;
export const nozzleRect2Height = 20;
export const nozzleRect3Width = 30;
export const nozzleRect3Height = 12;
export const valveBlockWidth = 20; // Horizontal Valve (Not used in final drawing?)
export const valveBlockHeight = 40;
export const verticalValveBlockWidth = 15;
export const verticalValveBlockHeight = 7.5;
export const verticalValveBodyWidth = 15;
export const verticalValveBodyHeight = 20;
export const verticalValveStemWidth = 5;
export const verticalValveStemHeight = 10;
export const verticalValveTrapezoidWidth = 5;
export const verticalValveTopExtent = 15;
export let pipeGroup = null;
export function setPipeGroup(v) {
  pipeGroup = v;
}
export function getPipeGroup() {
  return pipeGroup;
}
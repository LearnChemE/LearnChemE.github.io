import type { FirstOrder } from "../classes/Setpoint";
import type { DigitalLabelDescriptor, SetpointControlDescriptor } from "../types";


const DigitalLabelFill = "#F9F155";

export const furnaceSPLabelDescriptor: DigitalLabelDescriptor = {
  id: "furnaceLabel",
  gid: "switch_2",
  centerId: "furnaceScreen",
  fill: DigitalLabelFill,
  units: "°C",
  decimals: 0,
  initialValue: 100,
  range: {
    range: [100, 500],
    overflowString: "HOT",
    underflowString: ""
  }
};

export const furnaceSPDescriptor: SetpointControlDescriptor<FirstOrder> = {
  ctrl: null,
  upBtnId: "furnaceUpBtn",
  downBtnId: "furnaceDownBtn",
  spLabel: null,
  outLabel: null,
  min: 100,
  max: 500,
  step: 5
};
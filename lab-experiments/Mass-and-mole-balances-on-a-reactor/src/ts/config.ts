import type { FirstOrder } from "../classes/Setpoint";
import type { TubeDescriptor } from "../classes/Tube";
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
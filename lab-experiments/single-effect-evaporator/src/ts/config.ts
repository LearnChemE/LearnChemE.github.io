import type { ControlType, DigitalLabelDescriptor, OutletDescriptor, SetpointControlDescriptor } from "../types";

/**
 * Label for steam flowrate
 */
export const steamFlowLabelDescriptor: DigitalLabelDescriptor = {
  id: "steamFlowLabel",
  gid: "steamFlowGauge",
  centerId: "steamFlowScreen",
  fill: "#F9F155",
  units: "",
  decimals: 1,
  initialValue: 0,
  range: {
    range: [0, 10000],
    overflowString: "OVER",
    underflowString: "UNDER"
  }
};

/**
 * Label for steam flowrate
 */
export const steamPresLabelDescriptor: DigitalLabelDescriptor = {
  id: "steamPresLabel",
  gid: "steamFlowGauge_2",
  centerId: "steamPresScreen",
  fill: "#F9F155",
  units: "",
  decimals: 1,
  initialValue: 20,
  range: {
    range: [0, 10000],
    overflowString: "OVER",
    underflowString: "UNDER"
  }
};

/**
 * Label for steam flowrate
 */
export const steamTempLabelDescriptor: DigitalLabelDescriptor = {
  id: "steamTempLabel",
  gid: "steamFlowGauge_2",
  centerId: "steamTempScreen",
  fill: "#F9F155",
  units: "",
  decimals: 1,
  initialValue: 212.4,
  range: {
    range: [0, 10000],
    overflowString: "OVER",
    underflowString: "UNDER"
  }
};

/**
 * Label for steam temperature
 */
export const tankTempLabelDescriptor: DigitalLabelDescriptor = {
  id: "evapTempLabel",
  gid: "evapTempGauge",
  centerId: "evapTempScreen",
  fill: "#F9F155",
  units: "",
  decimals: 1,
  initialValue: 25,
  range: {
    range: [0, 1000],
    overflowString: "OVER",
    underflowString: "UNDER"
  }
};

/**
 * Label for concentrate scale
 */
export const concScaleLabelDescriptor: DigitalLabelDescriptor = {
    id: "concentrateScaleLabel",
    gid: "concentrateScale",
    centerId: "concentrateScreen",
    fill: "#F9F155",
    units: "kg",
    decimals: 2,
    initialValue: 0,
    range: {
        range: [0, 20],
        overflowString: "FULL",
        underflowString: "NEG"
    }
};

/**
 * Label for condensate scale
 */
export const condScaleLabelDescriptor: DigitalLabelDescriptor = {
    id: "condensateScaleLabel",
    gid: "condensateScale",
    centerId: "condensateScreen",
    fill: "#F9F155",
    units: "kg",
    decimals: 2,
    initialValue: 0,
    range: {
        range: [0, 20],
        overflowString: "FULL",
        underflowString: "NEG"
    }
};

/**
 * Labels for setpoint controllers
 */
export const spLabels: Array<DigitalLabelDescriptor> = [
    {
        id: "flowCtrlLabel",
        gid: "flowSp",
        centerId: "flowCtrlScreen",
        fill: "#F9F155",
        units: "",
        decimals: 2,
        initialValue: 0,
        range: {
            range: [0, 1000],
            overflowString: "OVER",
            underflowString: "UNDER"
        }
    },
    {
        id: "tempCtrlLabel",
        gid: "tempSp",
        centerId: "tempCtrlScreen",
        fill: "#F9F155",
        units: "",
        decimals: 1,
        initialValue: 25,
        range: {
            range: [0, 1000],
            overflowString: "OVER",
            underflowString: "UNDER"
        }
    },
    {
        id: "feedTempLabel",
        gid: "feedTempGauge",
        centerId: "feedTempScreen",
        fill: "#F9F155",
        units: "",
        decimals: 1,
        initialValue: 25,
        range: {
            range: [0, 1000],
            overflowString: "OVER",
            underflowString: "UNDER"
        }
    },
    {
        id: "feedFlowLabel",
        gid: "feedFlowGauge",
        centerId: "feedFlowScreen",
        fill: "#F9F155",
        units: "",
        decimals: 2,
        initialValue: 0,
        range: {
            range: [0, 1000],
            overflowString: "OVER",
            underflowString: "UNDER"
        }
    }
];

/**
 * Flowrate Setpoint Device
 */
export const flowSpDescriptor: SetpointControlDescriptor<ControlType> = {
    ctrl: null,
    upBtnId: "flowUpBtn",
    downBtnId: "flowDownBtn",
    spLabel: null,
    outLabel: null,
    min: 0,
    max: 15,
    step: 0.5
};

/**
 * Temperature Setpoint Device
 */
export const tempSpDescriptor: SetpointControlDescriptor<ControlType> = {
    ctrl: null,
    upBtnId: "tempUpBtn",
    downBtnId: "tempDownBtn",
    spLabel: null,
    outLabel: null,
    min: 25,
    max: 150,
    step: 5
};

/**
 * Pressure Setpoint Device
 */
export const presSpDescriptor: SetpointControlDescriptor<ControlType> = {
    ctrl: null,
    upBtnId: "flowUpBtn_2",
    downBtnId: "flowDownBtn_2",
    spLabel: null,
    outLabel: null,
    min: 3,
    max: 25,
    step: 1
};

export const concentrateDescriptor: OutletDescriptor = {
  flowrate: 0,
  composition: 0.1,
  drainWaterfallId: "concFallDrain",
  bucketWaterfallId: "concFall",
  valveDescriptor: {
    id: "bottomsValve",
    reverse: true
  },
  label: null
};
export const condensateDescriptor: OutletDescriptor = {
  flowrate: 0,
  composition: 0,
  drainWaterfallId: "condFallDrain",
  bucketWaterfallId: "condFall",
  valveDescriptor: {
    id: "condensateValve",
    reverse: false
  },
  label: null
};


export const pressureLabelDescriptor = {
    id: "pressureLabel",
    centerId: "pressureGuage",
    units: "bar",
    decimals: 2,
    initialValue: 1,
    flipToBottom: false
}

export const evapLabelDescriptor = {
    id: "evapLabel",
    centerId: "Group 1",
    units: "kg/min",
    decimals: 1,
    initialValue: 0,
    flipToBottom: true
}

export const refractLabelDescriptor: DigitalLabelDescriptor = {
  id: "refractLabel",
  gid: "refract",
  centerId: "refractScreen",
  fill: "#000000",
  units: "wt%",
  decimals: 1,
  initialValue: 0,
  range: {
    range: [0, 100],
    overflowString: "OVER",
    underflowString: "UNDER"
  }
}
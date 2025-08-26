import type { ControlType, DigitalLabelDescriptor, SetpointControlDescriptor } from "../types";

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

export const steamTempLabelDescriptor: DigitalLabelDescriptor = {
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

export const concScaleLabelDescriptor: DigitalLabelDescriptor = {
    id: "concentrateScaleLabel",
    gid: "concentrateScale",
    centerId: "concentrateScreen",
    fill: "#F9F155",
    units: "kg",
    decimals: 2,
    initialValue: 0,
    range: {
        range: [0, 1000],
        overflowString: "FULL",
        underflowString: "NEG"
    }
};

export const condScaleLabelDescriptor: DigitalLabelDescriptor = {
    id: "condensateScaleLabel",
    gid: "condensateScale",
    centerId: "condensateScreen",
    fill: "#F9F155",
    units: "kg",
    decimals: 2,
    initialValue: 0,
    range: {
        range: [0, 1000],
        overflowString: "FULL",
        underflowString: "NEG"
    }
};


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
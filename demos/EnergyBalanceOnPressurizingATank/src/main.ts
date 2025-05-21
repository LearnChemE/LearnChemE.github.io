import "./cssmodule.d";
import "./style.css";
import "bootstrap/scss/bootstrap.scss";
import "bootstrap";
import { FluidType, PlayState, type GlobalState } from "./types";
import { DualButtonSelector, DualSelected, type DualButtonSelectorDescriptor } from "./types/dualButton";
import { Slider } from "./types/slider";

export const State: GlobalState = {
  canvas: undefined,
  steamTable: null,
  playState: PlayState.NOT_PLAYED,
  fluidType: FluidType.WATER,
  linePressure: 10,
  lineTemperature: 225,
  tankPressure: 1,
  tankTemperature: 200,
};

// Load steam tables asynchronously
window.addEventListener("load", async () => {
  State.steamTable = await SteamTable.create("./steam.csv");
});

const ftypeDescriptor: DualButtonSelectorDescriptor = {
  btnId1: "water-btn",
  btnId2: "gas-btn",
  style1: {
    clicked: "btn btn-primary btn-sm",
    unclicked: "btn btn-outline-primary btn-sm"
  },
  style2: {
    clicked: "btn btn-secondary btn-sm",
    unclicked: "btn btn-outline-secondary btn-sm"
  },
  callback: (s: number) => {
    State.fluidType = (s === DualSelected.FIRST) ? FluidType.WATER : FluidType.IDEAL_GAS;
    if (s === DualSelected.FIRST) {
      document.getElementById("tank-t-container")?.setAttribute("class", "slider-wrapper hidden");
    }
    else {
      document.getElementById("tank-t-container")?.setAttribute("class", "slider-wrapper");
    }
  },
}
new DualButtonSelector(ftypeDescriptor);

const playResetDescriptor: DualButtonSelectorDescriptor = {
  btnId1: "play-btn",
  btnId2: "reset-btn",
  style1: {
    clicked: "btn btn-success btn-sm disabled",
    unclicked: "btn btn-success btn-sm"
  },
  style2: {
    clicked: "btn btn-danger btn-sm disabled",
    unclicked: "btn btn-danger btn-sm"
  },
  callback: (s: number) => {
    State.playState = (s === DualSelected.FIRST) ? PlayState.PLAYED : PlayState.NOT_PLAYED;
  },
}
new DualButtonSelector(playResetDescriptor);

// Sliders
new Slider("line-p-slider-container", (val: number) => { State.linePressure    = val }, "bar", 0);
new Slider("line-t-slider-container", (val: number) => { State.lineTemperature = val }, "°C" , 0);
new Slider("tank-p-container",        (val: number) => { State.tankPressure    = val }, "bar", 1);
new Slider("tank-t-container", (val: number) => { State.tankTemperature = val }, "°C" , 0);

// Initialize steamTable



import "./ts/sketch";
import { SteamTable } from "./types/steamTable";

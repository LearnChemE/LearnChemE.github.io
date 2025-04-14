import React from "react";
import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./App.css";
import { useState, useEffect } from "react";
import Controls from "./elements/Controls";
import SideBar from "./elements/SideBar";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import ShellTubeSketch, { g } from "./sketch/sketch";
import SingleBeakerSketch from "./sketch/SingleBeaker";
import {
  DirectionsModalDialogue,
  DetailsModalDialogue,
  AboutModalDialogue,
} from "./elements/ModalDialogues";
import { Tooltips } from "./elements/Tooltips";

const DOUBLE_BEAKER_MODE = 0;
const SINGLE_BEAKER_MODE = 1;

function App() {
  // State vars
  const [pumpsAreRunning, setPumpsAreRunning] = useState(false);
  const [measured, setMeasured] = useState([-1, -1, -1, -1]);
  const [pumpBtnIsDisabled, setPumpBtnDisabled] = useState(false);
  const [experimentMode, setExperimentMode] = useState(DOUBLE_BEAKER_MODE);
  const [sideBarIsShowing, setSideBarShowing] = useState(false);
  const [animationIsFinished, setAnimationFinished] = useState(false);
  let pumpBtnTimeout: NodeJS.Timeout;

  // Event handlers
  const pumpBtnHandler = () => {
    if (g.startTime === -1) {
      // startTime === NOT_STARTED
      g.startTime = -2; // START_NEXT_FRAME
      setPumpBtnDisabled(true);
      pumpBtnTimeout = setTimeout(() => {
        setPumpBtnDisabled(false);
        setAnimationFinished(true);
      }, 5000);
    }
    g.hIsFlowing = !pumpsAreRunning;
    g.cIsFlowing = !pumpsAreRunning;
    setPumpsAreRunning((pumpsAreRunning) => !pumpsAreRunning);
    setMeasured([-1, -1, -1, -1]);
  };
  const measureBtnHandler = () => {
    setMeasured([g.Th_in, g.Th_out_observed, g.Tc_in, g.Tc_out_observed]);
    console.log([g.Th_in,g.Th_out,g.Th_out_observed])
  };
  const resetBtnHandler = () => {
    g.vols = [1000, 0, 1000, 0]; // reset volumes
    g.startTime = -1; // NOT_STARTED
    g.hIsFlowing = false;
    g.cIsFlowing = false;
    setPumpBtnDisabled(false);
    setPumpsAreRunning(false);
    setMeasured([-1, -1, -1, -1]);
    clearTimeout(pumpBtnTimeout);
    setAnimationFinished(false);
  };
  // Swap the first and third beakers with the second and fourth. This is called the swap button, but is actually labelled "pour back"
  const swapBtnHandler = () => {
    // Temp measurements become outdated
    setMeasured([-1,-1,-1,-1]);

    // Calc average temps. Use the observed values for the effluent; g.Tx_out will be recalculated on running the pumps.
    // Orange
    g.Th_in = (g.Th_in * g.vols[0] + g.Th_out_observed * g.vols[1]) / 1000;
    // Blue
    g.Tc_in = (g.Tc_in * g.vols[2] + g.Tc_out_observed * g.vols[3]) / 1000;

    // Reset volumes
    g.vols = [1000,0,1000,0];
  }

  // Wrapper for Controls to keep the hooks the same
  const ControlWrapper = () => {
    return (
      <Controls
        pumpsAreRunning={pumpsAreRunning}
        pumpBtnIsDisabled={pumpBtnIsDisabled}
        animationIsFinished={animationIsFinished}
        showSwapBtn={experimentMode == DOUBLE_BEAKER_MODE}
        pumpBtnHandler={() => pumpBtnHandler()}
        measureBtnHandler={() => measureBtnHandler()}
        menuBtnHandler={() =>
          setSideBarShowing((sideBarIsShowing) => !sideBarIsShowing)
        }
        swapBtnHandler={() => swapBtnHandler()}
      />
    );
  };

  // Render
  return (
    <>
      <div className="sim-wrapper">
        <ControlWrapper />
        <div
          className="graphics-wrapper"
          style={
            measured[0] != -1
              ? { cursor: "url('thermometer.png') 25 95, auto" }
              : { cursor: "auto" }
          }
        >
          <ReactP5Wrapper
            sketch={
              experimentMode === DOUBLE_BEAKER_MODE
                ? ShellTubeSketch
                : SingleBeakerSketch
            }
          />
          <a className="tooltip-anchor" id="hi-anchor" />
          <a className="tooltip-anchor" id="ho-anchor" />
          <a className="tooltip-anchor" id="ci-anchor" />
          <a className="tooltip-anchor" id="co-anchor" />
          <a
            className="tooltip-anchor"
            id="outlet-tubes-anchor"
            data-tooltip-offset={30}
          />
        </div>
      </div>

      <SideBar
        showing={sideBarIsShowing}
        onCloseBtnClick={() => setSideBarShowing(false)}
        selected={experimentMode}
        toggleSelected={(newMode) => {
          resetBtnHandler();
          setExperimentMode(newMode);
        }}
        onResetBtnClick={() => resetBtnHandler()}
      >
        <ControlWrapper />
      </SideBar>

      <DirectionsModalDialogue />
      {DetailsModalDialogue}
      {AboutModalDialogue}

      <Tooltips
        measured={measured}
        canvasMode={experimentMode}
        pumpsAreRunning={pumpsAreRunning}
      />
    </>
  );
}

export default App;

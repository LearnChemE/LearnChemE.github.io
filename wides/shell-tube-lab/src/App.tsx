import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./App.css";
import { useState, useEffect } from "react";
import Controls from "./components/Controls";
import SideBar from "./components/SideBar";
// import { ReactP5Wrapper } from "@p5-wrapper/react";
import ReactP5Wrapper from "./components/ReactP5Wrapper";
import ShellTubeSketch, { g } from "./sketch/sketch";
import SingleBeakerSketch from "./sketch/SingleBeaker";
import {
  DirectionsModalDialogue,
  DetailsModalDialogue,
  AboutModalDialogue,
} from "./components/ModalDialogues";
import { Tooltips } from "./components/Tooltips";
import { ANIMATION_TIME, randStartVals } from "./sketch/functions";

const DOUBLE_BEAKER_MODE = 0;
const SINGLE_BEAKER_MODE = 1;
const notMeasuring = () => [-1, -1, -1, -1];
const getMeasuredValues = () => [g.Th_in, g.Th_out_observed, g.Tc_in, g.Tc_out_observed];

type MeasuringState = {
  measuring: boolean;
  measure: () => number[];
};

function App() {
  // State vars
  const [pumpsAreRunning, setPumpsAreRunning] = useState(false);
  const [measuringState, setMeasuringState] = useState<MeasuringState>({
    measuring: false,
    measure: notMeasuring,
  });
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
        g.fillBeakers = true;
        setPumpBtnDisabled(false);
        setAnimationFinished(true);
      }, ANIMATION_TIME);
    }
    g.hIsFlowing = !pumpsAreRunning;
    g.cIsFlowing = !pumpsAreRunning;
    setPumpsAreRunning((pumpsAreRunning) => !pumpsAreRunning);
    setMeasuringState({ measuring: false, measure: notMeasuring });
  };
  const measureBtnHandler = () => {
    setMeasuringState(measuringState.measuring ? { measuring: false, measure: notMeasuring } : { measuring: true, measure: getMeasuredValues });
  };
  const resetBtnHandler = () => {
    g.vols = [1000, 0, 1000, 0]; // reset volumes
    g.startTime = -1; // NOT_STARTED
    g.fillBeakers = false;
    g.hIsFlowing = false;
    g.cIsFlowing = false;
    setPumpBtnDisabled(false);
    setPumpsAreRunning(false);
    setMeasuringState({ measuring: false, measure: notMeasuring });
    clearTimeout(pumpBtnTimeout);
    setAnimationFinished(false);
    randStartVals();
  };
  // Swap the first and third beakers with the second and fourth. This is called the swap button, but is actually labelled "pour back"
  const swapBtnHandler = () => {
    // Temp measurements become outdated
    setMeasuringState({ measuring: false, measure: notMeasuring });

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
        showSwapBtn={experimentMode === DOUBLE_BEAKER_MODE}
        pumpBtnHandler={() => pumpBtnHandler()}
        measureBtnHandler={() => measureBtnHandler()}
        menuBtnHandler={() =>
          setSideBarShowing((sideBarIsShowing) => !sideBarIsShowing)
        }
        swapBtnHandler={() => swapBtnHandler()}
        onReset={() => resetBtnHandler()}
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
            measuringState.measuring
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
            onFinish={() => {
              g.hIsFlowing = false;
              g.cIsFlowing = false;
              setPumpBtnDisabled(false);
              setPumpsAreRunning(false);
            }}
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
        measure={measuringState.measure}
        canvasMode={experimentMode}
        pumpsAreRunning={pumpsAreRunning}
      />
    </>
  );
}

export default App;

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

  // Event handlers
  const pumpBtnHandler = () => {
    if (g.startTime === -1) {
      // startTime === NOT_STARTED
      g.startTime = -2; // START_NEXT_FRAME
      setPumpBtnDisabled(true);
      setTimeout(() => {
        setPumpBtnDisabled(false);
      }, 5000);
    }
    g.hIsFlowing = !pumpsAreRunning;
    g.cIsFlowing = !pumpsAreRunning;
    setPumpsAreRunning((pumpsAreRunning) => !pumpsAreRunning);
    setMeasured([-1, -1, -1, -1]);
  };
  const measureBtnHandler = () => {
    setMeasured([g.Th_in, g.Th_out, g.Tc_in, g.Tc_out]);
  };
  const resetBtnHandler = () => {};

  // Wrapper for Controls to keep the hooks the same
  const ControlWrapper = () => {
    return (
      <Controls
        pumpsAreRunning={pumpsAreRunning}
        pumpBtnIsDisabled={pumpBtnIsDisabled}
        pumpBtnHandler={() => pumpBtnHandler()}
        measureBtnHandler={() => measureBtnHandler()}
        menuBtnHandler={() =>
          setSideBarShowing((sideBarIsShowing) => !sideBarIsShowing)
        }
      />
    );
  };

  // Render
  return (
    <>
      <div className="sim-wrapper">
        <ControlWrapper />
        <div className="graphics-wrapper">
          <ReactP5Wrapper sketch={ShellTubeSketch} />
          <a className="tooltip-anchor" id="hi-anchor" />
          <a className="tooltip-anchor" id="ho-anchor" />
          <a className="tooltip-anchor" id="ci-anchor" />
          <a className="tooltip-anchor" id="co-anchor" />
        </div>
      </div>

      <SideBar
        showing={sideBarIsShowing}
        onCloseBtnClick={() => setSideBarShowing(false)}
        selected={experimentMode}
        toggleSelected={(newMode) => setExperimentMode(newMode)}
        onResetBtnClick={() => resetBtnHandler()}
      >
        <ControlWrapper />
      </SideBar>

      <DirectionsModalDialogue />
      {DetailsModalDialogue}
      {AboutModalDialogue}

      <Tooltips
        measured={measured}
        canvasMode={0}
        pumpsAreRunning={pumpsAreRunning}
      />
    </>
  );
}

export default App;

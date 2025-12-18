import { useEffect, useState } from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { Tooltips } from "./elements/Tooltips.tsx";
import {
  AboutModalDialogue,
  DetailsModalDialogue,
  DirectionsModalDialogue,
  ResetModalDialogue,
} from "./elements/ModalDialogues.tsx";
import sketch, {
  togglePumps,
  g,
  p5_instance,
  toggleSinglePumps,
} from "./sketch/Sketch.tsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";
import { ANIMATION_TIME, randStartVals } from "./sketch/Functions.tsx";
import {
  SingleBeakerSketch,
  randSingleStartVals,
  setAnimationTimeNextFrame,
  setAnimationTimeToNotStarted,
} from "./sketch/SingleBeaker.tsx";
import { SideBar } from "./elements/SideBar.tsx";

const DOUBLE_BEAKER = 0;
const SINGLE_BEAKER = 1;

type MeasuringState = {
  measuring: boolean;
  measure: () => number[];
}

const notMeasuring = () => [-1, -1, -1, -1];
const getMeasuredValues = () => [g.Th_in, g.Th_out_observed, g.Tc_in, g.Tc_out_observed];

// Use functional style, not classes. Hooks make the code much better to work with.
function App() {
  const [pumpsRunning, setPumpsRunning] = useState(false);
  const [pumpsDone, setPumpsDone] = useState(false);
  const [measuringState, setMeasuringState] = useState<MeasuringState>({
    measuring: false,
    measure: notMeasuring,
  });
  const [isPumpBtnDisabled, setPumpBtnDisabled] = useState(false);
  const [canvasMode, setCanvasMode] = useState(DOUBLE_BEAKER);
  const [showingSideBar, setShowingSideBar] = useState(false);

  // start pumps button
  function handlePumpsClick() {
    setPumpsRunning((pumpsRunning) => !pumpsRunning);

    if (canvasMode === DOUBLE_BEAKER) {
      togglePumps(!pumpsRunning);
      if (g.vols[0] >= 998) {
        setPumpBtnDisabled(true);
        // this sets a 3 second timer where the button is disabled
        setTimeout(() => setPumpBtnDisabled(false), ANIMATION_TIME);
      }
    } else if (canvasMode === SINGLE_BEAKER) {
      toggleSinglePumps(!pumpsRunning);

      if (setAnimationTimeNextFrame()) {
        setPumpBtnDisabled(true);
        // this sets a 3 second timer where the button is disabled
        setTimeout(() => setPumpBtnDisabled(false), ANIMATION_TIME);
      }
    }
  }

  // measure temps button
  function handleMeasureClick() {
    setMeasuringState(measuringState.measuring ? { measuring: false, measure: notMeasuring } : { measuring: true, measure: getMeasuredValues });
    console.log("measurement");
  }

  // reset temps button
  function handleResetClick() {
    console.log("reset");
    g.vols = [1000, 0, 1000, 0];
    g.orngTime = -1;
    g.blueTime = -1;
    if (canvasMode === DOUBLE_BEAKER) {
      randStartVals(p5_instance);
    } else {
      randSingleStartVals();
      setAnimationTimeToNotStarted();
    }
    setPumpsRunning(false);
    setPumpBtnDisabled(false);
    setPumpsDone(false);
    setMeasuringState({ measuring: false, measure: notMeasuring });
    togglePumps(false);
    pumpBtnClass = "btn btn-primary";
    icon = "fa-solid fa-play";
    innerHtml = "start pumps";
  }

  function handleCanvasModeClick(newMode: number) {
    if (newMode === canvasMode) return;
    handleResetClick();
    setAnimationTimeToNotStarted();
    setCanvasMode(newMode);
    if (newMode === SINGLE_BEAKER) {
      setMeasuringState({ measuring: true, measure: getMeasuredValues });
    }
  }

  let pumpBtnClass: string, icon: string, innerHtml: string;
  if (pumpsRunning) {
    pumpBtnClass = "btn btn-danger";
    icon = "fa-solid fa-pause";
    innerHtml = "stop pumps";
  } else {
    pumpBtnClass = "btn btn-primary";
    icon = "fa-solid fa-play";
    innerHtml = "start pumps";
  }

  const Controls = () => {
    return (
      <>
        <div className="buttons-container" id="modal-buttons-container">
          <button
            type="button"
            id="directions-button"
            className="btn btn-primary"
            title="Directions"
            data-bs-toggle="modal"
            data-bs-target="#directions-modal"
          >
            Directions
          </button>
          <button
            type="button"
            id="details-button"
            className="btn btn-primary"
            title="Simulation Details"
            data-bs-toggle="modal"
            data-bs-target="#details-modal"
          >
            Details
          </button>
          <button
            type="button"
            id="about-button"
            className="btn btn-primary"
            title="About this program"
            data-bs-toggle="modal"
            data-bs-target="#about-modal"
          >
            About
          </button>
        </div>
        <div className="nav-bar">
          <div id="nav-bar-left">
            <a href="./DoublePipe-Worksheet_2025.pdf" download>
              <button className="btn btn-primary">
                <div>
                  <i className="fa-solid fa-download"></i>&nbsp;worksheet
                </div>
              </button>
            </a>
          </div>
          <div className="nav-bar-center">
            <button
              type="button"
              id="pumpsBtn"
              className={pumpBtnClass}
              disabled={isPumpBtnDisabled}
              aria-disabled={isPumpBtnDisabled}
              onClick={() => handlePumpsClick()}
            >
              <div>
                <i className={icon}></i>
                &nbsp; {innerHtml}
              </div>
            </button>
            <button
              type="button"
              className={measuringState.measuring ? "btn btn-success" : "btn btn-outline-success"}
              disabled={(isPumpBtnDisabled && !pumpsDone) || canvasMode === SINGLE_BEAKER}
              aria-disabled={(isPumpBtnDisabled && !pumpsDone) || canvasMode === SINGLE_BEAKER}
              onClick={() => handleMeasureClick()}
            >
              { measuringState.measuring ? "stop measuring" : "measure temperatures" }
            </button>
            {/* <button
              type="button"
              className="btn btn-success"
              disabled={pumpsRunning}
              aria-disabled={pumpsRunning}
              onClick={() => handleMeasureClick()}
            >
              swap beakers
            </button> */}
          </div>
          <div id="nav-bar-right">
            <button
              id="menu-btn"
              className="btn btn-secondary"
              onClick={() =>
                setShowingSideBar((showingSideBar) => !showingSideBar)
              }
            >
              <div>
                <i className="fa-solid fa-bars" />
                &nbsp;&nbsp;menu
              </div>
            </button>
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    console.log("pumpsDisabled:", isPumpBtnDisabled);
  }, [isPumpBtnDisabled]);
  useEffect(() => {
    console.log("pumpsDone:", pumpsDone);
  }, [pumpsDone]);
  useEffect(() => {
    console.log("Measure diables:", (isPumpBtnDisabled && !pumpsDone));
  }, [isPumpBtnDisabled, pumpsDone]);

  return (
    <>
      <SideBar
        showing={showingSideBar}
        onClose={() => setShowingSideBar(false)}
        selected={canvasMode}
        toggleSelected={(selected) => handleCanvasModeClick(selected)}
        onResetClick={() => handleResetClick()}
      >
        <div
          className="buttons-container side-bar-extra"
          id="modal-buttons-container"
        >
          <button
            type="button"
            id="directions-button"
            className="btn btn-primary"
            title="Directions"
            data-bs-toggle="modal"
            data-bs-target="#directions-modal"
          >
            Directions
          </button>
          <button
            type="button"
            id="details-button"
            className="btn btn-primary"
            title="Simulation Details"
            data-bs-toggle="modal"
            data-bs-target="#details-modal"
          >
            Details
          </button>
          <button
            type="button"
            id="about-button"
            className="btn btn-primary"
            title="About this program"
            data-bs-toggle="modal"
            data-bs-target="#about-modal"
          >
            About
          </button>
        </div>
        <div className="nav-bar side-bar-extra">
          <div id="nav-bar-left">
            <a href="./DoublePipe-Worksheet.docx" download>
              <button className="btn btn-primary">
                <div>
                  <i className="fa-solid fa-download"></i>&nbsp;worksheet
                </div>
              </button>
            </a>
          </div>
          <div className="nav-bar-center">
            <button
              type="button"
              id="pumpsBtn"
              className={pumpBtnClass}
              disabled={isPumpBtnDisabled}
              aria-disabled={isPumpBtnDisabled}
              onClick={() => handlePumpsClick()}
            >
              <div>
                <i className={icon}></i>
                &nbsp; {innerHtml}
              </div>
            </button>
            <button
              type="button"
              className={"btn btn-success"}
              disabled={(isPumpBtnDisabled && !pumpsDone) || canvasMode === SINGLE_BEAKER}
              aria-disabled={(isPumpBtnDisabled && !pumpsDone) || canvasMode === SINGLE_BEAKER}
              onClick={() => handleMeasureClick()}
            >
              { measuringState.measuring ? "stop measuring" : "measure temperatures" }
            </button>
          </div>
          <div id="nav-bar-right">
            <button
              id="menu-btn"
              className="btn btn-secondary"
              onClick={() =>
                setShowingSideBar((showingSideBar) => !showingSideBar)
              }
            >
              <div>
                <i className="fa-solid fa-bars" />
                &nbsp;&nbsp;menu
              </div>
            </button>
            {/* <button
              id="beakers-btn"
              className="btn btn-outline-danger"
              data-bs-toggle="modal"
              data-bs-target="#reset-modal"
              // onClick={() => handleResetClick()}
            >
              reset beakers
            </button> */}
          </div>
        </div>
      </SideBar>
      <div className="sim-wrapper">
        <Controls />
        <div
          className="graphics-wrapper"
          style={
            measuringState.measuring && canvasMode === DOUBLE_BEAKER
              ? { cursor: "url('thermometer.png') 25 95, auto" }
              : { cursor: "auto" }
          }
        >
          {canvasMode == DOUBLE_BEAKER ? (
            <ReactP5Wrapper sketch={sketch} onFinish={() => {
              setPumpsRunning(false);
              setPumpBtnDisabled(true);
              setPumpsDone(true);
              togglePumps(false);
              console.log("animation finished");
            }} />
          ) : (
            <ReactP5Wrapper sketch={SingleBeakerSketch} />
          )}
          {canvasMode === DOUBLE_BEAKER ? (
            <>
              <a className="tooltip-anchor" id="hi-anchor" />
              <a className="tooltip-anchor" id="ho-anchor" />
              <a className="tooltip-anchor" id="ci-anchor" />
              <a className="tooltip-anchor" id="co-anchor" />
            </>
          ) : (
            <>
              <a className="tooltip-anchor" id="cold-single-anchor" />
              <a className="tooltip-anchor" id="hot-single-anchor" />
              <a className="tooltip-anchor" id="outlet-tubes-anchor" />
            </>
          )}
        </div>
      </div>

      <DirectionsModalDialogue />
      {DetailsModalDialogue}
      {AboutModalDialogue}
      <ResetModalDialogue resetVars={() => handleResetClick()} />

      <Tooltips
        measure={measuringState.measure}
        canvasMode={canvasMode}
        pumpsAreRunning={pumpsRunning}
      />
    </>
  );
}

export default App;

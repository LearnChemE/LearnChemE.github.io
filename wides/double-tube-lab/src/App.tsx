import { useState } from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { Tooltips } from "./elements/Tooltips.tsx";
import {
  AboutModalDialogue,
  DetailsModalDialogue,
  DirectionsModalDialogue,
  ResetModalDialogue,
} from "./elements/ModalDialogues.tsx";
// import { StartPumpsButton, MeasureTempsButton } from "./Buttons.tsx";
import sketch, {
  togglePumps,
  g,
  p5_instance,
  toggleSinglePumps,
} from "./sketch/Sketch.tsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";
import { randStartVals } from "./sketch/Functions.tsx";
import {
  SingleBeakerSketch,
  randSingleStartVals,
  setAnimationTimeNextFrame,
  setAnimationTimeToNotStarted,
} from "./sketch/SingleBeaker.tsx";
import { SideBar } from "./elements/SideBar.tsx";

const DOUBLE_BEAKER = 0;
const SINGLE_BEAKER = 1;

// Use functional style, not classes. Hooks make the code much better to work with.
function App() {
  const [pumpsRunning, setPumpsRunning] = useState(false);
  const [measured, setMeasured] = useState([-1, -1, -1, -1]);
  const [isPumpBtnDisabled, setPumpBtnDisabled] = useState(false);
  const [canvasMode, setCanvasMode] = useState(DOUBLE_BEAKER);
  const [showingSideBar, setShowingSideBar] = useState(false);

  // start pumps button
  function handlePumpsClick() {
    setPumpsRunning((pumpsRunning) => !pumpsRunning);
    setMeasured([-1, -1, -1, -1]);

    if (canvasMode === DOUBLE_BEAKER) {
      togglePumps(!pumpsRunning);
      if (g.vols[0] >= 998) {
        setPumpBtnDisabled(true);
        // this sets a 3 second timer where the button is disabled
        setTimeout(() => setPumpBtnDisabled(false), 3000);
      }
    } else if (canvasMode === SINGLE_BEAKER) {
      toggleSinglePumps(!pumpsRunning);

      if (setAnimationTimeNextFrame()) {
        setPumpBtnDisabled(true);
        // this sets a 3 second timer where the button is disabled
        setTimeout(() => setPumpBtnDisabled(false), 3000);
      }
    }
  }

  // measure temps button
  function handleMeasureClick() {
    setMeasured([g.Th_in, g.Th_out_observed, g.Tc_in, g.Tc_out_observed]);
    console.log("measured");
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
    setMeasured([-1, -1, -1, -1]);
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
            <a href="./DoublePipe-Worksheet_2025.docx" download>
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
              className="btn btn-success"
              disabled={pumpsRunning}
              aria-disabled={pumpsRunning}
              onClick={() => handleMeasureClick()}
            >
              measure temperatures
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
              className="btn btn-success"
              disabled={pumpsRunning}
              aria-disabled={pumpsRunning}
              onClick={() => handleMeasureClick()}
            >
              measure temperatures
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
            measured[0] != -1
              ? { cursor: "url('thermometer.png') 25 95, auto" }
              : { cursor: "auto" }
          }
        >
          {canvasMode == DOUBLE_BEAKER ? (
            <ReactP5Wrapper sketch={sketch} />
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
        measured={measured}
        canvasMode={canvasMode}
        pumpsAreRunning={pumpsRunning}
      />
    </>
  );
}

export default App;

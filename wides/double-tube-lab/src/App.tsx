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
import sketch, { togglePumps, g, p5_instance } from "./sketch/Sketch.tsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";
import { randStartVals } from "./sketch/Functions.tsx";

// Use functional style, not classes. Hooks make the code much better to work with.
function App() {
  const [pumpsRunning, setPumpsRunning] = useState(false);
  const [measured, setMeasured] = useState([-1, -1, -1, -1]);
  const [isPumpBtnDisabled, setPumpBtnDisabled] = useState(false);

  // start pumps button
  function handlePumpsClick() {
    setPumpsRunning((pumpsRunning) => !pumpsRunning);
    setMeasured([-1, -1, -1, -1]);

    togglePumps(!pumpsRunning);
    if (g.vols[0] >= 998) {
      setPumpBtnDisabled(true);
      // this sets a 3 second timer where the button is disabled
      setTimeout(() => setPumpBtnDisabled(false), 3000);
    }
    console.log(g.vols[0]);
  }

  // measure temps button
  function handleMeasureClick() {
    setMeasured([g.Th_in, g.Th_out_observed, g.Tc_in, g.Tc_out_observed]);
    console.log("measured");
  }

  // reset temps button
  function handleResetClick() {
    g.vols = [1000, 0, 1000, 0];
    g.orngTime = -1;
    g.blueTime = -1;
    randStartVals(p5_instance);
    setPumpsRunning(false);
    setPumpBtnDisabled(false);
    setMeasured([-1, -1, -1, -1]);
    togglePumps(false);
    pumpBtnClass = "btn btn-primary";
    icon = "fa-solid fa-play";
    innerHtml = "start pumps";
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
          <a href="./ME_DoublePipe-Worksheet_2020-2021_Final.pdf" download>
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
            id="beakers-btn"
            className="btn btn-outline-danger"
            data-bs-toggle="modal"
            data-bs-target="#reset-modal"
            // onClick={() => handleResetClick()}
          >
            reset beakers
          </button>
        </div>
      </div>

      <div className="graphics-wrapper">
        <ReactP5Wrapper sketch={sketch} />
        <a className="tooltip-anchor" id="hi-anchor" />
        <a className="tooltip-anchor" id="ho-anchor" />
        <a className="tooltip-anchor" id="ci-anchor" />
        <a className="tooltip-anchor" id="co-anchor" />
      </div>

      <DirectionsModalDialogue />
      {DetailsModalDialogue}
      {AboutModalDialogue}
      <ResetModalDialogue resetVars={() => handleResetClick()} />

      <Tooltips measured={measured} />
    </>
  );
}

export default App;
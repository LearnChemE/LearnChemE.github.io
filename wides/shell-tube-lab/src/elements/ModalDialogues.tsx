import { useState } from "react";

const DIRECTIONS = 0;
const WORKSHEET = 1;

interface ResetVars {
  resetVars: Function;
}

export const DirectionsModalDialogue = () => {
    const [selection, setSelection] = useState(0);

    let innerHtml: JSX.Element;
    switch (selection) {
      case DIRECTIONS:
        innerHtml = (
          <>
            <div className="modal-body-content">
              <h6>Experiment 1-2: Flow Patterns and Heat Transfer Rate</h6>
              <p>
                This digital lab, which represents a double pipe heat exchanger
                with countercurrent flow, is designed to be used with this{" "}
                <a href="./Shell-and-Tube-Worksheet-2025.pdf" download>
                  worksheet
                </a>
                . Drag the valves on each inlet beaker to set flowrates, and
                then use the button at the top to start the pumps. To measure
                temperatures, stop the pumps and press the "measure
                temperatures" button, then hover your mouse over each beaker to
                read the temperature.
              </p>
              <h6>Experiment 3: Effect of Flowrate on Heat Transfer Rate</h6>
              <p>
                Measure the temperatures of the beakers by clicking the "measure
                temperatures" button then hovering over each beaker. Start the
                pumps using the "start pumps" button, then hover your mouse over
                the outlet tubes to measure the hot fluid's outlet temperature.
                Click and hold on the cold inlet tube to pinch it, lowering the
                flowrate of the cold water. Measure the effect of this on the
                hot outlet tube.
              </p>
            </div>
          </>
        );
        break;
      case WORKSHEET:
        innerHtml = (
          <embed
            src="./Shell-and-Tube-Worksheet-2025.pdf"
            width="100%"
            height="800px"
          />
        );
        break;
      default:
        innerHtml = <></>;
    }

    return (
      <div
        className="modal fade"
        id="directions-modal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="directionsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-titles-container">
                <button
                  className="btn btn-sm btn-light"
                  onClick={() => setSelection(DIRECTIONS)}
                >
                  <h5 className="modal-title" id="directionsModalLabel">
                    Directions
                  </h5>
                  {selection === DIRECTIONS && <div className="hl" />}
                </button>
                <div className="vl" />
                <button
                  className="btn btn-sm btn-light"
                  onClick={() => setSelection(WORKSHEET)}
                >
                  <h5 className="modal-title" id="worksheetModalLabel">
                    Worksheet
                  </h5>
                  {selection === WORKSHEET && <div className="hl" />}
                </button>
              </div>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">{innerHtml}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
  DetailsModalDialogue = (
    <div
      className="modal fade"
      id="details-modal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="detailsModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-l" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="detailsModalLabel">
              Details
            </h5>
            <button
              type="button"
              className="close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>
              This simulation uses the NTU-effectiveness approach to calculate
              the outlet temperatures of each fluid line. Values were chosen to
              be realistic and similar to the values used in the actual
              experiment, and are randomized on each startup. Additionally, the
              temperature measured in the outlet beakers are designed to show
              the average temperature of the outlet fluid and the heat capacity
              of the beaker initially at 25°C. Thus, for accurate results, it is
              recommended to let the heat exchanger flow for a long period of
              time, without changing any valves during the run.
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  ),
  AboutModalDialogue = (
    <div
      className="modal fade"
      id="about-modal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="aboutModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-l" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="aboutModalLabel">
              About
            </h5>
            <button
              type="button"
              className="close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>
              This virtual lab was created in the{" "}
              <a href="https://www.colorado.edu/chbe" target="_blank">
                Department of Chemical and Biological Engineering
              </a>
              , at University of Colorado Boulder for{" "}
              <a href="http://www.learncheme.com" target="_blank">
                LearnChemE.com
              </a>{" "}
              by Drew Smith under the direction of Professor John L. Falconer
              and Michelle Medlin. This virtual lab was prepared with financial
              support from the National Science Foundation (DUE 2336987 and
              2336988) and is based on the &nbsp;
              <a href="https://labs.wsu.edu/educ-ate/heat-transfer-kit/">
                Shell and Tube Heat Exchanger
                experimental kit
              </a>&nbsp;
              and accompanying worksheet protocol developed
              with separate support under NSF 1821578 led by Washington State
              University. Address any questions or comments to
              learncheme@gmail.com. Our simulations are open source, and are
              available on our{" "}
              <a
                href="https://github.com/LearnChemE/LearnChemE.github.io/"
                target="_blank"
              >
                LearnChemE Github repository
              </a>
              . If this simulation is too big or too small for your screen, zoom
              out or in using command - or command + on Mac or ctrl - or ctrl +
              on Windows.
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  ),
  ResetModalDialogue: React.FC<ResetVars> = ({ resetVars }) => {
    return (
      <div
        className="modal fade"
        id="reset-modal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="resetModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="resetModalLabel">
                Reset Beakers
              </h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              Reset beakers and pumps to gather new measurements? This will
              allow you to collect new measurements, but note that temperatures
              may not be the same with new water.
            </div>
            <div className="modal-footer" id="reset-modal-footer">
              <button
                type="button"
                id="reset-new-btn"
                className="btn btn-primary btn-sm"
                data-bs-dismiss="modal"
                onClick={() => resetVars()}
              >
                Reset with new temperatures
              </button>
              {/* <button
              type="button"
              id="reset-keep-btn"
              className="btn btn-success btn-sm"
              data-bs-dismiss="modal"
            >
              Reset but keep temperatures
            </button> */}
              <button
                type="button"
                id="close-btn"
                className="btn btn-secondary btn-sm"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

import { useState } from "react";

interface controlProps {
  pumpsAreRunning: boolean;
  pumpBtnIsDisabled: boolean;
  pumpBtnHandler: () => void;
  measureBtnHandler: () => void;
  menuBtnHandler: () => void;
}

const Controls: React.FC<controlProps> = ({
  pumpsAreRunning,
  pumpBtnIsDisabled,
  pumpBtnHandler,
  measureBtnHandler,
  menuBtnHandler,
}) => {
  let pumpBtnClass: string, icon: string, innerHtml: string;
  if (pumpsAreRunning) {
    pumpBtnClass = "btn btn-danger";
    icon = "fa-solid fa-pause";
    innerHtml = "stop pumps";
  } else {
    pumpBtnClass = "btn btn-success";
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
            disabled={pumpBtnIsDisabled}
            aria-disabled={pumpBtnIsDisabled}
            onClick={() => pumpBtnHandler()}
          >
            <div>
              <i className={icon}></i>
              &nbsp; {innerHtml}
            </div>
          </button>
          <button
            type="button"
            className="btn btn-success"
            disabled={pumpsAreRunning}
            aria-disabled={pumpsAreRunning}
            onClick={() => measureBtnHandler()}
          >
            measure temperatures
          </button>
        </div>
        <div id="nav-bar-right">
          <button
            id="menu-btn"
            className="btn btn-secondary"
            onClick={() => menuBtnHandler()}
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

export default Controls;

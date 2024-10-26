import { useState } from "react";

interface ControlProps {}

export const Controls: React.FC<ControlProps> = ({}) => {
  return (
    <>
      <div className="nav-bar">
        <div id="nav-bar-left">
          <a href="./Shell-and-Tube-Worksheet-2022.pdf" download>
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
            // className={}
            // disabled={}
            // aria-disabled={}
            // onClick={}
          >
            <div>
              {/* <i className={icon}></i>
              &nbsp; {innerHtml} */}
            </div>
          </button>
          <button
            type="button"
            className="btn btn-success"
            // disabled={pumpsAreRunning}
            // aria-disabled={pumpsAreRunning}
            // onClick={() => measureBtnHandler()}
          >
            measure temperatures
          </button>
        </div>
        <div id="nav-bar-right">
          <button
            id="menu-btn"
            className="btn btn-secondary"
            // onClick={() => menuBtnHandler()}
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

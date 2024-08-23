import React from "react";
import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useState, useEffect } from "react";
import Controls from "./elements/Controls";
import SideBar from "./elements/SideBar";

function App() {
  const [pumpsRunning, setPumpsRunning] = useState(false);
  const [measured, setMeasured] = useState([-1, -1, -1, -1]);
  const [pumpBtnIsDisabled, setPumpBtnDisabled] = useState(false);
  // const [canvasMode, setCanvasMode] = useState(DOUBLE_BEAKER);
  const [sideBarIsShowing, setSideBarShowing] = useState(false);

  const pumpBtnHandler = () => {};
  const measureBtnHandler = () => {};
  const resetBtnHandler = () => {};

  const ControlWrapper = () => {
    return (
      <Controls
        pumpsAreRunning={pumpsRunning}
        pumpBtnIsDisabled={pumpBtnIsDisabled}
        pumpBtnHandler={() => pumpBtnHandler()}
        measureBtnHandler={() => measureBtnHandler()}
        menuBtnHandler={() =>
          setSideBarShowing((sideBarIsShowing) => !sideBarIsShowing)
        }
      />
    );
  };

  return (
    <>
      <ControlWrapper />
      <SideBar
        showing={sideBarIsShowing}
        onCloseBtnClick={() => setSideBarShowing(false)}
        selected={0}
        toggleSelected={() => {}}
        onResetBtnClick={() => resetBtnHandler()}
      >
        <ControlWrapper />
      </SideBar>
    </>
  );
}

export default App;

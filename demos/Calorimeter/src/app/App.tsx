import React from "react";
import { useState } from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import "p5";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { ModalButtons, Controls } from "../components";
import { CalorimeterSketch } from "../canvas";
import { SimProps } from "../types/globals";

function App() {
  const [simState, setSimState] = useState<SimProps>({
    waterTemp: 4,
    mat: "Fe",
    mass: 200,
    started: false
  });

  return (
    <div className="App">
      <ModalButtons />
      <div className="sim-container">
        <Controls simState={simState} 
                  setSimState={setSimState} 
                  buttonCallback={() => {
                    setSimState({ ...simState, started: !simState.started });
                  }} />
        <div className="graphics-wrapper">
          <ReactP5Wrapper sketch={CalorimeterSketch} 
                          waterTemp={simState.waterTemp} 
                          mat={simState.mat} 
                          mass={simState.mass}
                          started={simState.started} />
        </div>
      </div>
    </div>
  );
}

export default App;

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
    blockTemp: 30,
    mat: "Fe",
    mass: 200,
    stirring: false,
    started: false,
    paused: true,
  });
  let resetSim = false;

  const handleReset = () => {
    setSimState({
      waterTemp: 4,
      blockTemp: 30,
      mat: "Fe",
      mass: 200,
      stirring: false,
      started: false,
      paused: true,
    });
    resetSim = true;
    console.log(resetSim);
  };

  return (
    <div className="App">
      <ModalButtons />
      <div className="sim-container">
        <Controls
          simState={simState}
          setSimState={setSimState}
          resetCallback={handleReset}
        />
        <div className="graphics-wrapper">
          <ReactP5Wrapper
            sketch={CalorimeterSketch}
            waterTemp={simState.waterTemp}
            blockTemp={simState.blockTemp}
            mat={simState.mat}
            mass={simState.mass}
            stirring={simState.stirring}
            started={simState.started}
            paused={simState.paused}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

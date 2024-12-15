import React, { useCallback } from "react";
import { useState } from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import "p5";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Controls } from "../components";
import { CalorimeterSketch } from "../canvas";
import { SimProps } from "../types/globals";
import { ModalDialogues } from "../components";
import { TooltipLabel } from "../components";

function App() {
  const [simState, setSimState] = useState<SimProps>({
    waterTemp: 4,
    blockTemp: 30,
    mat: "Pt (Sample)",
    mass: 400,
    stirring: false,
    started: false,
    paused: false,
  });
  const [temperature, setTemperature] = useState<number>(4);

  const handleReset = () => {
    setSimState({
      waterTemp: 4,
      blockTemp: 30,
      mat: "Pt (Sample)",
      mass: 400,
      stirring: false,
      started: false,
      paused: false,
    });
  };

  const handleTemp = useCallback((val: number) => {
    setTemperature((temperature) => val);
  }, []);

  return (
    <div className="App">
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
            returnTemperature={handleTemp}
          />
          <TooltipLabel
            name="temp-label"
            content={`water temperature: ${temperature.toFixed(1)} °C`}
          />
        </div>
      </div>
      <ModalDialogues />
    </div>
  );
}

export default App;

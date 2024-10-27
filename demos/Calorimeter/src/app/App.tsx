import React from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import "p5";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { ModalButtons, Controls } from "../components";
import { CalorimeterSketch } from "../canvas";

function App() {
  return (
    <div className="App">
      <ModalButtons />
      <div className="sim-container">
        <Controls />
        <div className="graphics-wrapper">
          <ReactP5Wrapper sketch={CalorimeterSketch} />
        </div>
      </div>
    </div>
  );
}

export default App;

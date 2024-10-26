import React from "react";
import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { ModalButtons, Controls } from "../components";

function App() {
  return (
    <div className="App">
      <ModalButtons />
      <div className="sim-container">
        <Controls />
      </div>
    </div>
  );
}

export default App;

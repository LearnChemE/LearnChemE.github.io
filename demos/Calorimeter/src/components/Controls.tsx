import React, { useEffect, useState } from "react";
import { InputRange } from "./InputRange";
import { InputList } from "./InputList";
import { MaterialArray, SimProps } from "../types/globals";

interface ControlProps {
  simState: SimProps;
  setSimState: React.Dispatch<React.SetStateAction<SimProps>>;
  resetCallback: () => void;
}

export const Controls: React.FC<ControlProps> = ({
  simState,
  setSimState,
  resetCallback,
}) => {
  let mat = simState.mat;

  return (
    <>
      <div className="controls-container">
        {/* Water Temp Slider */}
        <InputRange
          label="starting water temperature (°C):"
          id="temp-range"
          min={0}
          max={25}
          step={1}
          val={simState.waterTemp}
          setVal={(newVal) => setSimState({ ...simState, waterTemp: newVal })}
        />
        {/* Block Temp Slider */}
        <InputRange
          label="starting block temperature (°C):"
          id="temp-range"
          min={25}
          max={60}
          step={1}
          val={simState.blockTemp}
          setVal={(newVal) => setSimState({ ...simState, blockTemp: newVal })}
        />
        {/* Block Mass Slider */}
        <InputRange
          label="mass of block (g):"
          id="mass-range"
          min={100}
          max={1000}
          step={10}
          val={simState.mass}
          setVal={(newVal) => {
            setSimState({ ...simState, mass: newVal });
          }}
        />
        <div id="mat-stir-container">
          {/* Select Material Dropdown */}
          <InputList
            label="substance:"
            id="substances"
            val={MaterialArray.indexOf(mat)}
            setVal={(newMat) => setSimState({ ...simState, mat: newMat })}
            listItems={MaterialArray}
          />
          {/* Stirrer button */}
          <button
            type="button"
            id="stir-btn"
            className={
              simState.stirring
                ? "btn btn-sm btn-danger"
                : "btn btn-sm btn-primary"
            }
            onClick={() =>
              setSimState({ ...simState, stirring: !simState.stirring })
            }
          >
            <i
              className={
                simState.stirring ? "fa-solid fa-pause" : "fa-solid fa-play"
              }
            />{" "}
            &nbsp;
            {simState.stirring ? "stop" : "start"} stirrer
          </button>
        </div>
        {/* Start Button */}
        <button
          type="button"
          id="drop-btn"
          className="btn btn-success"
          onClick={() =>
            setSimState({ ...simState, started: !simState.started })
          }
        >
          drop metal
        </button>
        {/* Reset Button */}
        <button
          type="button"
          id="reset-btn"
          className="btn btn-danger"
          onClick={resetCallback}
        >
          reset
        </button>
      </div>
    </>
  );
};

export default Controls;

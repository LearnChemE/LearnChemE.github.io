import React from "react";
import { InputRange } from "./InputRange";
import { InputList } from "./InputList";
import { MaterialArray, SimProps } from "../types/globals";
import { ModalButtons } from "./modals/ModalButtons";

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

  // Originally coded for pause functionality.
  // If we ever want that back uncomment and give these props to drop button
  // let dropBtnText: string;
  // let dropBtnClass: string;
  // if (simState.started) {
  //   if (simState.paused) {
  //     dropBtnText = "play";
  //     dropBtnClass = "btn btn-outline-primary";
  //   } else {
  //     dropBtnText = "pause";
  //     dropBtnClass = "btn btn-outline-danger";
  //   }
  // } else {
  //   dropBtnText = "drop metal";
  //   dropBtnClass = "btn btn-success";
  // }

  return (
    <>
      <div className="controls-container">
        <ModalButtons />
        {/* Water Temp Slider */}
        <InputRange
          label="starting water temperature (°C):"
          id="temp-range"
          min={0}
          max={25}
          step={1}
          val={simState.waterTemp}
          setVal={(newVal) => setSimState({ ...simState, waterTemp: newVal })}
          disabled={simState.started}
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
          disabled={simState.started}
        />
        {/* Block Mass Slider */}
        <InputRange
          label="mass of block (g):"
          id="mass-range"
          min={100}
          max={500}
          step={10}
          val={simState.mass}
          setVal={(newVal) => {
            setSimState({ ...simState, mass: newVal });
          }}
          disabled={simState.started}
        />
        <div id="mat-stir-container">
          {/* Select Material Dropdown */}
          <InputList
            label="metal:"
            id="substances"
            val={MaterialArray.indexOf(simState.mat)}
            setVal={(newMat) => setSimState({ ...simState, mat: newMat })}
            listItems={MaterialArray}
            disabled={simState.started}
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
            disabled={simState.started}
            aria-disabled={simState.started}
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
        {/* Pt Label */}
        <div style={{ height: "27px" }}>
          {simState.mat === "Pt (Sample)" &&
            "Specific Heat Capacity: 0.133 J/(g K)"}
        </div>
        <div className="btn-container" id="play-sim-btns">
          {/* Drop Button */}
          <button
            type="button"
            id="drop-btn"
            className={
              simState.started ? "btn btn-success disabled" : "btn btn-success"
            }
            aria-disabled={simState.started}
            onClick={() => {
              if (!simState.started)
                setSimState({ ...simState, started: true, paused: false });
              else
                setSimState({
                  ...simState,
                  started: true,
                  paused: !simState.paused,
                });
            }}
          >
            {"drop metal"}
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
      </div>
    </>
  );
};

export default Controls;

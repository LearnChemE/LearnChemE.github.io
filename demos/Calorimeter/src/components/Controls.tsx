import React, { useEffect, useState } from "react";
import { InputRange } from "./InputRange";
import { InputList } from "./InputList";
import { MaterialArray, SimProps } from "../types/globals";

interface ControlProps {
  simState: SimProps;
  setSimState: React.Dispatch<React.SetStateAction<SimProps>>;
  buttonCallback: () => void;
}

export const Controls: React.FC<ControlProps> = ({
  simState,
  setSimState,
  buttonCallback
}) => {
  
  let mat = simState.mat;

  return (
    <>
      <div className="controls-container">
        <InputRange label="Starting Water Temperature (°C):" id="temp-range" min={0} max={25} step={1} val={simState.waterTemp} setVal={(newVal) => setSimState({ ...simState, waterTemp: newVal })} />
        <InputRange label="mass of block (g):" id="mass-range" min={100} max={1000} step={10} val={simState.mass} setVal={(newVal) => {setSimState({ ...simState, mass: newVal })}} />
        <InputList label="substance:" id="substances" val={MaterialArray.indexOf(mat)} setVal={(newMat) => setSimState({ ...simState, mat: newMat })} listItems={MaterialArray} />
        <button onClick={buttonCallback}>drop metal</button>
      </div>
    </>
  );
};

export default Controls;

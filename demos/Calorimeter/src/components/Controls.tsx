import React, { useEffect, useState } from "react";
import { InputRange } from "./InputRange";
import { InputList } from "./InputList";
import { MaterialArray, SimProps } from "../types/globals";

interface ControlProps {
  simState: SimProps;
  setSimState: React.Dispatch<React.SetStateAction<SimProps>>;
}

export const Controls: React.FC<ControlProps> = ({
  simState,
  setSimState,
}) => {
  const [mat, setMat] = useState("Fe");
  

  return (
    <>
      <div className="controls-container">
        <InputRange label="Starting Water Temperature (°C):" id="test-range" min={0} max={25} step={1} val={simState.waterTemp} setVal={(newVal) => setSimState({ ...simState, waterTemp: newVal })} />
        <InputList label="substance:" id="substances" val={MaterialArray.indexOf(mat)} setVal={setMat} listItems={MaterialArray} />
      </div>
    </>
  );
};

export default Controls;

import React, { useState } from "react";
import { InputRange } from "./InputRange";

interface ControlProps {
  waterTemp: number;
  setWaterTemp: React.Dispatch<React.SetStateAction<number>>;
}

export const Controls: React.FC<ControlProps> = ({
  waterTemp,
  setWaterTemp,
}) => {

  

  return (
    <>
      <div className="controls-container">
        <InputRange label="Labelled range:" id="test-range" min={0} max={25} step={1} val={waterTemp} setVal={setWaterTemp} />
      </div>
    </>
  );
};

export default Controls;

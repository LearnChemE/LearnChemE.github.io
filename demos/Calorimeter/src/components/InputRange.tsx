import { useState } from "react";

interface InputRangeProps {
    label: string;
    id: string;
    min: number;
    max: number;
    step: number;
    val: number;
    setVal: React.Dispatch<React.SetStateAction<number>>;
};

export const InputRange: React.FC<InputRangeProps> = ({
    label,
    id,
    min,
    max,
    step,
    val,
    setVal,
}) => {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVal(Number(event.target.value));
      };

    return (
    <>
        <div className="slider-container" >
            <div className="slider-label">{label}</div>
            <input type="range" aria-labelledby="#slider-label" id={id} min={min} max={max} value={val} step={step} onChange={handleInputChange} />
            <div className="slider-val-label">{val}</div>
        </div>
    </>
    );
};

export {};
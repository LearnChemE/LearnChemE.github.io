interface InputRangeProps {
  label: string;
  id: string;
  min: number;
  max: number;
  step: number;
  val: number;
  setVal: (newVal: number) => void;
  disabled?: boolean;
  fixed?: number;
}

export const InputRange: React.FC<InputRangeProps> = ({
  label,
  id,
  min,
  max,
  step,
  val,
  setVal,
  disabled = false,
  fixed = 0
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVal(Number(event.target.value));
  };

  return (
    <>
      <div className="slider-container">
        <div className="slider-label">{label}</div>
        <input
          className={disabled ? "disabled" : "slider"}
          type="range"
          aria-labelledby="#slider-label"
          id={id}
          min={min}
          max={max}
          value={val}
          step={step}
          onChange={handleInputChange}
          disabled={disabled}
          aria-disabled={disabled}
        />
        <div className="slider-val-label">{val.toFixed(fixed)}</div>
      </div>
    </>
  );
};

export {};

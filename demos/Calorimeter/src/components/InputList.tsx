import React from "react";

interface InputListProps {
  label: string;
  id: string;
  val: number;
  setVal: (newVal: string) => void;
  listItems: string[];
  disabled?: boolean;
}

export const InputList: React.FC<InputListProps> = ({
  label,
  id,
  val,
  setVal,
  listItems,
  disabled = false,
}) => {
  const onChange = (event: any) => {
    let newVal = listItems[Number(event.target.value)];
    setVal(newVal);
  };

  return (
    <>
      <div className="labelled-list-container" id="mat-list">
        <div>{label}</div>
        <select
          className={disabled ? "dropdown disabled" : "dropdown"}
          name={id}
          id={id}
          onChange={onChange}
          disabled={disabled}
          value={val}
        >
          {listItems.map((item, index) => (
            <option key={index} value={index}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

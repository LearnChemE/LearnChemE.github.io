import React from "react";

interface InputListProps {
  label: string;
  id: string;
  val: number;
  setVal: (newVal: string) => void;
  listItems: string[];
}

export const InputList: React.FC<InputListProps> = ({
  label,
  id,
  val,
  setVal,
  listItems,
}) => {
  const onChange = (event: any) => {
    let newVal = listItems[Number(event.target.value)];
    setVal(newVal);
  };

  return (
    <>
      <div>{label}</div>
      <select name={id} id={id} onChange={onChange}>
        {listItems.map((item, index) => (
          <option key={index} value={index}>
            {item}
          </option>
        ))}
      </select>
    </>
  );
};

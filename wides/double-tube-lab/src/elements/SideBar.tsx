import { useState } from "react";

interface SideBarProps {
  showing: boolean;
  onClose: () => void;
  selected: number;
  toggleSelected: (input: number) => void;
  onResetClick: () => void;
  children: React.ReactNode;
}

export const SideBar: React.FC<SideBarProps> = ({
  showing,
  onClose,
  selected = 0,
  toggleSelected,
  onResetClick,
  children,
}) => {
  const [dropDownShowing, setDropDownShowing] = useState(false);

  return (
    <>
      <div className="sidebar-background"></div>
      <div className="sidebar" style={{ width: showing ? "250px" : "0px" }}>
        <button className="btn-close" onClick={() => onClose()} />

        <div
          className={selected === 0 ? "sidebar-item vl" : "sidebar-item"}
          onClick={() => toggleSelected(0)}
        >
          {selected === 0
            ? `Experiment 1: Confirming Flow Patterns and Measuring Heat Transfer
          Rate`
            : `Experiment 1`}
        </div>
        <div
          className={selected === 1 ? "sidebar-item vl" : "sidebar-item"}
          onClick={() => toggleSelected(1)}
        >
          {selected === 1
            ? `Experiment 2: Effect of Flowrate on Heat Transfer Rate`
            : `Experiment 2`}
        </div>
        <div className={dropDownShowing ? "sidebar-item vl" : "sidebar-item"}>
          <div
            onClick={() =>
              setDropDownShowing((dropDownShowing) => !dropDownShowing)
            }
          >
            <i
              className={
                dropDownShowing
                  ? "fa-solid fa-angle-down"
                  : "fa-solid fa-angle-right"
              }
            />
            &nbsp; Controls
          </div>
          {dropDownShowing && children}
        </div>
        <div style={{ display: "grid", margin: "auto" }}>
          <button className="btn btn-danger" onClick={() => onResetClick()}>
            Reset beakers
          </button>
        </div>
      </div>
    </>
  );
};

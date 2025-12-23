import { useState } from "react";

const DOUBLE_BEAKER_MODE = 0;
const SINGLE_BEAKER_MODE = 1;

interface SideBarProps {
  showing: boolean;
  onCloseBtnClick: () => void;
  selected: number;
  toggleSelected: (input: number) => void;
  onResetBtnClick: () => void;
  children: React.ReactNode;
}

const SideBar: React.FC<SideBarProps> = ({
  showing,
  onCloseBtnClick,
  selected = DOUBLE_BEAKER_MODE,
  toggleSelected,
  onResetBtnClick,
  children,
}) => {
  const [dropDownShowing, setDropDownShowing] = useState(false);

  return (
    <>
      <div className="sidebar-background"></div>
      <div className="sidebar" style={{ width: showing ? "300px" : "0px" }}>
        <button className="btn-close" onClick={() => onCloseBtnClick()} />

        <div
          className={
            selected === DOUBLE_BEAKER_MODE ? "sidebar-item vl" : "sidebar-item"
          }
          onClick={() => toggleSelected(0)}
        >
          {selected === 0
            ? <span><b>Experiment 1-2:</b> Flow Patterns and Heat Transfer
          Rate</span>
            : <b>Experiment 1-2</b>}
        </div>
        <div
          className={
            selected === SINGLE_BEAKER_MODE ? "sidebar-item vl" : "sidebar-item"
          }
          onClick={() => toggleSelected(1)}
        >
          {selected === 1
            ? <span><b>Experiment 3:</b> Effect of Flowrate on Heat Transfer Rate</span>
            : <b>Experiment 3</b>}
        </div>
        <div className={dropDownShowing ? "sidebar-item vl smallscr-only" : "sidebar-item smallscr-only"}>
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
          <button className="btn btn-danger" onClick={() => onResetBtnClick()}>
            <i className="fa-solid fa-arrows-rotate"></i>
            &nbsp; reset
          </button>
        </div>
      </div>
    </>
  );
};

export default SideBar;

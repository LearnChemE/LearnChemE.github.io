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
      <div className="sidebar" style={{ width: showing ? "250px" : "0px" }}>
        <button className="btn-close" onClick={() => onCloseBtnClick()} />

        <div
          className={
            selected === DOUBLE_BEAKER_MODE ? "sidebar-item vl" : "sidebar-item"
          }
          onClick={() => toggleSelected(0)}
        >
          Double-beaker setup
        </div>
        <div
          className={
            selected === SINGLE_BEAKER_MODE ? "sidebar-item vl" : "sidebar-item"
          }
          onClick={() => toggleSelected(1)}
        >
          Single-beaker setup
        </div>
        <div
          className={dropDownShowing ? "sidebar-item vl" : "sidebar-item"}
          onClick={() => toggleSelected(1)}
        >
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
            Reset beakers
          </button>
        </div>
      </div>
    </>
  );
};

export default SideBar;

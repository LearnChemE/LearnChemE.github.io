interface SideBarProps {
  showing: boolean;
  onClose: () => void;
  selected: number;
  toggleSelected: (input: number) => void;
  onResetClick: () => void;
}

export const SideBar: React.FC<SideBarProps> = ({
  showing,
  onClose,
  selected = 0,
  toggleSelected,
  onResetClick,
}) => {
  return (
    <>
      <div className="sidebar-background"></div>
      <div className="sidebar" style={{ width: showing ? "250px" : "0px" }}>
        <button className="btn-close" onClick={() => onClose()} />

        <div
          className={selected === 0 ? "sidebar-item vl" : "sidebar-item"}
          onClick={() => toggleSelected(0)}
        >
          Double-beaker setup
        </div>
        <div
          className={selected === 1 ? "sidebar-item vl" : "sidebar-item"}
          onClick={() => toggleSelected(1)}
        >
          Single-beaker setup
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

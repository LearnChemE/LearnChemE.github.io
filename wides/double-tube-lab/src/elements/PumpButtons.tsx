export const StartPumpsButton = (pumpsAreRunning: boolean) => {
  let pumpBtnClass, icon, innerHtml;
  if (pumpsAreRunning) {
    pumpBtnClass = "btn btn-danger";
    icon = "fa-solid fa-play";
    innerHtml = "stop pumps";
  } else {
    pumpBtnClass = "btn btn-success";
    icon = "fa-solid fa-pause";
    innerHtml = "start pumps";
  }

  return (
    <>
      <button type="button" id="start-pumps-btn" className={pumpBtnClass}>
        <i className={icon}></i>
        <div>{innerHtml}</div>
      </button>
    </>
  );
};

import { Tooltip } from "react-tooltip";

interface MeasuredVals {
  measured: Array<number>;
  canvasMode: number;
}

export const Tooltips: React.FC<MeasuredVals> = ({ measured, canvasMode }) => {
  let measuredStrings: Array<string> = new Array(4);
  if (measured[0] === -1) {
    measuredStrings = ["--", "--", "--", "--"];
  } else {
    for (let i = 0; i < 4; i++) {
      measuredStrings[i] = measured[i].toFixed(1);
    }
  }

  if (canvasMode == 0)
    return (
      <>
        <Tooltip anchorSelect="#hi-anchor" place="bottom">
          Temperature: {measuredStrings[0]} °C
        </Tooltip>
        <Tooltip anchorSelect="#ho-anchor" place="bottom">
          Temperature: {measuredStrings[1]} °C
        </Tooltip>
        <Tooltip anchorSelect="#ci-anchor" place="bottom">
          Temperature: {measuredStrings[2]} °C
        </Tooltip>
        <Tooltip anchorSelect="#co-anchor" place="bottom">
          Temperature: {measuredStrings[3]} °C
        </Tooltip>
      </>
    );
  else
    return (
      <>
        <Tooltip anchorSelect="#hot-single-anchor" place="bottom">
          Temperature: {measuredStrings[0]} °C
        </Tooltip>
        <Tooltip anchorSelect="#cold-single-anchor" place="bottom">
          Temperature: {measuredStrings[1]} °C
        </Tooltip>
      </>
    );
};

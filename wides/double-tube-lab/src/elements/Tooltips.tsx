import { Tooltip } from "react-tooltip";
import { g } from "../sketch/Sketch.tsx";
import { useEffect, useState } from "react";
import { lerp } from "../sketch/Functions.tsx";

interface MeasuredVals {
  measure: () => number[];
  canvasMode: number;
  pumpsAreRunning: boolean;
}

export const Tooltips: React.FC<MeasuredVals> = ({
  measure,
  canvasMode,
  pumpsAreRunning,
}) => {
  let measuredStrings: Array<string> = new Array(4);
  const [tHOut, setTHOut] = useState(25);

  useEffect(() => {
    const interval = setInterval(() => {
      setTHOut(lerp(tHOut, g.Th_out, 0.2));
    }, 100);
    return () => clearInterval(interval);
  });

  if (measure()[0] === -1) {
    measuredStrings = ["--", "--", "--", "--"];
  } else {
    for (let i = 0; i < 4; i++) {
      measuredStrings[i] = measure()[i].toFixed(1);
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
          Temperature: {measuredStrings[2]} °C
        </Tooltip>
        {/* <Tooltip anchorSelect="#outlet-tubes-anchor" place="left">
          Temperature: {g.Tc_out.toFixed(1)} °C
        </Tooltip> */}
        {pumpsAreRunning && (
          <Tooltip anchorSelect="#outlet-tubes-anchor" place="right">
            Temperature: {tHOut.toFixed(1)} °C
          </Tooltip>
        )}
      </>
    );
};

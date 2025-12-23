import { Tooltip } from "react-tooltip";
import { g } from "../sketch/sketch";
import { useEffect, useState } from "react";
import { lerp } from "../sketch/functions";

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
    // Double beakers
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
  // Single beakers
  else
    return (
      <>
        <Tooltip anchorSelect="#hi-anchor" place="bottom">
          Temperature: {measuredStrings[0]} °C
        </Tooltip>
        <Tooltip anchorSelect="#co-anchor" place="bottom">
          Temperature: {measuredStrings[2]} °C
        </Tooltip>
        {/* <Tooltip anchorSelect="#outlet-tubes-anchor" place="left">
          Temperature: {g.Tc_out.toFixed(1)} °C
        </Tooltip> */}
        {pumpsAreRunning && (
          <Tooltip
            anchorSelect="#outlet-tubes-anchor"
            place="bottom-start"
            classNameArrow="hide-arrow"
          >
            Temperature: {tHOut.toFixed(1)} °C
          </Tooltip>
        )}
      </>
    );
};

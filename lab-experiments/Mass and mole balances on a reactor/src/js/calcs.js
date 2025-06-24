





import { meterHeight } from "./bubblemeter.js";



let bubbleStartTime = null;
let bubbleEndTime = null;

export function startBubbleTimer() {
  bubbleStartTime = millis();
}

export function endBubbleTimer(currentY) {
  bubbleEndTime = millis();

  const duration = (bubbleEndTime - bubbleStartTime) / 1000; // seconds
  const volume = map(currentY, meterHeight, 0, 0, 10); // height → mL
  const flowRate = volume / duration;

  return {
    volume: volume.toFixed(2),
    duration: duration.toFixed(2),
    flowRate: flowRate.toFixed(2)
  };
}














export function setDefaults() {
  state = {
    ...state,
  }
}

export function calcAll() {

}
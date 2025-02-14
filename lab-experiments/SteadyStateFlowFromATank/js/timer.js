// timer.js
import { elapsedTime, timerInterval, setTimeInterval, setElapsedTime, waterHeight, setWaterHeight, diameter } from './state.js';
import { fillTank } from './fillTank.js';
import { stopDropletAnimation } from './droplets.js';
import { ratio, liquidHeightDropdown } from './constants.js';
export function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    const milliseconds = String(ms % 1000).padStart(3, '0');
    return `${minutes}:${seconds}.${milliseconds}`;
}

export function startTimer() {
    const startTime = Date.now() - elapsedTime;
    setTimeInterval( setInterval(() => {
        setElapsedTime(Date.now() - startTime);
        calculateHeightWithTime();
    }, 1));
}

export function stopTimer() {
    clearInterval(timerInterval);
}

export function calculateHeightWithTime() {
    const g = 981;
    const time = elapsedTime / 1000;
    const numerator = Math.sqrt(g / 2) * time;  
    const denominator = Math.sqrt(Math.pow(20 * ratio/diameter, 4) + 209);
    const sqrtHeight = Math.sqrt(parseFloat(liquidHeightDropdown.value)) - (numerator / denominator)
    let heightCalculation = Math.pow(sqrtHeight, 2);
    setWaterHeight(heightCalculation * ratio);  
    if (sqrtHeight <= 0) {
        setWaterHeight(0);
        stopTimer();
        stopDropletAnimation();
    }   
    fillTank();
}
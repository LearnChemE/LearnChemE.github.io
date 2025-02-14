// drawValve.js
import { draw, valveCenterX, borderHexCode, drainDiameterDropdown, liquidHeightDropdown } from './constants.js';
import { setValveGroup, valveCenterY, setIsRotated, isRotated} from './state.js';
import { stopDropletAnimation, createDroplets, startDropletAnimation} from './droplets.js';
import { stopTimer, calculateHeightWithTime, startTimer} from './timer.js';

export function drawValve() {
    let valveGroup = draw.group();
    setValveGroup(valveGroup);
    valveGroup.circle(30)
    .fill('#b4b4ff')
    .stroke({ color: borderHexCode, width: 2 })
    .center(valveCenterX, valveCenterY)
    .front();
    const valve = valveGroup.rect(10, 34)
    .fill('#c8c8ff')
    .stroke({ color: '#b4b4ff', width: 2 })
    .center(valveCenterX, valveCenterY)
    .front();
    
    valveGroup.click(() => {
        setIsRotated(!isRotated);
        drainDiameterDropdown.disabled = true;
        liquidHeightDropdown.disabled = true;
        if (!isRotated) {
            valve.animate(300).rotate(-90, valveCenterX, valveCenterY);
            stopTimer();
            stopDropletAnimation();
            calculateHeightWithTime();
        } else {
            valve.animate(300).rotate(90, valveCenterX, valveCenterY);
            createDroplets();
            startTimer();
            startDropletAnimation();
        }
    });
}
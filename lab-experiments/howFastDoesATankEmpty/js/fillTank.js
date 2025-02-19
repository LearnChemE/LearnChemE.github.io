// fillTank.js
import { draw, valveCenterX, tableY, legWidth, surfaceWidth, containerWidth } from './constants.js';
import { setFillTankPathData, setFillTankPath, fillTankPath, diameter, isRotated, valveGroup, waterHeight } from './state.js';

export function fillTank() {
  const startX = valveCenterX;
  const startY = tableY - legWidth - surfaceWidth;
  let fillTankPathData = null;
  if (!isRotated) {
    if (waterHeight > diameter) {
      fillTankPathData = `
        M ${startX},${startY}
        h -${containerWidth + 50}
        v -${waterHeight}
        h ${containerWidth}
        v ${waterHeight - diameter}
        h 50
        v ${diameter}
      `;
    } else {
      fillTankPathData = `
        M ${startX},${startY}
        h -${containerWidth + 50}
        v -${waterHeight}
        h ${containerWidth + 50}
        v -${waterHeight}
      `;
    }
  } else {
    if (waterHeight > diameter) {
      fillTankPathData = `
        M ${startX + 50},${startY}
        h -${containerWidth + 100}
        v -${waterHeight}
        h ${containerWidth}
        v ${waterHeight - diameter}
        h 100
        v ${diameter}
      `;
    } else {
      fillTankPathData = `
        M ${startX + 50},${startY}
        h -${containerWidth + 100}
        v -${waterHeight}
        h ${containerWidth + 100}
        v -${waterHeight}
      `;
    }
  }
  
  if (fillTankPath) {
    fillTankPath.remove();
  }

  setFillTankPath(draw.path(fillTankPathData)
    .fill('rgb(35, 137, 218)'));

  if (valveGroup) {
    fillTankPath.insertBefore(valveGroup);
  }
}
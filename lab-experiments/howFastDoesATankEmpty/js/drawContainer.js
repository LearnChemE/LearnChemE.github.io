// drawContainer.js
import { draw, canvasWidth, tableY, containerWidth, length, surfaceWidth, borderHexCode } from './constants.js';
import { diameter } from './state.js';

export function drawContainer() {
  const startX = (canvasWidth - containerWidth - 40) / 2;
  const startY = tableY - 20 - 10 - length;

  const pathData = `
    M ${startX},${startY}
    h 20 
    v ${length}
    h ${containerWidth}
    h 100
    v ${surfaceWidth / 2}
    h -${(100 - surfaceWidth)}
    v ${surfaceWidth / 2}
    h  -${containerWidth + surfaceWidth + surfaceWidth}
    v -${length}
    h -${20 - surfaceWidth}
    v -${surfaceWidth}
  `;

  const pathData1 = `
    M ${startX + containerWidth + 20 + 20},${startY}
    h -20
    v ${length - diameter}
    h 100
    v -${surfaceWidth / 2}
    h -${100 - surfaceWidth}
    v -${length - diameter - surfaceWidth - surfaceWidth / 2}
    h ${20 - surfaceWidth}
    v -${surfaceWidth}
  `;

  draw.path([pathData, pathData1].join(''))
    .fill('#eeeeee')
    .stroke({ color: borderHexCode, width: 2 });
}
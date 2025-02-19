// drawTable.js
import { draw, tableX, tableY, tableWidth, tableHeight, legWidth, canvasWidth } from './constants.js';

export function drawTable() {
  // Draw left leg
  draw.rect(legWidth, tableHeight)
    .move(tableX, tableY - 4)
    .fill('#C1BDB3')
    .stroke({ color: '#000', width: 1 });

  // Draw right leg
  draw.rect(legWidth, tableHeight)
    .move(tableX + tableWidth - legWidth, tableY - 4)
    .fill('#C1BDB3')
    .stroke({ color: '#000', width: 1 });

  draw.rect(tableWidth + legWidth, legWidth)
    .move(tableX - 10, tableY)
    .fill('#1E1A1D')
    .stroke({ color: '#000', width: 1 });

  draw.rect(100, legWidth)
    .move((canvasWidth - 100) / 2, tableY - 20)
    .fill('#646464');
}
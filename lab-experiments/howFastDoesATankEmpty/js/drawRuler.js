// drawRuler.js
import { draw, canvasWidth, containerWidth, surfaceWidth, tableY, legWidth, length, ratio } from './constants.js';

export function drawRuler() {
  const startPoint = { x: canvasWidth / 2 - containerWidth / 2 - surfaceWidth - 2, y: tableY - legWidth - surfaceWidth };
  draw.rect(30, length - 4)
    .move(canvasWidth / 2 - containerWidth / 2 - surfaceWidth - 32, tableY - legWidth - surfaceWidth - length + 12)
    .fill('#deb887');

  for (let i = 0; i <= 80; i += 0.25) {
    const x = startPoint.x;
    const y = startPoint.y - i * ratio;
    const tickLength = i % 5 == 0 ? 15 : 10;

    draw.line(x, y, x - tickLength, y).stroke({ width: 0.5, color: '#000' });
    if (i % 5 === 0) {
      draw.text(i.toString()).move(x - tickLength - 5, y - 1)
        .attr({ 'text-anchor': 'end' })
        .font({
          size: 7,
          family: 'Arial',
          fill: '#000'
        });

      draw.text('cm').move(canvasWidth / 2 - containerWidth / 2 - surfaceWidth - 24, tableY - legWidth - surfaceWidth - length + 12)
        .font({
          size: 12,
          family: 'Arial',
          fill: '#000'
        });
    }
  }
}
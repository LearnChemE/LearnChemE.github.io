// drawInstructions.js
import { draw, canvasWidth, canvasHeight, borderHexCode, containerWidth, tableHeight, legWidth, length } from './constants.js';

export function drawInstructions() {
    draw.rect(150, 100)
    .center(canvasWidth - 100, canvasHeight / 2 + 30)
    .fill('none')
    .stroke({ color: 'black', width: 2 });
    
    let valveGroup1 = draw.group();
    valveGroup1.circle(30)
    .fill('#b4b4ff')
    .stroke({ color: borderHexCode, width: 2 })
    .center(canvasWidth - 140, canvasHeight / 2);
    
    const valve = valveGroup1.rect(34, 10)
    .fill('#c8c8ff')
    .stroke({ color: '#b4b4ff', width: 2 })
    .center(canvasWidth - 140, canvasHeight / 2);
    
    draw.text(' = Opened').move(canvasWidth - 120, canvasHeight / 2 - 10);
    
    valveGroup1.circle(30)
    .fill('#b4b4ff')
    .stroke({ color: borderHexCode, width: 2 })
    .center(canvasWidth - 140, canvasHeight / 2 + 50);
    
    const valve1 = valveGroup1.rect(10, 34)
    .fill('#c8c8ff')
    .stroke({ color: '#b4b4ff', width: 2 })
    .center(canvasWidth - 140, canvasHeight / 2 + 50);
    
    draw.text(' = Closed').move(canvasWidth - 120, canvasHeight / 2 - 10 + 50);

    const x1 = (canvasWidth - containerWidth) / 2;
    const x2 = x1 + containerWidth;
    const y1 = canvasHeight - tableHeight - legWidth - length + 5;
    const y2 = y1;
    
    const line = draw.line(x1 + 1, y1, x2 - 1, y2)
    .stroke({ color: '#000', width: 2, dasharray: '5,5' });
    
    const arrowLength = 7.5;
    draw.polyline([ 
        [0, arrowLength], [-arrowLength, 0], [0, -arrowLength] 
    ])
    .fill('black')
    .move(x1, y1 - arrowLength)
    .rotate(-Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI));
    
    draw.polyline([ 
        [0, -arrowLength], [arrowLength, 0], [0, arrowLength]
    ])
    .fill('black')
    .move(x2 - arrowLength, y2 - arrowLength)
    .rotate(-Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI));
    
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    
    draw.text('20 cm')
    .move(midX, midY - 20)
    .font({ size: 16, anchor: 'middle' });
    
}
// js/components/mfc.js
import * as config from '../config.js';
import * as state from '../state.js';
import { showMFCZoomedView } from '../uiInteractions.js'; // Import UI function
import { checkAndStartMFCFlow } from '../pipes.js';
import { writeTextAtPosition } from '../uiInteractions.js';

// --- Exported Main Component ---
export function createMassFlowController(draw, x, y) {
    const group = draw.group();

    // Dimensions / Settings (local to this component)
    const topWidth = 60;
    const topHeight = 80;
    const topCornerRadius = 5;

    const screenMargin = 5;
    const screenHeight = 25;
    const screenCornerRadius = 4;

    const buttonSize = 8;
    const buttonsYoffset = 10;

    const rectWidth = 20;
    const rectHeight = 14;

    const bottomHeight = 20;

    // Dark Gray Top Section
    group.rect(topWidth, topHeight)
        .fill('#4a4a4a')
        .stroke({ color: '#000', width: 1 })
        .radius(topCornerRadius)
        .move(x, y);

    // Tan Screen
    group.rect(topWidth - screenMargin * 2, screenHeight)
        .fill('#c69c6d')
        .stroke({ color: '#000', width: 1 })
        .radius(screenCornerRadius)
        .move(x + screenMargin, y + screenMargin);

    // Add MFC value text to the screen
    const mfcValue = state.getMfcValue();
    group.text(mfcValue.toFixed(1))
        .font({ family: 'monospace', size: 12, anchor: 'middle', weight: 'bold' })
        .fill('#000')
        .addClass('mfc-value-text')
        .center(x + topWidth / 2, y + screenMargin + screenHeight / 2);

    // Triangular Buttons and Black Rectangle
    const buttonsY = y + screenMargin + screenHeight + buttonsYoffset;

    // Down Triangle
    group.path(`
        M ${x + 10} ${buttonsY}
        L ${x + 5}  ${buttonsY - buttonSize}
        L ${x + 15} ${buttonsY - buttonSize} Z
    `)
        .fill('#00b7bd')
        .stroke({ color: '#000', width: 1 });

    // Up Triangle
    group.path(`
        M ${x + 25} ${buttonsY - buttonSize}
        L ${x + 20} ${buttonsY}
        L ${x + 30} ${buttonsY} Z
    `)
        .fill('#00b7bd')
        .stroke({ color: '#000', width: 1 });

    // Black Rectangle
    const rectX = x + 35;
    const rectY = buttonsY - buttonSize;
    group.rect(rectWidth, rectHeight)
        .fill('#000')
        .stroke({ color: '#000', width: 1 })
        .move(rectX, rectY);

    // Bottom Light Gray Section
    group.rect(topWidth, bottomHeight)
        .fill('#ccc')
        .stroke({ color: '#444', width: 1 })
        .move(x, y + topHeight);

    // --- Label for Mass Flow Controller ---
    group.text("Mass Flow Controller")
        .font({ family: 'Arial', size: 14, anchor: 'middle', weight: 'bold' })
        .fill('#000')
        .center(x + topWidth / 2, y + topHeight + bottomHeight + 15);

    
        group.text("mg/min")
        .font({ family: 'Arial', size: 12, anchor: 'middle', weight: 'bold' })
        .fill('#000')
        .center(x + topWidth / 2, y + topHeight + bottomHeight - 10);

    return group;
}

export function mfcClicked(draw, x, y) {

    const topWidth = 60;
    const topHeight = 80;
    const bottomHeight = 20;
    const clickArea = draw.rect(
        topWidth,
        topHeight + bottomHeight + 30   // 30px extra to cover your label
    )
    .fill({ opacity: 0})               // truly invisible
    .move(x, y)                         // same origin as the rest
    .attr({
      'pointer-events': 'all',          // catch clicks even on gaps
      cursor: 'pointer'                 // show hand cursor
    })
    .click(() => {
      // your one‐and‐only handler:
      showMFCZoomedView();
    })
    .front();
}
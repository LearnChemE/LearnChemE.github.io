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

    // Add click handler
    group.on('click', () => {
        showMFCZoomedView(); // Call UI function
    });

    writeTextAtPosition(380, 95, "mg/min");

    return group;
}

// --- Related Logic ---
export function updateMFCFlowSpeed(draw, value) {
    state.setMfcFlowSpeed(value);
    
    // Update the MFC value text in the small MFC component
    const mfcValue = state.getMfcValue();
    const mfcElements = document.querySelectorAll('.mfc-value-text');
    mfcElements.forEach(element => {
        element.textContent = mfcValue.toFixed(1);
    });
    
    // Re-animate any active MFC-controlled flows with the new speed
    // This requires iterating through existing flow paths and restarting their animation
    const activeFlows = state.getAllFlowPaths();
    Object.keys(activeFlows).forEach(segmentId => {
        const path = activeFlows[segmentId];
        if (path && path.isMFCControlled) {
            // Get original properties
            const color = path.flowColor;
            const opacity = path.flowOpacity;
            // Remove old path
            state.removeFlowPath(segmentId);
            // Re-animate with new speed
            // Need animateGasFlow function here or pass it in
            // For simplicity, let's assume animateGasFlow is available via import
             import('../pipes.js').then(pipesModule => {
                 pipesModule.animateGasFlow(draw, segmentId, color, opacity, null, true);
             });
        }
    });
     // Optional: Immediately check if flow should restart based on new MFC value/speed
     checkAndStartMFCFlow(draw);
}
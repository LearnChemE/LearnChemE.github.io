// js/components/co2Analyzer.js
import * as config from '../config.js';
import * as state from '../state.js';

export function createCO2GasAnalyzer(draw, x, y, concentration = "00.00%") {
    const group = draw.group();
    group.addClass('co2-analyzer'); // Add class for selection

    // Analyzer Body Dimensions
    const analyzerWidth = 120;
    const analyzerHeight = 80;
    const cornerRadius = 5;

    // Main Analyzer Body
    group.rect(analyzerWidth, analyzerHeight)
        .fill('#f0f0f0')
        .stroke({ color: '#444', width: 2 })
        .radius(cornerRadius)
        .move(x, y);

    // Digital Display Area
    const displayMargin = 10;
    const displayWidth = analyzerWidth - 2 * displayMargin;
    const displayHeight = analyzerHeight * 0.5;
    const displayX = x + displayMargin;
    const displayY = y + displayMargin;

    group.rect(displayWidth, displayHeight) // No need to store this rect typically
        .fill('#000') // Black background
        .stroke({ color: '#444', width: 1 })
        .move(displayX, displayY);

    // CO₂ Concentration Text - THIS is what needs updating
    const concentrationText = group.text(concentration)
        // Ensure Digital-7 font is loaded via CSS (@font-face) or use fallback
        .font({ family: 'Digital-7, monospace', size: 24, anchor: 'middle', weight: 'bold' })
        .fill('#0f0') // Green digital text
        .center(displayX + displayWidth / 2, displayY + displayHeight / 2);

    // Label for the Analyzer
    group.text("CO₂ Analyzer")
        .font({ family: 'Arial', size: 12, anchor: 'middle', weight: 'bold' })
        .fill('#000')
        .center(x + analyzerWidth / 2, y + analyzerHeight - 15); // Position below display

    // Bottom Connector
    const connectorWidth = 20;
    const connectorHeight = 5;
    const connectorX = x + analyzerWidth / 2 - connectorWidth / 2;
    const connectorY = y + analyzerHeight;
    group.rect(connectorWidth, connectorHeight)
        .fill('#888')
        .stroke({ color: '#444', width: 1 })
        .move(connectorX, connectorY);

    // Store the text element reference IN THE GROUP for easy access later
    group.concentrationText = concentrationText; // Attach to group object

    // Store the analyzer group reference in the global state
    state.setCo2AnalyzerElement(group);

    return group;
}

export function updateCO2AnalyzerDisplay(value) {
    const analyzerGroup = state.getCo2AnalyzerElement();
    if (analyzerGroup && analyzerGroup.concentrationText) {
        // Format the value as percentage with 2 decimal places
        const percentage = (value * 100).toFixed(2);
        analyzerGroup.concentrationText.text(`${percentage}%`);
    } else {
        console.warn("CO2 Analyzer element or text element not found for updating.");
    }
}
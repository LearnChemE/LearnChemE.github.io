import * as state from '../state.js';

function formatTemp(temp) {
    const tc = temp - 273.15;
    return `${tc.toFixed(0)}°C`;
}

export function createThermister(draw, x, y, temperature = 298) {
    const group = draw.group();
    group.addClass('therm'); // Add class for selection

    // Analyzer Body Dimensions
    const analyzerWidth = 120;
    const analyzerHeight = 80;
    const cornerRadius = 5;

    // Wire
    console.log(group)

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

    // Temperature Text - THIS is what needs updating
    const tstr = formatTemp(temperature);
    const concentrationText = group.text(tstr)
        // Ensure Digital-7 font is loaded via CSS (@font-face) or use fallback
        .font({ family: 'Digital-7, monospace', size: 24, anchor: 'middle', weight: 'bold' })
        .fill('#0f0') // Green digital text
        .center(displayX + displayWidth / 2, displayY + displayHeight / 2);

    // Label for the Analyzer
    group.text("Bed Temperature")
        .font({ family: 'Arial', size: 14, anchor: 'middle', weight: 'bold' })
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
    state.setThermElement(group);

    return group;
}

export function updateTemperatureDisplay(value) {
    const analyzerGroup = state.getThermElement();
    const str = formatTemp(value);
    if (analyzerGroup && analyzerGroup.concentrationText) {
        // Set new text
        analyzerGroup.concentrationText.text(str);
    } else {
        console.warn("CO2 Analyzer element or text element not found for updating.");
    }
}
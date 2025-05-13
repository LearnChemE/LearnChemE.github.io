// js/components/gauges.js
import * as config from '../config.js';
import * as state from '../state.js'; // Import state module
import { showGaugeInput } from '../uiInteractions.js'; // Import UI function
import { writeTextAtPosition } from '../uiInteractions.js';

// --- Sub-components ---
function createPressureGaugeView(draw, x, y) {
  const group = draw.group();

  group.circle(config.gaugeSize)
    .fill('white')
    .stroke({ color: '#888', width: config.gaugeStrokeWidth })
    .center(x, y);

  const radius = (config.gaugeSize / 2) - config.gaugeStrokeWidth - 2;
  const startAngle = 220;
  const endAngle = -40;
  const startRad = startAngle * Math.PI / 180;
  const endRad = endAngle * Math.PI / 180;
  const startX = x + radius * Math.cos(startRad);
  const startY = y + radius * Math.sin(startRad);
  const endX = x + radius * Math.cos(endRad);
  const endY = y + radius * Math.sin(endRad);
  const arcPath = `M ${startX} ${startY} A ${radius} ${radius} 0 1 0 ${endX} ${endY}`;

  group.path(arcPath)
    .fill('none')
    .stroke({ color: 'black', width: 2 });

  const needleLength = radius - 2;
  const needleWidth = 4;
  group.path(`M ${x} ${y}
                L ${x - needleWidth/2} ${y}
                L ${x} ${y - needleLength}
                L ${x + needleWidth/2} ${y} Z`)
    .fill('black')
    .transform({ rotate: 45, cx: x, cy: y }); // Example rotation
  writeTextAtPosition(550, 25, "bar");
  return group;
}

function createHexagonalView(draw, x, y) {
  const group = draw.group();

  group.circle(config.hexCircleSize)
    .fill('white')
    .stroke({ color: '#888', width: 4 })
    .center(x, y);

  const height = config.hexSize * Math.sqrt(3);
  const hexagonPath = `
        M ${x - config.hexSize} ${y}
        L ${x - config.hexSize/2} ${y - height/2}
        L ${x + config.hexSize/2} ${y - height/2}
        L ${x + config.hexSize} ${y}
        L ${x + config.hexSize/2} ${y + height/2}
        L ${x - config.hexSize/2} ${y + height/2}
        Z
    `;
  group.path(hexagonPath)
    .fill('black')
    .stroke({ color: 'black', width: 1 });

  group.circle(config.hexInnerCircleSize)
    .fill('white')
    .center(x, y);

  return group;
}

// --- Exported Main Components ---
export function createConnectedGauges(draw, x, y, gaugeId) {
  // Separate group for lines, added first to stay behind
  const lineGroup = draw.group();

  // Main group for gauges and hexagon
  const group = draw.group().attr({ id: gaugeId });

  const leftGaugeX = x;
  const rightGaugeX = x + config.connectedGaugeSize;
  const hexagonX = x + config.connectedGaugeSize / 2;
  const hexagonY = y + config.connectedGaugeVerticalOffset;

  // Draw lines in the background group
  lineGroup.line(hexagonX, hexagonY, leftGaugeX, y)
    .stroke({ color: '#666', width: 4 });

  lineGroup.line(hexagonX, hexagonY, rightGaugeX, y)
    .stroke({ color: '#666', width: 4 });

  // Create gauges and hexagon
  const leftGauge = createPressureGaugeView(draw, leftGaugeX, y);
  const rightGauge = createPressureGaugeView(draw, rightGaugeX, y);
  const hexagon = createHexagonalView(draw, hexagonX, hexagonY);

  // Click handler
  const clickHandler = event => {
    const screenX = event.clientX;
    const screenY = event.clientY;
    showGaugeInput(screenX, screenY, gaugeId);
    console.log(`Gauge ${gaugeId} clicked at screen coords (${screenX}, ${screenY})`);
  };

  leftGauge.on('click', clickHandler);
  rightGauge.on('click', clickHandler);
  hexagon.on('click', clickHandler);

  // Add them to main group
  group.add(leftGauge);
  group.add(rightGauge);
  group.add(hexagon);

  return group;
}



export function createDigitalPressureGauge(draw, x, y, pressure = "--- bar") {
  const group = draw.group();
  group.addClass('digital-pressure-gauge'); // Add class for selection
  const gaugeSize = 50; // Local dimension ok here

  // Outer Circular Gauge
  group.circle(gaugeSize)
    .fill('#fff')
    .stroke({ color: '#888', width: config.gaugeStrokeWidth })
    .center(x, y);

  // Digital Display Rectangle - Make it larger to fit text
  const displayWidth = gaugeSize * 0.9; // Increased width
  const displayHeight = gaugeSize * 0.5; // Adjusted height
  const displayX = x - displayWidth / 2;
  const displayY = y - displayHeight / 2;
  group.rect(displayWidth, displayHeight)
    .fill('#e0e0e0')
    .stroke({ color: '#444', width: 1 })
    .move(displayX, displayY);

  // Get current pressure values and calculate sum
  const totalPressure = `0.0`;

  // Create text element for total pressure
  const fontSize = Math.min(displayWidth * 0.3, displayHeight * 0.6); // Larger font size for single value

  group.text(`${totalPressure}`)
    .font({ family: 'monospace', size: fontSize, anchor: 'middle', weight: 'bold' })
    .center(x, y);

  // Bottom Connector
  const connectorWidth = 10;
  const connectorHeight = 5;
  const connectorX = x - connectorWidth / 2;
  const connectorY = y + (gaugeSize / 2);
  group.rect(connectorWidth, connectorHeight)
    .fill('#888')
    .stroke({ color: '#444', width: 1 })
    .move(connectorX, connectorY);

  return group;
}
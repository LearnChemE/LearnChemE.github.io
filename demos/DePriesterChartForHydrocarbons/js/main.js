// Calculate display dimensions
let windowWidth  = window.innerWidth;
let windowHeight = windowWidth * 600 / 1000;

const margin = 50;

// Initialize SVG.js draw area
const draw = SVG().addTo('#svg-container').size(windowWidth, windowHeight);

// Define logical canvas size and viewBox
const canvasWidth  = 1000;
const canvasHeight = 600;
document.getElementsByTagName('svg')[0]
.setAttribute('viewBox', `0 0 ${canvasWidth} ${canvasHeight}`);

let currentK = 120.0;
let isPanning = false;
let panStart = { x: 0, y: 0 };

const pressureSlider = document.getElementById('pressureSlider');
const temperatureSlider = document.getElementById('temperatureSlider');
const methaneButton = document.getElementById('methane');
const propaneButton = document.getElementById('propane');
const nDecaneButton = document.getElementById('n-decane');

const pressurePositions = [820.5, 778, 720.5, 647, 603.5, 556, 501.5, 437, 381, 306]; 
const temperaturePositions = [223.5, 281, 349, 432, 512, 575, 632, 680, 741, 799];

const propaneKValues = [[3.5, 2.7, 1.8, 1.1, 0.5, 0.58, 0.4, 0.252, -1, -1.0],
                [4.6, 3.5, 2.45, 1.5, 1.1, 0.8, 0.57, 0.36, 0.252, -1.0],
                [7.2, 5.2, 3.6, 2.3, 1.7, 1.25, 0.88, 0.58, 0.42, 0.252],
                [10.625, 7.6,   5.2,   3.25,  2.4,  1.8,  1.28, 0.84, 0.6,  0.38],
                [17.0,   12.2,  7.9,   4.8,   3.75, 2.7,  1.9,  1.3,  0.9,  0.58],
                [24.0,   16.5,  10.9,  6.6,   4.9,  3.7,  2.6,  1.75, 1.25, 0.78],
                [32.0,   22.0,  14.4,  8.7,   6.6,  4.8,  3.5,  2.3,  1.6,  1.1 ],
                [39, 28, 18.3,  11.1,  8.2,   6.2,  4.4,  2.9,  2.5,  1.3],
                [50.0,   36, 24, 14.4,  11.1,  8.2,  6.0,  3.8,  2.8,  1.75],
                [64.0,   44.0,  30.0,  19.0,  13.85,10.55,7.8,  5.2,  3.7,  2.3 ]
]

const methaneKValues = [
    [120.0, 82.0, 52.0, 32.0, 25.0, 18.5, 13.0, 7.6, 4.85, -1.0],
    [132.5, 90.0, 59.0, 36.0, 27.0, 20.0, 14.0, 8.4, 5.4, 3.2],
    [155.0, 105.0, 68.0, 40.0, 30.0, 22.5, 15.5, 9.7, 6.1, 3.6],
    [180.0, 120.0, 78.0, 45.0, 34.0, 25.0, 17.5, 11.0, 6.8, 3.9],
    [200.0, 135.0, 88.0, 51.0, 38.0, 28.0, 19.5, 12.5, 7.8, 4.4],
    [215.0, 145.0, 96.0, 58.0, 44.0, 30.0, 22.0, 13.5, 8.8, 4.8],
    [225.0, 160.0, 105.0, 64.0, 48.0, 34.0, 23.5, 15.0, 9.8, 5.4],
    [233.0, 170.0, 115.0, 70.0, 50.0, 37.0, 25.5, 16.0, 10.5, 5.8],
    [245.0, 135.0, 122.5, 76.0, 56.0, 41.0, 28.0, 18.0, 12, 6.4],
    [255.0, 195.0, 130.0, 82.0, 62.0, 44.0, 30.0, 20.0, 13.0, 7.0]
]

const nDecaneKValues = [
    [-1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0],
    [-1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0],
    [0.001, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0],
    [0.0028, 0.0024, 0.0019, 0.0015, 0.0013, 0.0011, -1.0, -1.0, -1.0, -1.0],
    [0.011, 0.009, 0.007, 0.0048, 0.004, 0.0034, 0.0027, 0.0022, 0.0017, 0.0014],
    [0.0325, 0.026, 0.02, 0.014, 0.011, 0.009, 0.007, 0.005, 0.0042, 0.0031],
    [0.080, 0.070, 0.050, 0.034, 0.028, 0.022, 0.017, 0.013, 0.010, 0.007],
    [0.200, 0.160, 0.110, 0.07, 0.06, 0.045, 0.035, 0.026, 0.02, 0.014],
    [0.6, 0.44, 0.32, 0.2, 0.16, 0.14, 0.09, 0.0625, 0.05, 0.035],
    [1.6, 1.2, 0.825, 0.5, 0.4, 0.3, 0.24, 0.16, 0.12, 0.08]
]

// Currently selected K-value set
let KValues = methaneKValues;

function updateCustomLineFromSliders() {
  const pIndex = parseInt(pressureSlider.value, 10);
  const tIndex = parseInt(temperatureSlider.value, 10);
  
  // Determine endpoints
  const x1 = pressurePositions[pIndex] - margin;
  const y1 = 85;
  const x2 = temperaturePositions[tIndex] - margin;
  const y2 = 558;

  currentK = KValues[tIndex][pIndex];
  
  // Clear and redraw base content
  drawCanvas();
  drawKValue();
  
  // Draw the dynamic line
  drawCustomLine(x1, y1, x2, y2);
}

// Attach input listeners
pressureSlider.addEventListener('input', updateCustomLineFromSliders);
temperatureSlider.addEventListener('input', updateCustomLineFromSliders);

// Helper to highlight active button
function setActiveButton(button) {
  [methaneButton, propaneButton, nDecaneButton].forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
}

// Initialize default active
setActiveButton(methaneButton);

// Button click handlers
methaneButton.addEventListener('click', () => {
  KValues = methaneKValues;
  setActiveButton(methaneButton);
  updateCustomLineFromSliders();
});
propaneButton.addEventListener('click', () => {
  KValues = propaneKValues;
  setActiveButton(propaneButton);
  updateCustomLineFromSliders();
});
nDecaneButton.addEventListener('click', () => {
  KValues = nDecaneKValues;
  setActiveButton(nDecaneButton);
  updateCustomLineFromSliders();
});

// Image scale and trim settings (if needed later)
const zoom   = 1.15;
const trimPx = 80;

// Main rendering function
function drawCanvas() {
  draw.clear();
  insertImage();
  // drawScale();
  addOptionToDragAndZoom();
}

// Insert and transform the DePriester chart image
function insertImage() {
  const g = draw.group();
  g.image('./assets/depriester.svg')
    .size(canvasWidth, canvasHeight)
    .attr({ 'pointer-events': 'none' })
    .move(0, 20);
  g.rotate(90).scale(zoom);
}

// Draw a realistic ruler-style scale on axes
function drawScale() {
  console.log('Drawing scale ticks'); // debug to confirm execution
  const minorInterval = 5;   // smallest division in px
  const mediumInterval = 2;  // intermediate division
  const majorInterval = 25;  // major division with labels
  
  // X-axis (bottom)
  for (let x = 0; x <= canvasWidth; x += minorInterval) {
    let tickHeight = (x % majorInterval === 0) ? 15 
    : (x % mediumInterval === 0) ? 10 
    : 5;
    draw.line(x, canvasHeight, x, canvasHeight - tickHeight)
    .stroke({ width: 1, color: '#000' });
    if (x % majorInterval === 0) {
      draw.text(String(x))
      .font({ size: 10, anchor: 'start' })
      .move(x, canvasHeight - tickHeight - 12);
    }
  }
  
  // Y-axis (left)
  for (let y = 0; y <= canvasHeight; y += minorInterval) {
    let tickWidth = (y % majorInterval === 0) ? 15 
    : (y % mediumInterval === 0) ? 10 
    : 5;
    draw.line(0, y, tickWidth, y)
    .stroke({ width: 1, color: '#000' });
    if (y % majorInterval === 0) {
      draw.text(String(y))
      .font({ size: 10, anchor: 'start' })
      .move(tickWidth + 2, y - 5);
    }
  }
}


function drawCustomLine(x1, y1, x2, y2, strokeOptions = { width: 2, color: '#0ddb0d' }) {
  draw.line(x1, y1, x2, y2).stroke(strokeOptions);
}

function drawKValue() {
  if (currentK !== null) {
    // Group the text and box together
    const kGroup = draw.group();
    // Draw the text
    const text = (currentK === -1) ? 'K = out of chart range' : `K = ${currentK}`;
    const kText = kGroup.text(text)
    .font({ size: 24, anchor: 'start' })
    .move(475, 10);
    // Measure text dimensions
    const bbox = kText.bbox();
    // Draw a box behind the text with padding
    kGroup.rect(bbox.width + 8, bbox.height + 4)
    .move(bbox.x - 4, bbox.y - 2)
    .fill('white')
    .stroke({ color: 'black', width: 1 });
    // Ensure text is on top
    kText.front();
  }
}

function addOptionToDragAndZoom() {
    const defaultViewbox = { x: 0, y: 0, width: canvasWidth, height: canvasHeight };
    draw.viewbox(defaultViewbox.x, defaultViewbox.y, defaultViewbox.width, defaultViewbox.height);
    
    const background = draw.rect(canvasWidth, canvasHeight)
    .fill({ color: '#fff', opacity: 0 });
    background.back();
    
    background.on('mousedown', function(event) {
        const vb = draw.viewbox();
        if (vb.width >= defaultViewbox.width) return;
        isPanning = true;
        panStart.x = event.clientX;
        panStart.y = event.clientY;
    });
    
    background.on('mousemove', function(event) {
        if (!isPanning) return;
        event.preventDefault();
        const dx = event.clientX - panStart.x;
        const dy = event.clientY - panStart.y;
        const vb = draw.viewbox();
        if (vb.width < defaultViewbox.width) {
            draw.viewbox(vb.x - dx, vb.y - dy, vb.width, vb.height);
        }
        panStart.x = event.clientX;
        panStart.y = event.clientY; 
    });
    
    background.on('mouseup', function() {
        isPanning = false;
    });
    
    document.addEventListener('mouseup', () => {
        isPanning = false;
    });
    
    draw.on('wheel', function(event) {
        event.preventDefault();
        const zoomStep = 0.02;
        const zoomFactor = event.deltaY < 0 ? (1 - zoomStep) : (1 + zoomStep);
        const vb = draw.viewbox();
        let newWidth = vb.width * zoomFactor;
        let newHeight = vb.height * zoomFactor;
        if (newWidth >= defaultViewbox.width) {
            draw.viewbox(defaultViewbox.x, defaultViewbox.y, defaultViewbox.width, defaultViewbox.height);
            return;
        }
        const pt = draw.node.createSVGPoint();
        pt.x = event.clientX;
        pt.y = event.clientY;
        const cursor = pt.matrixTransform(draw.node.getScreenCTM().inverse());
        let newX = cursor.x - (cursor.x - vb.x) * zoomFactor;
        let newY = cursor.y - (cursor.y - vb.y) * zoomFactor;
        newX = Math.max(0, Math.min(newX, canvasWidth - newWidth));
        newY = Math.max(0, Math.min(newY, canvasHeight - newHeight));
        draw.viewbox(newX, newY, newWidth, newHeight);
    });
}

drawCanvas();
drawKValue();
drawCustomLine(pressurePositions[0] - margin, 85, temperaturePositions[0] - margin, 558);
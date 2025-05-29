import { pressurePositions, temperaturePositions,  propaneKValues, methaneKValues, nDecaneKValues, methaneKCoordinates, propaneKCoordinates, nDecaneKCoordinates} from "../js/kvalues.js";

const margin = 160;
const canvasWidth  = 800;
const canvasHeight = 600;
let windowWidth  = window.innerWidth;
let windowHeight = windowWidth * canvasHeight / canvasWidth;

const draw = SVG().addTo('#svg-container').size(windowWidth, windowHeight);
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



// Currently selected K-value set
let KValues = methaneKValues;
let KValuesPositions = methaneKCoordinates;

function updateCustomLineFromSliders() {
  const pIndex = parseInt(pressureSlider.value, 10);
  const tIndex = parseInt(temperatureSlider.value, 10);
  
  // Determine endpoints
  const x1 = pressurePositions[pIndex] - margin;
  const y1 = 85;
  const x2 = temperaturePositions[tIndex] - margin;
  const y2 = 558;

  currentK = KValues[tIndex][pIndex];

  const kXCoordinate = KValuesPositions[tIndex][pIndex].x
  const kYCoordinate = KValuesPositions[tIndex][pIndex].y

  
  // Clear and redraw base content
  drawCanvas();
  drawKValue();
  
  // Draw the dynamic line
  drawCustomLine(x1, y1, x2, y2, kXCoordinate, kYCoordinate);
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
  KValuesPositions = methaneKCoordinates
  setActiveButton(methaneButton);
  updateCustomLineFromSliders();
});
propaneButton.addEventListener('click', () => {
  KValues = propaneKValues;
  KValuesPositions = propaneKCoordinates
  setActiveButton(propaneButton);
  updateCustomLineFromSliders();
});
nDecaneButton.addEventListener('click', () => {
  KValues = nDecaneKValues;
  KValuesPositions = nDecaneKCoordinates
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
  addOptionToDragAndZoom();
}

// Insert and transform the DePriester chart image
function insertImage() {
  const g = draw.group();
  g.image('./assets/depriester.svg')
    .size(canvasWidth, canvasHeight)
    .attr({ 'pointer-events': 'none' })
    .move(-10, 20);
  g.rotate(90).scale(zoom);
}


function drawCustomLine(x1, y1, x2, y2, kXCoordinate, kYCoordinate, strokeOptions = { width: 2, color: '#0ddb0d' }) {
  const customLine = draw.line(x1, y1, x2, y2).stroke(strokeOptions);
  draw.circle(8).center(x1, y1).fill('none').stroke({ width: 1.5, color: '#0ddb0d' });
  draw.circle(8).center(x2, y2).fill('none').stroke({ width: 1.5, color: '#0ddb0d' });
  draw.circle(14).center(kXCoordinate, kYCoordinate).fill('none').stroke({ width: 2, color: '#0ddb0d' });

  //   // On hover, compute SVG coordinates of the pointer
  //   customLine.on('mousemove', function(event) {
  //       // Create an SVGPoint and transform to get SVG coords
  //       const svg = this.node.ownerSVGElement;
  //       const pt = svg.createSVGPoint();
  //       pt.x = event.clientX;
  //       pt.y = event.clientY;
  //       const location = pt.matrixTransform(svg.getScreenCTM().inverse());
  //       const coordsEl = document.getElementById('coords-display');
  //       if (coordsEl) {
  //           coordsEl.textContent = `Coordinates: ${location.x.toFixed(2)}, ${location.y.toFixed(2)}`;
  //       }
  //   });

  // // Log coordinates to console on click
  // customLine.on('click', function(event) {
  //     const svg = this.node.ownerSVGElement;
  //     const pt = svg.createSVGPoint();
  //     pt.x = event.clientX;
  //     pt.y = event.clientY;
  //     const location = pt.matrixTransform(svg.getScreenCTM().inverse());
  //     console.log(`{ x: ${location.x.toFixed(2)}, y: ${location.y.toFixed(2)} }`);
  // });
}

function drawKValue() {
  if (currentK !== null) {
    // Update the K-value in the overlay div
    const text = (currentK === -1) ? 'K = out of chart range' : `K = ${currentK}`;
    const kText = document.getElementById("k-value");
    if (kText) {
        kText.textContent = text;
    }
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
drawCustomLine(pressurePositions[0] - margin, 85, temperaturePositions[0] - margin, 558, KValuesPositions[0][0].x, KValuesPositions[0][0].y);
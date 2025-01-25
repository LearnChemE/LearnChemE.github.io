// Select the canvas element
import ReusableMethods from '../reusableMethods.js';

const canvas = document.getElementById('centeredCanvas');
const ctx = canvas.getContext('2d');
const globalFunctions = new ReusableMethods(ctx);

const liquidHeightSlider = document.getElementById('liquidHeight');
const drainDiameterSlider = document.getElementById('drainDiameter');
const liquidDensitySlider = document.getElementById('liquidDensity');
const dischargeCoefficientSlider = document.getElementById('dischargeCoefficient');

const liquidHeightValue = document.getElementById('liquidHeightValue');
const drainDiameterValue = document.getElementById('drainDiameterValue');
const liquidDensityValue = document.getElementById('liquidDensityValue');
const dischargeCoefficientValue = document.getElementById('dischargeCoefficientValue');

const startPoint = {x: 20, y: 75};
const containerHeight = 235;
const containerWidth = 135;
var waterHeight = (parseFloat(liquidHeightSlider.value) / 0.9) * 205;
var diameter = (parseFloat(drainDiameterSlider.value) / 7) * 20;
const currentPoint = {x: startPoint.x + 63, y: startPoint.y + containerHeight};
const point1 = {x: currentPoint.x + 65, y: currentPoint.y + 14};
var point2 = {x: point1.x + diameter, y: currentPoint.y + 14};
const tapDistance = 40;
const tapKnobHeight = 7.5
const waterStartPoint = {x: startPoint.x + 63, y: startPoint.y + 14 + 235};

setupSliders();


function setupSliders() {
    liquidHeightSlider.oninput = function() {
        liquidHeightValue.textContent = (liquidHeightSlider.value);
        drawCanvas();
    };
    drainDiameterSlider.oninput = function() {
        drainDiameterValue.textContent = (drainDiameterSlider.value);
        drawCanvas();
    };
    liquidDensitySlider.oninput = function() {
        liquidDensityValue.textContent = (liquidDensitySlider.value);
        drawCanvas();
    };
    dischargeCoefficientSlider.oninput = function() {
        dischargeCoefficientValue.textContent = (dischargeCoefficientSlider.value);
        drawCanvas();
    };
}

function setupValues() {
    waterHeight = (parseFloat(liquidHeightSlider.value) / 0.9) * 205;
    diameter = (parseFloat(drainDiameterSlider.value) / 7) * 20;
    point2 = {x: point1.x + diameter, y: currentPoint.y + 14};
}
function setupCanvasSpace() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.resetTransform()
    ctx.textAlign = 'center'
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2
    ctx.fillStyle = 'rgb(35, 137, 218)';
}

function drawTank() {
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(startPoint.x + 90, startPoint.y);
    ctx.lineTo(startPoint.x + 90, startPoint.y + 20);
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y + 8);
    ctx.lineTo(startPoint.x + 80, startPoint.y + 8);
    ctx.lineTo(startPoint.x + 80, startPoint.y + 20);
    ctx.moveTo(startPoint.x, startPoint.y + 8);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(startPoint.x + 63, startPoint.y + 6 + 8);
    ctx.lineTo(startPoint.x + 63, startPoint.y + containerHeight);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(currentPoint.x, currentPoint.y)
    ctx.quadraticCurveTo(currentPoint.x + 30, currentPoint.y + 11, currentPoint.x + 65, currentPoint.y + 14);
    
    ctx.lineTo(point1.x, point1.y + 28);
    ctx.lineTo(point1.x + 75, point1.y + 28);
    ctx.moveTo(point1.x + 75, point1.y + 28 - diameter);
    ctx.lineTo(point1.x + diameter, point1.y + 28 - diameter);
    ctx.lineTo(point1.x + diameter, currentPoint.y + 14);
    ctx.moveTo(point1.x + diameter, point1.y + 28 - diameter);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(point2.x, point2.y)
    ctx.quadraticCurveTo(point2.x + 30, point2.y - 3, startPoint.x + 63 + containerWidth, point2.y - 14);
    ctx.lineTo(startPoint.x + 63 + containerWidth, startPoint.y + 14);
    ctx.moveTo(point2.x, point2.y)
    ctx.closePath();
    ctx.stroke();
}

function drawWaterFlowFromTap() {
    ctx.beginPath();
    ctx.lineTo(startPoint.x, startPoint.y);
    ctx.lineTo(startPoint.x + 90, startPoint.y);
    ctx.lineTo(startPoint.x + 90, startPoint.y + containerHeight);
    ctx.lineTo(startPoint.x + 80, startPoint.y + containerHeight);
    ctx.lineTo(startPoint.x + 80, startPoint.y + 8);
    ctx.lineTo(startPoint.x, startPoint.y + 8);
    ctx.lineTo(startPoint.x, startPoint.y);
    ctx.closePath();
    ctx.fill();
}

function fillTank() {
    const centerX = (startPoint.x + 80 + startPoint.x + 90) / 2;
    const centerY = (startPoint.y + 20 + startPoint.y + 20) / 2;
    const radiusX = Math.abs(startPoint.x + 90 - startPoint.x - 80) / 2;
    const radiusY = 0;

    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();

    const fillPoint1 = {x: currentPoint.x + 65, y: currentPoint.y + 14};
    ctx.beginPath();
    ctx.moveTo(fillPoint1.x, fillPoint1.y); 
    ctx.lineTo(fillPoint1.x, fillPoint1.y + 28);
    ctx.lineTo(fillPoint1.x + 75, fillPoint1.y + 28);
    ctx.lineTo(fillPoint1.x + 75, fillPoint1.y + 28 - diameter);
    ctx.lineTo(fillPoint1.x + diameter, fillPoint1.y + 28 - diameter);
    ctx.lineTo(fillPoint1.x + diameter, fillPoint1.y);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(currentPoint.x, currentPoint.y);
    ctx.quadraticCurveTo(currentPoint.x + 30, currentPoint.y + 11, currentPoint.x + 65, currentPoint.y + 14);
    const fillpoint2 = {x: point1.x + diameter, y: currentPoint.y + 14};
    ctx.lineTo(fillpoint2.x, fillpoint2.y);
    ctx.lineTo(point2.x, point2.y)
    ctx.quadraticCurveTo(point2.x + 30, point2.y - 3, startPoint.x + 63 + containerWidth, point2.y - 14);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.lineTo(waterStartPoint.x + containerWidth, startPoint.y + 235);
    ctx.lineTo(waterStartPoint.x + containerWidth, startPoint.y + 235 - waterHeight);
    ctx.lineTo(waterStartPoint.x, startPoint.y + 235 - waterHeight);
    ctx.lineTo(waterStartPoint.x, startPoint.y + 235);
    ctx.closePath();
    ctx.fill();
    
}

function drawTap() {
    
    ctx.beginPath();
    ctx.moveTo(point1.x + tapDistance, point1.y + 28 - diameter);
    ctx.lineTo(point1.x + tapDistance, point1.y + 28);
    ctx.lineTo(point1.x + tapDistance + 20, point1.y + 28);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(point1.x + tapDistance + 20, point1.y + 28);
    ctx.lineTo(point1.x + tapDistance + 20, point1.y + 28 - diameter);
    ctx.lineTo(point1.x + tapDistance, point1.y + 28 - diameter);
    ctx.moveTo(point1.x + tapDistance, point1.y + 28);
    ctx.lineTo(point1.x + tapDistance + 20, point1.y + 28 - diameter);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(point1.x + tapDistance + 10, point1.y + 28 - diameter);
    ctx.lineTo(point1.x + tapDistance + 10, point1.y + 28 - diameter - tapKnobHeight);
    ctx.lineTo(point1.x + tapDistance + 5, point1.y + 28 - diameter - tapKnobHeight);
    ctx.moveTo(point1.x + tapDistance + 10, point1.y + 28 - diameter);
    ctx.moveTo(point1.x + tapDistance + 15, point1.y + 28 - diameter - tapKnobHeight);
    ctx.lineTo(point1.x + tapDistance + 5, point1.y + 28 - diameter - tapKnobHeight);
    ctx.closePath();
    ctx.stroke();
}

function drawArrows() {
    ctx.fillStyle = 'black'; // Set text color
    globalFunctions.drawTextWithSubscript(point1.x + tapDistance + 10, point1.y + 28 + 15, 'c', '0');
    ctx.fillStyle = 'rgb(35, 137, 218)';

    globalFunctions.drawDashedLine(startPoint.x + 63 + 65, startPoint.y + 235 + 28 + 14, startPoint.x + 10, startPoint.y + 235 + 28 + 14);
    globalFunctions.drawDashedLine(startPoint.x + 63, startPoint.y + 235 - waterHeight, startPoint.x + 10, startPoint.y + 235 - waterHeight);
  
    globalFunctions.drawDoubleArrowLine(startPoint.x + 5, startPoint.y + 235 - waterHeight, startPoint.x + 5, startPoint.y + 235 + 28 + 14);
    globalFunctions.drawText(startPoint.x + 15, startPoint.y + 235 + 28 + 14 - waterHeight, 'h');

    globalFunctions.drawDashedLine(point1.x + 75, point1.y + 28, point1.x + 105, point1.y + 28)
    globalFunctions.drawDashedLine(point1.x + 75, point1.y + 28 - diameter, point1.x + 105, point1.y + 28 - diameter)
    globalFunctions.drawDoubleArrowLineOutward(point1.x + 105, point1.y + 28, point1.x + 105, point1.y + 28 - diameter, 'd');
}

function drawCanvas() {
    setupCanvasSpace();
    setupValues();
    drawWaterFlowFromTap();
    drawTank();
    fillTank();
    drawTap();
    drawArrows();
    updateGraph();
}


// Code to draw graph
const g = 9.81;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const graphStartX = 350;
const graphWidth = 254;
const graphMargin = (canvasHeight - graphWidth) / 2

function updateGraph() {
    const hMax = parseFloat(liquidHeightSlider.max);
    const h = parseFloat(liquidHeightSlider.value);
    const d = parseFloat(drainDiameterSlider.value) / 100;
    const c0 = parseFloat(dischargeCoefficientSlider.value);
    const density = parseFloat(liquidDensitySlider.value);

    drawAxes(hMax);

    const points = [];
    for (let i = 0; i <= 1; i += 0.01) {
        const Q = calculateFlowRate(i, d, c0);
        points.push({ x: i, y: Q });
    }
    drawGraph(points);

    const currentQ = calculateFlowRate(h, d, c0);
    drawCurrentPoint(h, currentQ);
    globalFunctions.drawText(graphStartX + (canvasWidth - graphStartX)/2, (canvasHeight - graphWidth - 60)/2, 'volumetric flow rate = ' + calculateFlowRate(h, d, c0).toFixed(2) + ' L/s');
    globalFunctions.drawText(graphStartX + (canvasWidth - graphStartX)/2, (canvasHeight - graphWidth - 15)/2, 'mass flow rate = ' + (calculateFlowRate(h, d, c0) * density).toFixed(2) + ' kg/s');
}

function calculateFlowRate(h, d, c0) {
    return c0 * Math.PI * Math.pow(d, 2) / 4 * Math.sqrt(2 * g * h) * 1000; // Q = c₀π(d²/4)√(2gh)
}

function drawAxes(hMax) {
    ctx.strokeStyle = 'black';

    ctx.beginPath();
    ctx.moveTo(graphStartX, canvasHeight - graphMargin);
    ctx.lineTo(graphStartX + graphWidth, canvasHeight - graphMargin);
    ctx.lineTo(graphStartX + graphWidth, canvasHeight - graphMargin - graphWidth);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(graphStartX, canvasHeight - graphMargin);
    ctx.lineTo(graphStartX, canvasHeight - graphMargin - graphWidth);
    ctx.lineTo(graphStartX + graphWidth, canvasHeight - graphMargin - graphWidth);
    ctx.stroke();

    // Labels and ticks
    ctx.font = '16px Arial, sans-serif';
    ctx.textAlign = 'center';

    // X-axis labels and ticks
    for (let i = 0; i <= 1; i += 0.2) {
        const x = graphStartX + (i) * graphWidth;
        ctx.beginPath();
        ctx.moveTo(x, canvasHeight - graphMargin);
        ctx.lineTo(x, canvasHeight - graphMargin + 5);
        ctx.stroke();
        ctx.fillText(i.toFixed(1), x, canvasHeight - graphMargin + 20);
    }

    // Y-axis labels and ticks
    ctx.textAlign = 'right';
    for (let i = 0; i <= 20; i += 5) {
        const y = canvasHeight - graphMargin - (i / 20) * graphWidth;
        ctx.beginPath();
        ctx.moveTo(graphStartX, y);
        ctx.lineTo(graphStartX - 5, y);
        ctx.stroke();
        ctx.fillText(i.toFixed(0), graphStartX - 10, y + 4);
    }

    // Axis titles
    ctx.textAlign = 'center';
    ctx.font = '16px Arial, sans-serif'
    ctx.fillText("liquid height (m)", graphStartX + graphWidth / 2, canvasHeight - graphMargin + 40);
    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("volumetric flow rate (L/s)", -canvasHeight / 2, graphStartX - 35);
    ctx.restore();
}

// Draw graph
function drawGraph(points) {
    ctx.strokeStyle = 'purple';

    ctx.beginPath();
    points.forEach((point, index) => {
        const x = graphStartX + (point.x) * graphWidth;
        const y = canvasHeight - graphMargin - (point.y / 20) * graphWidth; // Scale Q for visibility
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.strokeStyle = 'black';
}

// Draw current point
function drawCurrentPoint(h, Q) {
    const x = graphStartX + (h) * graphWidth;
    const y = canvasHeight - graphMargin - (Q / 20) * graphWidth; // Scale Q for visibility

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
}

drawCanvas();
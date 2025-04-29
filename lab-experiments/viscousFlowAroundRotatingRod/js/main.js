const canvasWidth = 1000;
const canvasHeight = 600;
const borderHexCode = '#b3b3b3';
const containerHeight = 410;
const containerWidth = 8 * containerHeight / 12;
const surfaceWidth = 8;
const innerMargin = 50; 
const shaftLength = 200;
const shaftWidth = 20;
const connectingRodWidth = containerWidth / 10;
const connectingRodExtraHeight = 25
const connectingRodHeight = containerHeight + connectingRodExtraHeight;
const knobWidth = 30;
const knobHeight = 40;
let isDragging = false;
const centerX = canvasWidth / 4;
const centerY = canvasHeight / 2;
const radius = shaftLength - knobWidth - 5;
const width = 20;
const height = shaftLength;
const cornerRadius = shaftWidth / 2;
let knob = null;
let shaft = null;
let shaftLine = null;
let currentAngle = 0;
let shaftFrontView = null;
let knobFrontView = null;
let connectingRod = null;
const shaftColor = '#C0C0C0'
const knobColor = 'black'
const connectingRodColor = 'black'
let redPoint = null;
let greenPoint = null;
let bluePoint = null;

let redPointTopView = null;
let greenPointTopView = null;
let bluePointTopView = null;

let prevAngle = 0;
let totalRotation = 0;
let dots = null;
let frontDots = null;
let isMeasuringAngle = false;
let protractor = null;
let isPanning = false;
let panStart = { x: 0, y: 0 };


const resetButton = document.getElementById('reset-button');
const measureAngleButton = document.getElementById('measure-angle-button');

let windowWidth = window.innerWidth - 60;
let windowHeight = windowWidth * 600 / 1000;

const draw = SVG().addTo('#svg-container').size(windowWidth, windowHeight);

// Change the viewport to 1000 x 600
document.getElementsByTagName('svg')[0].setAttribute('viewBox', `0 0 ${canvasWidth} ${canvasHeight}`);

// Resize the canvas width and height when the window is resized
window.addEventListener('resize', function() {
  let windowWidth = window.innerWidth - 60;
  let windowHeight = windowWidth * 600 / 1000;
  draw.size(windowWidth, windowHeight);
});

function resetCanvas() {
    resetButton.addEventListener('click', () => {
        redPoint = null;
        greenPoint = null;
        bluePoint = null;
        
        redPointTopView = null;
        greenPointTopView = null;
        bluePointTopView = null;
        
        prevAngle = 0;
        totalRotation = 0;
        knob = null;
        shaft = null;
        currentAngle = 0;
        shaftFrontView = null;
        knobFrontView = null;
        connectingRod = null;
        isDragging = false;
        isMeasuringAngle = false;
        draw.clear();
        addOptionToDragAndZoom();
        drawCanvas();
    });
    
    measureAngleButton.addEventListener('click', () => {
        isMeasuringAngle = !isMeasuringAngle;
        if (isMeasuringAngle) {
            protractor = drawProtractor(canvasWidth / 4, canvasHeight / 2, 200);
            shaftLine.show();
        } else if (protractor) {
            protractor.remove();
            shaftLine.hide();
        }
    });
}
function drawCanvas() {
    drawFrontView();
    drawTopView();
    drawPoints();
    drawHorizontalScale();
    drawVerticalScale();
}

function drawFrontView() {
    drawBottomSupport();
    drawContainer();
    drawShaft();
}

function drawTopView() {
    drawContainerTopView();
    createShaft();
    createKnob();
    createConnectingRod();
    setupDragHandlers();
}
function drawContainer() {
    draw.rect(containerWidth, containerHeight)
    .center( 3 * canvasWidth / 4, canvasHeight/2 )
    .fill('none')
    .stroke({ color: borderHexCode, width: surfaceWidth});
    
    connectingRod = draw.rect(connectingRodWidth, connectingRodHeight)
    .center(  3 * canvasWidth / 4, canvasHeight/2 - connectingRodExtraHeight)
    .fill('black')
    .stroke({ color: 'black', width: 1 });
}

function drawShaft() {
    shaftFrontView = draw.rect(shaftLength, 20)
    .move( 3 * canvasWidth / 4 - connectingRodWidth / 2, canvasHeight/2 - containerHeight / 2 - connectingRodExtraHeight)
    .fill(shaftColor)
    .stroke({ color: 'black', width: 1 });
    
    knobFrontView = draw.rect(knobWidth, knobHeight)
    .move( 3 * canvasWidth / 4 - connectingRodWidth / 2 + shaftLength - knobWidth - 10, canvasHeight/2 - containerHeight / 2 - connectingRodExtraHeight - 40)
    .fill(knobColor)
    .stroke({ color: 'black', width: 1 });
}

function drawContainerTopView() {
    draw.circle(containerWidth)
    .center( 1 * canvasWidth / 4, canvasHeight/2 )
    .fill('none')
    .stroke({ color: borderHexCode, width: surfaceWidth});
}

function drawBottomSupport() {
    draw.circle((innerMargin - 10)/3)
    .center(3 * canvasWidth / 4, canvasHeight/2 + containerHeight / 2 - 10)
    .fill('silver');
}

function createShaft() {
    shaft = draw.rect(height, width)
    .move(centerX - 10, centerY - width/2)
    .radius(cornerRadius)
    .fill(shaftColor)
    .stroke({ color: 'black', width: 1 });
    
    shaftLine = draw.line(centerX, centerY, centerX + height - 10, centerY)
    .stroke({ color: 'brown', width: 1 });
    shaftLine.hide();
    
}

function createKnob() {
    knob = draw.circle(knobWidth)
    .center(canvasWidth / 4 + shaftLength - knobWidth - 5, canvasHeight/2)
    .fill(knobColor)
    .stroke({ color: 'black', width: 1 });
}

function createConnectingRod() {
    draw.circle(connectingRodWidth)
    .center(canvasWidth / 4, canvasHeight/2)
    .fill(connectingRodColor)
    .stroke({ color: connectingRodColor, width: 1 });
    
    draw.circle(5)
    .center(canvasWidth / 4, canvasHeight/2)
    .fill("silver")
    .stroke({ color: "silver", width: 1 });
}

function setupDragHandlers() {
    knob.on('mousedown', () => {
        isDragging = true;
    });
    shaft.on('mousedown', () => {
        isDragging = true;
    });
    
    document.addEventListener('mousemove', (event) => {
        if (!isDragging) { return };
        
        const pt = draw.node.createSVGPoint();
        pt.x = event.clientX;
        pt.y = event.clientY;
        const cursor = pt.matrixTransform(draw.node.getScreenCTM().inverse());
        
        const dx = cursor.x - centerX;
        const dy = cursor.y - centerY;
        const angle = Math.atan2(dy, dx);
        const angleDeg = angle * 180 / Math.PI;
        
        knob.center(
            centerX + radius * Math.cos(angle),
            centerY + radius * Math.sin(angle)
        );
        
        shaft.rotate(angleDeg - currentAngle, centerX, centerY);
        shaftLine.rotate(angleDeg - currentAngle, centerX, centerY);
        currentAngle = angleDeg;
        updateFrontView(angleDeg);
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

function updateFrontView(angle) {
    let newShaftLength = 0;
    let newShaftMargin = 0;
    let newKnobMargin = 0;
    const fixedShaftX = 3 * canvasWidth / 4 - connectingRodWidth / 2;
    const fixedKnobX = 3 * canvasWidth / 4 - connectingRodWidth / 2 + shaftLength - knobWidth - 10
    
    const angleDeg = angle;
    if ((angle >= 0 && angle <= 90) || (angle < 0 && angle >= -90)) {
        angle = Math.abs(angle);
        newShaftLength = connectingRodWidth + (shaftLength - connectingRodWidth) * (1 - angle / 90); // Decreasing size
        newShaftMargin = fixedShaftX;
        newKnobMargin = fixedKnobX - shaftLength + knobWidth + 7.5 + (shaftLength - knobWidth - 7.5) * (1 - angle / 90);
    } else { 
        angle = Math.abs(angle);
        newShaftLength = connectingRodWidth + (shaftLength - connectingRodWidth) * ((angle - 90) / 90); // Increasing size in the opposite direction
        newShaftMargin = fixedShaftX - newShaftLength + connectingRodWidth;
        newKnobMargin = fixedKnobX - shaftLength + knobWidth + 7.5 - (shaftLength - knobWidth - 7.5) * ((angle - 90) / 90);
    }
    
    if (angleDeg >= 0) {
        // redrawConnectingRod();
        redrawShaft(newShaftLength, newShaftMargin);
        redrawKnob(newKnobMargin)
    } else {
        redrawKnob(newKnobMargin);
        // redrawConnectingRod();
        redrawShaft(newShaftLength, newShaftMargin);
    }
    updatePointsWithShaftRotation(angleDeg);
    updatePointsFrontView(angleDeg);
}

function redrawConnectingRod() {
    connectingRod.remove(); // Remove old element
    connectingRod = draw.rect(connectingRodWidth, connectingRodHeight)
    .center(  3 * canvasWidth / 4, canvasHeight/2 - connectingRodExtraHeight)
    .fill('black')
    .stroke({ color: 'black', width: 1 });
}

function redrawShaft(newShaftLength, newShaftMargin) {
    shaftFrontView.remove(); // Remove old element
    shaftFrontView = draw.rect(newShaftLength, 20) // Recreate element
    .move(newShaftMargin, canvasHeight / 2 - containerHeight / 2 - connectingRodExtraHeight)
    .fill(shaftColor)
    .stroke({ color: 'black', width: 1 });;
}

function redrawKnob(newKnobMargin) {
    knobFrontView.remove(); // Remove old element
    knobFrontView = draw.rect(knobWidth, knobHeight) // Recreate element
    .move(newKnobMargin, canvasHeight / 2 - containerHeight / 2 - connectingRodExtraHeight - 40)
    .fill(knobColor)
    .stroke({ color: 'black', width: 1 });
}

function drawPoints() {
    const radius = 5;
    redPoint = draw.circle(radius)
    .center(3 * canvasWidth / 4 + (10 / 40) * (containerWidth / 2), canvasHeight/2 - containerHeight / 2 + 0.25 * containerHeight)
    .fill('red')
    .stroke({ color: 'red', width: 1 });
    
    greenPoint = draw.circle(radius)
    .center(3 * canvasWidth / 4 + (20 / 40) * (containerWidth / 2), canvasHeight/2 - containerHeight / 2 + 0.5 * containerHeight)
    .fill('green')
    .stroke({ color: 'green', width: 1 });
    
    bluePoint = draw.circle(radius)
    .center(3 * canvasWidth / 4 + (35 / 40) * (containerWidth / 2), canvasHeight/2 - containerHeight / 2 + 0.75 * containerHeight)
    .fill('blue')
    .stroke({ color: 'blue', width: 1 });
    
    redPointTopView = draw.circle(radius)
    .center(canvasWidth / 4 + (10 / 40) * (containerWidth / 2), canvasHeight/2)
    .fill('red')
    .stroke({ color: 'red', width: 1 });
    
    greenPointTopView = draw.circle(radius)
    .center(canvasWidth / 4 + (20 / 40) * (containerWidth / 2), canvasHeight/2)
    .fill('green')
    .stroke({ color: 'green', width: 1 });
    
    bluePointTopView = draw.circle(radius)
    .center(canvasWidth / 4 + (35 / 40) * (containerWidth / 2), canvasHeight/2)
    .fill('blue')
    .stroke({ color: 'blue', width: 1 });
    
    dots = {
        red: {
            radiusFactor: 10 / 40,
            rotationFactor: (4 / 10) ** 2,
            initialAngle: null,
            effectiveAngle: null,
            path: null,
            view: redPointTopView
        },
        green: {
            radiusFactor: 20 / 40,
            rotationFactor: (4 / 20) ** 2,
            initialAngle: null,
            effectiveAngle: null,
            path: null,
            view: greenPointTopView
        },
        blue: {
            radiusFactor: 35 / 40,
            rotationFactor: (4 / 35) ** 2,
            initialAngle: null,
            effectiveAngle: null,
            path: null,
            view: bluePointTopView
        }
    };
    
    frontDots = {
        red: {
            centerX: 3 * canvasWidth / 4,
            centerY: canvasHeight / 2 - containerHeight / 2 + 0.25 * containerHeight,
            amplitude: (10 / 40) * (containerWidth / 2),
            rotationFactor: (4 / 10) ** 2,
            initialAngle: null,
            effectiveAngle: null,
            path: null,
            view: redPoint
        },
        green: {
            centerX: 3 * canvasWidth / 4,
            centerY: canvasHeight / 2 - containerHeight / 2 + 0.5 * containerHeight,
            amplitude: (20 / 40) * (containerWidth / 2),
            rotationFactor: (4 / 20) ** 2,
            initialAngle: null,
            effectiveAngle: null,
            path: null,
            view: greenPoint
        },
        blue: {
            centerX: 3 * canvasWidth / 4,
            centerY: canvasHeight / 2 - containerHeight / 2 + 0.75 * containerHeight,
            amplitude: (35 / 40) * (containerWidth / 2),
            rotationFactor: (4 / 35) ** 2,
            initialAngle: null,
            effectiveAngle: null,
            path: null,
            view: bluePoint
        }
    };
}



function generateArcPath(cx, cy, radius, startAngle, endAngle) {
    let d = "";
    const angleDiff = endAngle - startAngle;
    const steps = Math.max(Math.ceil(Math.abs(angleDiff) / 0.05), 1);
    const angleStep = angleDiff / steps;
    for (let i = 0; i <= steps; i++) {
        const angle = startAngle + i * angleStep;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }
    return d;
}

function updatePointsWithShaftRotation(newAngle) {
    if (prevAngle === null) {
        prevAngle = newAngle;
    }
    let delta = newAngle - prevAngle;
    if (delta > 180) {
        delta -= 360;
    } else if (delta < -180) {
        delta += 360;
    }
    totalRotation += delta;
    prevAngle = newAngle;
    
    const radians = totalRotation * (Math.PI / 180);
    const centerX = canvasWidth / 4;
    const centerY = canvasHeight / 2;
    
    for (let color in dots) {
        const dot = dots[color];
        const dotAngle = dot.rotationFactor * radians;
        const radius = dot.radiusFactor * (containerWidth / 2);
        if (dot.initialAngle === null) {
            dot.initialAngle = dotAngle;
            dot.effectiveAngle = dotAngle;
        } else {
            dot.effectiveAngle = dotAngle;
        }
        
        const d = generateArcPath(centerX, centerY, radius, dot.initialAngle, dot.effectiveAngle);
        if (dot.path === null) {
            dot.path = draw.path(d).fill("none").stroke({ color: color, width: 2 });
        } else {
            dot.path.plot(d);
        }
        
        const dotX = centerX + radius * Math.cos(dot.effectiveAngle);
        const dotY = centerY + radius * Math.sin(dot.effectiveAngle);
        console.log(dot.view, dot);
        dot.view.center(dotX, dotY);
    }
}

function updatePointsFrontView(newAngle) {
    if (prevAngle === null) { prevAngle = newAngle };
    let delta = newAngle - prevAngle;
    if (delta > 180) { delta -= 360 }
    else if (delta < -180) { delta += 360 };
    totalRotation += delta;
    prevAngle = newAngle;
    
    for (let color in frontDots) {
        const dot = frontDots[color];
        const currentAngle = dot.rotationFactor * totalRotation * (Math.PI / 180);
        if (dot.initialAngle === null) {
            dot.initialAngle = currentAngle;
        }
        dot.effectiveAngle = currentAngle;
        const centerX = dot.centerX;
        const y = dot.centerY;
        const steps = Math.max(Math.ceil(Math.abs(dot.effectiveAngle - dot.initialAngle) / 0.05), 1);
        const angleStep = (dot.effectiveAngle - dot.initialAngle) / steps;
        let d = "";
        for (let i = 0; i <= steps; i++) {
            const angle = dot.initialAngle + i * angleStep;
            const x = centerX + dot.amplitude * Math.cos(angle);
            d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
        }
        if (dot.path === null) {
            dot.path = draw.path(d).fill("none").stroke({ color: color, width: 2 });
        } else {
            dot.path.plot(d);
        }
        const newX = centerX + dot.amplitude * Math.cos(dot.effectiveAngle);
        dot.view.center(newX, y);
    }
}

function drawProtractor(centerX, centerY, radius) {
    // Create a group to hold all the protractor elements.
    const oneView = draw.group();
    
    // Draw the outer circle.
    oneView.circle(radius * 2)
    .center(centerX, centerY)
    .fill('none')
    .stroke({ width: 2, color: 'black' });
    
    // Draw the tick marks and angle labels.
    for (let angle = 0; angle < 360; angle++) {
        const radian = angle * (Math.PI / 180);
        const innerRadius = radius - (angle % 10 === 0 ? radius - 25 : (angle % 5 === 0 ? radius / 2 : radius / 8));
        
        const x1 = centerX + radius * Math.cos(radian);
        const y1 = centerY + radius * Math.sin(radian);
        const x2 = centerX + innerRadius * Math.cos(radian);
        const y2 = centerY + innerRadius * Math.sin(radian);
        
        oneView.line(x1, y1, x2, y2)
        .stroke({ width: 1, color: 'black' });
        
        if (angle % 10 === 0) {
            const textRadius = radius;
            const textX = centerX + textRadius * Math.cos(radian);
            const textY = centerY + textRadius * Math.sin(radian);
            
            oneView.text(angle.toString())
            .font({ size: 12, anchor: 'middle', fill: 'black' })
            .attr({
                'text-anchor': 'middle',
                'dominant-baseline': 'middle',
                // Translate to (textX, textY) then rotate about that point.
                transform: `translate(${textX}, ${textY}) rotate(${angle - 90})`
            });
        }
    }
    
    // Return the group so it can be used/manipulated later.
    return oneView;
}

function drawHorizontalScale() {
    const startX = 3/4 * canvasWidth - containerWidth / 2;
    const startY = canvasHeight / 2 + containerHeight / 2 + 25;
    const endX = 3/4 * canvasWidth + containerWidth / 2;
    const endY = canvasHeight / 2 + containerHeight / 2;
    
    const numPoints = 80;
    const step = (endX - startX) / numPoints;
    draw.rect(endX - startX + 15, 35)
    .center(startX + (endX - startX) / 2, startY - 6)
    .fill('#deb887')
    .stroke({ color: 'black', width: 1 });
    
    for (let i = 0; i <= numPoints; i++) {
        let x = startX + i * step;
        let lineHeight = i % 5 === 0 ? 20 : 10; // Longer lines for every 10th mark
        draw.line(x, startY - 23, x, startY - 23 + lineHeight).stroke({ width: 2, color: '#000' });
        
        if (i % 10 === 0) {
            draw.text(i.toString()).move(x, startY + 3).font({ size: 8, anchor: 'middle' });
        }
    }
}

function drawVerticalScale() {
    const startX = 3/4 * canvasWidth + containerWidth / 2;
    const startY = canvasHeight / 2 - containerHeight / 2;
    const endY = canvasHeight / 2 + containerHeight / 2;
    
    const numPoints = 120;
    const step = (startY - endY) / numPoints;
    draw.rect(35, endY - startY + 7.5)
    .center(startX + 20, startY + (endY - startY) / 2)
    .fill('#deb887')
    .stroke({ color: 'black', width: 1 });
    
    for (let i = 0; i <= numPoints; i++) {
        let y = startY - i * step;
        let lineHeight = i % 5 === 0 ? 20 : 10; // Longer lines for every 10th mark
        draw.line(startX + 5, y, startX + lineHeight, y).stroke({ width: 2, color: '#000' });
        
        if (i % 10 === 0) {
            draw.text(i.toString()).move(startX + lineHeight + 8, y - 2).font({ size: 8, anchor: 'middle' });
        }
    }
}

function addOptionToDragAndZoom() {
    draw.text("zoom with the scroll wheel").move(10, canvasHeight - 50).font({ size: 16, anchor: 'left' });
    draw.text("After zooming, drag mouse to move image").move(10, canvasHeight - 25).font({ size: 16, anchor: 'left' });
    const defaultViewbox = { x: 0, y: 0, width: canvasWidth, height: canvasHeight };
    draw.viewbox(defaultViewbox.x, defaultViewbox.y, defaultViewbox.width, defaultViewbox.height);
    
    const background = draw.rect(canvasWidth, canvasHeight)
    .fill({ color: '#fff', opacity: 0 });
    
    background.on('mousedown', function(event) {
        const vb = draw.viewbox();
        if (vb.width >= defaultViewbox.width) return;
        isPanning = true;
        panStart = { x: event.clientX, y: event.clientY };
    });
    
    background.on('mousemove', function(event) {
        if (!isPanning) return;
        event.preventDefault();
        
        const dx = event.clientX - panStart.x;
        const dy = event.clientY - panStart.y;
        const vb = draw.viewbox();
        
        // Only update viewbox if we’re zoomed in.
        if (vb.width < defaultViewbox.width) {
            draw.viewbox(vb.x - dx, vb.y - dy, vb.width, vb.height);
        }
        
        panStart = { x: event.clientX, y: event.clientY };
    });
    
    background.on('mouseup', function() {
        isPanning = false;
    });
    document.addEventListener('mouseup', () => { isPanning = false; });
    
    draw.on('wheel', function(event) {
        event.preventDefault();
        
        const zoomFactor = event.deltaY < 0 ? 0.9 : 1.1;
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

addOptionToDragAndZoom();
drawCanvas();
resetCanvas();
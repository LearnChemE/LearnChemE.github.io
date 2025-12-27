// U-Ti Phase Diagram Functions
// Translated from Mathematica code

// Phase diagram constants (from Mathematica code)
const pureTiU2x = 2/3;
const e1T = 655;
const e2T = 720;
const e1x = 0.28;
const e2x = 0.95;
const pureTiT = 882;
const pureUT = 770;
const pureTiU2T = 890;

// Helper functions
function slope(x1, y1, x2, y2) {
    return (y2 - y1) / (x2 - x1);
}

function intercept(x1, y1, x2, y2) {
    return (x1 * y2 - x2 * y1) / (x1 - x2);
}

function phaseBoundary(x1, y1, x2, y2, x) {
    return slope(x1, y1, x2, y2) * x + intercept(x1, y1, x2, y2);
}

function xFromT(x1, y1, x2, y2, T) {
    return (T - intercept(x1, y1, x2, y2)) / slope(x1, y1, x2, y2);
}

function lever1Amount(lever1, lever2) {
    return (lever2 / lever1) / (1 + (lever2 / lever1));
}

function lever2Amount(lever1, lever2) {
    return 1 - lever1Amount(lever1, lever2);
}

// Main drawing function for phase diagram
function drawPhaseDiagram() {
    push();
    
    // Draw main graph frame
    strokeWeight(1);
    stroke(0);
    noFill();
    rect(g.lx, g.ty, g.rx - g.lx, g.by - g.ty);
    
    // Draw phase boundaries - draw as continuous paths to ensure proper connections
    stroke(0);
    strokeWeight(2);
    noFill();
    
    // Draw complete liquidus curve as one continuous path
    beginShape();
    // pb1: Ti solid to e1 (liquidus from Ti)
    for(let x = 0; x <= e1x; x += 0.005) {
        let T = phaseBoundary(0, pureTiT, e1x, e1T, x);
        let px = map(x, 0, 1, g.lx, g.rx);
        let py = map(T, 600, 925, g.by, g.ty);
        vertex(px, py);
    }
    // Ensure e1 point is exact
    let e1px = map(e1x, 0, 1, g.lx, g.rx);
    let e1py = map(e1T, 600, 925, g.by, g.ty);
    vertex(e1px, e1py);
    
    // pb2: e1 to TiU2 (liquidus)
    for(let x = e1x; x <= pureTiU2x; x += 0.005) {
        let T = phaseBoundary(e1x, e1T, pureTiU2x, pureTiU2T, x);
        let px = map(x, 0, 1, g.lx, g.rx);
        let py = map(T, 600, 925, g.by, g.ty);
        vertex(px, py);
    }
    // Ensure TiU2 point is exact
    let TiU2px = map(pureTiU2x, 0, 1, g.lx, g.rx);
    let TiU2py = map(pureTiU2T, 600, 925, g.by, g.ty);
    vertex(TiU2px, TiU2py);
    
    // pb3: TiU2 to e2 (liquidus)
    for(let x = pureTiU2x; x <= e2x; x += 0.005) {
        let T = phaseBoundary(pureTiU2x, pureTiU2T, e2x, e2T, x);
        let px = map(x, 0, 1, g.lx, g.rx);
        let py = map(T, 600, 925, g.by, g.ty);
        vertex(px, py);
    }
    // Ensure e2 point is exact
    let e2px = map(e2x, 0, 1, g.lx, g.rx);
    let e2py = map(e2T, 600, 925, g.by, g.ty);
    vertex(e2px, e2py);
    
    // pb4: e2 to U solid (liquidus from U)
    for(let x = e2x; x <= 1; x += 0.005) {
        let T = phaseBoundary(e2x, e2T, 1, pureUT, x);
        let px = map(x, 0, 1, g.lx, g.rx);
        let py = map(T, 600, 925, g.by, g.ty);
        vertex(px, py);
    }
    endShape();
    
    // pb5: Horizontal line at e1T from Ti to TiU2 - ensuring exact connection
    strokeWeight(2);
    line(g.lx, e1py, TiU2px, e1py);
    
    // pb6: Horizontal line at e2T from TiU2 to U - ensuring exact connection
    line(TiU2px, e2py, g.rx, e2py);
    
    // pb7: Vertical line from bottom to TiU2 compound point - ensuring exact connection
    line(TiU2px, g.by, TiU2px, TiU2py);
    
    // Draw axis labels and tick marks
    drawAxes();
    
    // Title above the phase diagram
    push();
    noStroke();
    fill(0);
    textSize(16);
    textAlign(CENTER, BASELINE);
    text("phase diagram", (g.lx + g.rx) / 2, g.ty - 15);
    pop();
    
    pop();
}

function drawAxes() {
    push();
    
    // Y-axis (temperature) - major tick marks and labels from 600 to 925
    strokeWeight(1);
    stroke(0);
    let yLabels = ['600', '650', '700', '750', '800', '850', '900'];
    for(let i = 0; i <= 6; i++) {
        let T = 600 + i * 50;
        let y = map(T, 600, 925, g.by, g.ty);
        line(g.lx, y, g.lx + 7, y);
        line(g.rx, y, g.rx - 7, y);
        
        push();
        noStroke();
        fill(0);
        textSize(14);
        textAlign(RIGHT, CENTER);
        text(yLabels[i], g.lx - 5, y);  // Reduced from -10 to -5
        pop();
    }
    
    // Y-axis minor ticks (4 between each major tick = every 10°C)
    strokeWeight(0.5);
    for(let T = 600; T <= 925; T += 10) {
        if(T % 50 !== 0) { // Skip major ticks
            let y = map(T, 600, 925, g.by, g.ty);
            line(g.lx, y, g.lx + 4, y);
            line(g.rx, y, g.rx - 4, y);
        }
    }
    
    // X-axis (mole fraction) - major tick marks and labels
    strokeWeight(1);
    let xLabels = ['0.0', '0.2', '0.4', '0.6', '0.8', '1.0'];
    for(let i = 0; i <= 5; i++) {
        let x = i * 0.2;
        let px = map(x, 0, 1, g.lx, g.rx);
        line(px, g.by, px, g.by - 7);
        line(px, g.ty, px, g.ty + 7);
        
        push();
        noStroke();
        fill(0);
        textSize(14);
        textAlign(CENTER, TOP);
        text(xLabels[i], px, g.by + 5);  // Reduced from +10 to +5
        pop();
    }
    
    // X-axis minor ticks (3 between each major tick)
    strokeWeight(0.5);
    for(let i = 0; i <= 5; i++) {
        for(let j = 1; j <= 3; j++) {
            let x = i * 0.2 + j * 0.05;
            if(x <= 1.0) {
                let px = map(x, 0, 1, g.lx, g.rx);
                line(px, g.by, px, g.by - 4);
                line(px, g.ty, px, g.ty + 4);
            }
        }
    }
    
    pop();
    
    // Axis labels (draw after pop to ensure they're on top)
    push();
    noStroke();
    fill(0);
    textSize(18);
    textAlign(CENTER, BASELINE);
    // Draw "mole fraction uranium x" and subscript "U"
    let xPos = (g.lx + g.rx) / 2;
    let yPos = g.by + 40;  // Adjusted from 45 to 40
    text('mole fraction uranium x', xPos - 5, yPos);
    textSize(14);
    textAlign(LEFT, BASELINE);
    text('U', xPos + 88, yPos + 8);  // Subscript: positioned lower for proper subscript appearance
    pop();
    
    push();
    noStroke();
    fill(0);
    textSize(18);
    translate(g.lx - 40, (g.ty + g.by) / 2);  // Moved right from -50 to -40
    rotate(-PI / 2);
    textAlign(CENTER, BASELINE);
    text('temperature (°C)', 0, 0);
    pop();
}

function drawPhasePoint() {
    let px = map(g.pointX, 0, 1, g.lx, g.rx);
    let py = map(g.pointT, 600, 925, g.by, g.ty);
    
    // Determine which phase region the point is in and draw accordingly
    let phaseInfo = determinePhaseRegion(g.pointX, g.pointT);
    
    push();
    
    // Draw tie lines and phase points based on region
    if(phaseInfo.type === "two-phase") {
        // Draw dashed tie line
        drawingContext.setLineDash([5, 5]);
        strokeWeight(2);
        
        if(phaseInfo.phase1 === "Ti") {
            stroke(g.solidTi);
            let x1 = map(0, 0, 1, g.lx, g.rx);
            let y1 = map(g.pointT, 600, 925, g.by, g.ty);
            line(x1, y1, px, py);
            
            // Dotted line down from Ti
            drawingContext.setLineDash([2, 6]);
            strokeWeight(1.5);
            line(x1, y1, x1, g.by);
            
            // Draw Ti point
            noStroke();
            fill(g.solidTi);
            ellipse(x1, y1, 2 * g.radius);
        }
        
        if(phaseInfo.phase1 === "TiU2" || phaseInfo.phase2 === "TiU2") {
            drawingContext.setLineDash([5, 5]);
            strokeWeight(2);
            stroke(g.solidTiU2);
            let x2 = map(pureTiU2x, 0, 1, g.lx, g.rx);
            let y2 = map(g.pointT, 600, 925, g.by, g.ty);
            line(px, py, x2, y2);
            
            // Dotted line down from TiU2
            drawingContext.setLineDash([2, 6]);
            strokeWeight(1.5);
            line(x2, y2, x2, g.by);
            
            // Draw TiU2 point
            noStroke();
            fill(g.solidTiU2);
            ellipse(x2, y2, 2 * g.radius);
        }
        
        if(phaseInfo.phase2 === "U") {
            drawingContext.setLineDash([5, 5]);
            strokeWeight(2);
            stroke(g.solidU);
            let x2 = map(1, 0, 1, g.lx, g.rx);
            let y2 = map(g.pointT, 600, 925, g.by, g.ty);
            line(px, py, x2, y2);
            
            // Dotted line down from U
            drawingContext.setLineDash([2, 6]);
            strokeWeight(1.5);
            line(x2, y2, x2, g.by);
            
            // Draw U point
            noStroke();
            fill(g.solidU);
            ellipse(x2, y2, 2 * g.radius);
        }
        
        if(phaseInfo.phase1 === "Liquid" || phaseInfo.phase2 === "Liquid") {
            drawingContext.setLineDash([5, 5]);
            strokeWeight(2);
            stroke(g.liquid);
            let x1 = map(phaseInfo.liquidX, 0, 1, g.lx, g.rx);
            let y1 = map(g.pointT, 600, 925, g.by, g.ty);
            line(x1, y1, px, py);
            
            // Dotted line down
            drawingContext.setLineDash([2, 6]);
            strokeWeight(1.5);
            line(x1, y1, x1, g.by);
            
            // Draw liquid point
            noStroke();
            fill(g.liquid);
            ellipse(x1, y1, 2 * g.radius);
        }
    }
    
    // Draw main point
    noStroke();
    if(phaseInfo.type === "single-phase") {
        if(phaseInfo.phase1 === "Liquid") {
            fill(g.pointColor);  // Dark purple for liquid
        } else if(phaseInfo.phase1 === "Ti") {
            fill(g.solidTi);
        } else if(phaseInfo.phase1 === "TiU2") {
            fill(g.solidTiU2);
        } else if(phaseInfo.phase1 === "U") {
            fill(g.solidU);
        }
    } else {
        fill(g.pointColor); // Dark purple for two-phase
    }
    ellipse(px, py, 2 * g.radius);
    
    // Draw vertical dotted line only for single-phase liquid region
    if(phaseInfo.type === "single-phase" && phaseInfo.phase1 === "Liquid") {
        drawingContext.setLineDash([2, 6]);
        strokeWeight(1.5);
        stroke(g.pointColor);  // Dark purple
        line(px, py, px, g.by);
    }
    
    pop();
}

function determinePhaseRegion(x, T) {
    // Determine which phase region the point is in
    
    // Check pure components first
    if(x === 0) {
        return {type: "single-phase", phase1: "Ti"};
    }
    if(x === 1) {
        return {type: "single-phase", phase1: "U"};
    }
    
    // Check if in left region (x < pureTiU2x)
    if(x < pureTiU2x) {
        if(T < e1T) {
            // Two-phase: Ti(s) + TiU2(s)
            return {type: "two-phase", phase1: "Ti", phase2: "TiU2"};
        } else {
            // Above eutectic
            if(x < e1x) {
                // Check if above liquidus
                let liquidusT = phaseBoundary(0, pureTiT, e1x, e1T, x);
                if(T >= liquidusT) {
                    // Liquid region
                    return {type: "single-phase", phase1: "Liquid"};
                } else {
                    // Two-phase: Ti(s) + Liquid
                    let liquidX = xFromT(0, pureTiT, e1x, e1T, T);
                    return {type: "two-phase", phase1: "Ti", phase2: "Liquid", liquidX: liquidX};
                }
            } else {
                // x >= e1x
                let liquidusT = phaseBoundary(e1x, e1T, pureTiU2x, pureTiU2T, x);
                if(T >= liquidusT) {
                    // Liquid region
                    return {type: "single-phase", phase1: "Liquid"};
                } else {
                    // Two-phase: Liquid + TiU2(s)
                    let liquidX = xFromT(e1x, e1T, pureTiU2x, pureTiU2T, T);
                    return {type: "two-phase", phase1: "Liquid", phase2: "TiU2", liquidX: liquidX};
                }
            }
        }
    }
    
    // Check if in right region (x >= pureTiU2x)
    if(x >= pureTiU2x) {
        if(T < e2T) {
            // Two-phase: TiU2(s) + U(s)
            return {type: "two-phase", phase1: "TiU2", phase2: "U"};
        } else {
            // Above eutectic
            if(x < e2x) {
                let liquidusT = phaseBoundary(pureTiU2x, pureTiU2T, e2x, e2T, x);
                if(T >= liquidusT) {
                    // Liquid region
                    return {type: "single-phase", phase1: "Liquid"};
                } else {
                    // Two-phase: TiU2(s) + Liquid
                    let liquidX = xFromT(pureTiU2x, pureTiU2T, e2x, e2T, T);
                    return {type: "two-phase", phase1: "TiU2", phase2: "Liquid", liquidX: liquidX};
                }
            } else {
                // x >= e2x
                let liquidusT = phaseBoundary(e2x, e2T, 1, pureUT, x);
                if(T >= liquidusT) {
                    // Liquid region
                    return {type: "single-phase", phase1: "Liquid"};
                } else {
                    // Two-phase: Liquid + U(s)
                    let liquidX = xFromT(e2x, e2T, 1, pureUT, T);
                    return {type: "two-phase", phase1: "Liquid", phase2: "U", liquidX: liquidX};
                }
            }
        }
    }
    
    return {type: "single-phase", phase1: "Liquid"};
}

function drawBarChart() {
    // Calculate phase amounts
    let phaseAmounts = calculatePhaseAmounts(g.pointX, g.pointT);
    
    // Bar chart position (right side)
    let barX = g.rx + 40;  // Left edge of bar chart
    let barY = g.by;
    let barGap = 5;  // Small gap between bars
    let barWidth = 35;  // Width of each bar
    let barHeight = 450;  // Height matches phase diagram
    let frameWidth = barWidth * 4 + barGap * 3;  // 4 bars + 3 gaps = 155
    
    push();
    
    // Draw frame
    strokeWeight(1);
    stroke(0);
    noFill();
    rect(barX, barY - barHeight, frameWidth, barHeight);
    
    // Draw bars - positioned to fit perfectly within frame with equal gaps
    strokeWeight(0.5);
    
    // Liquid (pinkish)
    fill(g.liquid);
    rect(barX, barY, barWidth, -phaseAmounts.liquid * barHeight);
    
    // Ti(s) (darker blue)
    fill(g.solidTi);
    rect(barX + barWidth + barGap, barY, barWidth, -phaseAmounts.Ti * barHeight);
    
    // TiU2(s) (darker green)
    fill(g.solidTiU2);
    rect(barX + 2 * (barWidth + barGap), barY, barWidth, -phaseAmounts.TiU2 * barHeight);
    
    // U(s) (brown)
    fill(g.solidU);
    rect(barX + 3 * (barWidth + barGap), barY, barWidth, -phaseAmounts.U * barHeight);
    
    // Y-axis major tick marks and labels
    strokeWeight(1);
    stroke(0);
    noFill();
    for(let i = 0; i <= 5; i++) {
        let val = i * 0.2;
        let y = barY - val * barHeight;
        // Major tick marks
        line(barX, y, barX - 7, y);
        line(barX + frameWidth, y, barX + frameWidth + 7, y);
    }
    
    // Y-axis minor tick marks (3 between each major)
    strokeWeight(0.5);
    for(let i = 0; i < 5; i++) {
        for(let j = 1; j <= 3; j++) {
            let val = i * 0.2 + j * 0.05;
            let y = barY - val * barHeight;
            line(barX, y, barX - 4, y);
            line(barX + frameWidth, y, barX + frameWidth + 4, y);
        }
    }
    
    // Y-axis labels
    noStroke();
    fill(0);
    textSize(13);  // Increased from 11 to 13
    textAlign(RIGHT, CENTER);
    for(let i = 0; i <= 5; i++) {
        let val = i * 0.2;
        let y = barY - val * barHeight;
        text(val.toFixed(1), barX - 10, y);
    }
    
    // Title - aligned with phase diagram title
    push();
    noStroke();
    fill(0);
    textSize(16);
    textAlign(CENTER, BASELINE);
    text("relative amounts", barX + frameWidth / 2, g.ty - 15);
    pop();
    
    // Labels below bars - vertical (rotated 90 degrees, reading downward from axis)
    textSize(16);  // Increased from 13 to 15
    textAlign(LEFT, CENTER);  // LEFT alignment so text extends downward after rotation
    
    // Liquid label
    push();
    translate(barX + barWidth / 2, barY + 50);
    rotate(-PI / 2);
    text("liquid", 0, 0);
    pop();
    
    // Ti(s) label - split into Ti and subscript (s)
    push();
    translate(barX + barWidth + barGap + barWidth / 2, barY + 40);
    rotate(-PI / 2);
    textSize(16);
    textAlign(LEFT, CENTER);
    text("Ti", 0, 0);
    textSize(14);
    textAlign(LEFT, TOP);
    text("(s)", 14, 2);  // Subscript: x moves along text direction, y moves perpendicular (subscript shift)
    pop();
    
    // TiU₂(s) label - split into TiU₂ and subscript (s)
    push();
    translate(barX + 2 * (barWidth + barGap) + barWidth / 2, barY + 60);
    rotate(-PI / 2);
    textSize(16);
    textAlign(LEFT, CENTER);
    text("TiU₂", 0, 0);
    textSize(14);
    textAlign(LEFT, TOP);
    text("(s)", 33, 2);  // Subscript: x moves along text direction, y moves perpendicular (subscript shift)
    pop();
    
    // U label (removed (s))
    push();
    translate(barX + 3 * (barWidth + barGap) + barWidth / 2, barY + 25);
    rotate(-PI / 2);
    text("U", 0, 0);
    pop();
    
    // Display liquid composition on top of liquid bar if present
    if(phaseAmounts.liquid > 0 && phaseAmounts.liquidComp !== undefined) {
        let liquidBarTop = barY - phaseAmounts.liquid * barHeight;
        // Constrain position to never go above bar chart top edge
        let labelY = Math.max(liquidBarTop - 8, barY - barHeight + 18);
        // Position to the left of bar center
        let labelX = barX + barWidth / 2 - 10;
        textSize(14);
        textAlign(CENTER, BASELINE);
        // Draw "x" and subscript "U" with "= value"
        text("x", labelX, labelY);
        textSize(11);
        textAlign(LEFT, BASELINE);
        text("U", labelX + 4, labelY + 4);
        textSize(14);
        text(" = " + phaseAmounts.liquidComp.toFixed(2), labelX + 10, labelY);
    }
    
    pop();
}

function calculatePhaseAmounts(x, T) {
    let amounts = {
        liquid: 0,
        Ti: 0,
        TiU2: 0,
        U: 0,
        liquidComp: undefined
    };
    
    let phaseInfo = determinePhaseRegion(x, T);
    
    if(phaseInfo.type === "single-phase") {
        if(phaseInfo.phase1 === "Liquid") {
            amounts.liquid = 1;
            amounts.liquidComp = x;
        } else if(phaseInfo.phase1 === "Ti") {
            amounts.Ti = 1;
        } else if(phaseInfo.phase1 === "TiU2") {
            amounts.TiU2 = 1;
        } else if(phaseInfo.phase1 === "U") {
            amounts.U = 1;
        }
    } else if(phaseInfo.type === "two-phase") {
        // Apply lever rule
        if(phaseInfo.phase1 === "Ti" && phaseInfo.phase2 === "TiU2") {
            let lever1 = Math.abs(0 - x);
            let lever2 = Math.abs(x - pureTiU2x);
            amounts.Ti = lever1Amount(lever1, lever2);
            amounts.TiU2 = lever2Amount(lever1, lever2);
        } else if(phaseInfo.phase1 === "TiU2" && phaseInfo.phase2 === "U") {
            let lever1 = Math.abs(pureTiU2x - x);
            let lever2 = Math.abs(x - 1);
            amounts.TiU2 = lever1Amount(lever1, lever2);
            amounts.U = lever2Amount(lever1, lever2);
        } else if(phaseInfo.phase1 === "Ti" && phaseInfo.phase2 === "Liquid") {
            let lever1 = Math.abs(0 - x);
            let lever2 = Math.abs(x - phaseInfo.liquidX);
            amounts.Ti = lever1Amount(lever1, lever2);
            amounts.liquid = lever2Amount(lever1, lever2);
            amounts.liquidComp = phaseInfo.liquidX;
        } else if(phaseInfo.phase1 === "Liquid" && phaseInfo.phase2 === "TiU2") {
            let lever1 = Math.abs(phaseInfo.liquidX - x);
            let lever2 = Math.abs(x - pureTiU2x);
            amounts.liquid = lever1Amount(lever1, lever2);
            amounts.TiU2 = lever2Amount(lever1, lever2);
            amounts.liquidComp = phaseInfo.liquidX;
        } else if(phaseInfo.phase1 === "TiU2" && phaseInfo.phase2 === "Liquid") {
            let lever1 = Math.abs(pureTiU2x - x);
            let lever2 = Math.abs(x - phaseInfo.liquidX);
            amounts.TiU2 = lever1Amount(lever1, lever2);
            amounts.liquid = lever2Amount(lever1, lever2);
            amounts.liquidComp = phaseInfo.liquidX;
        } else if(phaseInfo.phase1 === "Liquid" && phaseInfo.phase2 === "U") {
            let lever1 = Math.abs(phaseInfo.liquidX - x);
            let lever2 = Math.abs(x - 1);
            amounts.liquid = lever1Amount(lever1, lever2);
            amounts.U = lever2Amount(lever1, lever2);
            amounts.liquidComp = phaseInfo.liquidX;
        }
    }
    
    return amounts;
}

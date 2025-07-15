export function drawAll() {

    const marginX = 4;
    const boxWidth = width - 2 * marginX;
    const boxHeight = height / 2.7;
    const centerX = marginX + boxWidth / 2;
    const centerY1 = 1 + boxHeight / 2;
    const centerY2 = boxHeight + 3 + boxHeight / 2;
    const h = 37;
    const arrowHeadSize = 2
    const inletArrowLength = 20;
    const outletArrowLength = 20;
    const arrowOffsetFromTrapezium = 13.5;

    const type = window.state.mode || "compressor"; // fallback

    // Box 1 - Top
    stroke(0);
    noFill();
    rect(marginX, 1, boxWidth, boxHeight);
    fill(0);
    noStroke();

    drawTurbineTrapezium(
        (boxWidth / 2) - marginX - 5,               // center X
        3 + boxHeight / 2, // centered Y within box
        `η₁ = ${window.state.eta1}`,
        "#99f0e0",
        type
    );

    drawArrow(centerX - inletArrowLength - arrowOffsetFromTrapezium, centerY1, inletArrowLength, arrowHeadSize);
    drawArrow(centerX + 10.5 + arrowOffsetFromTrapezium, centerY1, outletArrowLength, arrowHeadSize);


    // Inlet labels
    textSize(4);
    textAlign(RIGHT);
    text(`Pₙ = ${window.state.P_in} bar`, centerX - 25, centerY1 - 6);
    text(`Tₙ = ${window.state.T_in} K`, centerX - 25, centerY1 + 8);

    // Outlet labels
    textAlign(LEFT);
    text(`Pₒᵤₜ = ${window.state.P_out_1} bar`, centerX + 35, centerY1 - 6);
    text(`Tₒᵤₜ = ${window.state.T_out_1} K`, centerX + 35, centerY1 + 8);

    // Box 2 - Bottom
    stroke(0);
    noFill();
    strokeWeight(0.3);
    rect(marginX, boxHeight + 3, boxWidth, boxHeight);
    fill(0);
    noStroke();

    drawTurbineTrapezium(
        (boxWidth / 2) - marginX - 5,                       // center X
        2 + boxHeight + 3 + boxHeight / 2, // centered Y in bottom box
        `η₂ = ${window.state.eta2}`,
        "#66f080",
        type
    );
    text(`W = ${(window.state.W_1).toFixed(1)} kJ`, centerX - 6, centerY1 - h / 2 + 2);

    // Arrows
    drawArrow(centerX - inletArrowLength - arrowOffsetFromTrapezium, centerY2, inletArrowLength, arrowHeadSize);
    drawArrow(centerX + 10.5 + arrowOffsetFromTrapezium, centerY2, outletArrowLength, arrowHeadSize);

    // Inlet labels
    textSize(4);
    textAlign(RIGHT);
    text(`Pₙ = ${window.state.P_in} bar`, centerX - 25, centerY2 - 6);
    text(`Tₙ = ${window.state.T_in} K`, centerX - 25, centerY2 + 8);

    // Outlet labels
    textAlign(LEFT);
    text(`Pₒᵤₜ = ${window.state.P_out_2} bar`, centerX + 35, centerY2 - 6);
    text(`Tₒᵤₜ = ${window.state.T_out_2} K`, centerX + 35, centerY2 + 8);

    // Work output label (only on bottom box)
    textAlign(CENTER);
    text(`W = ${(window.state.W_2).toFixed(1)} kJ`, centerX + 5, centerY2 - h / 2 + 3);
}

function drawTurbineTrapezium(x, y, etaLabel, fillColor, type) {
    const topW = 17;
    const bottomW = 37;
    const h = 37;

    push();
    translate(x, y);
    rotate(-HALF_PI);

    stroke(0)
    strokeWeight(0.5);
    fill(fillColor);
    beginShape();

    if (type === "turbine") {
        vertex(-topW / 2, 0);
        vertex(topW / 2, 0);
        vertex(bottomW / 2, h);
        vertex(-bottomW / 2, h);

    } else if (type === "compressor") {
        vertex(-bottomW / 2, 0);
        vertex(bottomW / 2, 0);
        vertex(topW / 2, h);
        vertex(-topW / 2, h);
    }

    endShape(CLOSE);

    // Draw text
    rotate(HALF_PI);
    fill(0);
    noStroke();
    textSize(4);
    textAlign(CENTER);
    text(type, 15, -h / 2 + 18);
    text(etaLabel, 15, -h / 2 + 23);
    pop();
}

function drawArrow(x, y, length, headSize) {
    push();
    translate(x, y);
    stroke(0);
    strokeWeight(0.5);
    fill(0);
    // Arrow shaft
    line(0, 0, length - headSize, 0);
    // Arrowhead
    triangle(length, 0, length - headSize, -headSize / 2, length - headSize, headSize / 2);
    pop();
}

import { clausius } from './calcs.js';

export function drawAll() {
  drawControlBar();
  drawGraphBar();
  // Draw canvas popup menu if state.showMenu is true
  if (window.state.showMenu) {
    drawCanvasMenu();
  }
  // Draw dropdown options as overlay if open
  if (window.state.showDropdown) {
    drawDropdownOptionsOverlay();
  }
}

function drawControlBar() {
  // Draw a control bar at the top of the canvas
  const barHeight = 8;
  const margin = 2; // Space between bar and canvas border
  
  // Remove the background bar with margins in control bar
  // fill(250, 250, 250);
  // stroke(0);
  // strokeWeight(0.4);
  // rect(margin, margin, state.canvasSize[0] - 2 * margin, barHeight, 0);
  
  // Dropdown options
  const dropdownOptions = ["fugacity versus temperature", "fugacity versus pressure"];
  const selectedOption = window.state.dropdownSelection;

  // Set slider label and value range based on dropdown
  let sliderLabel, sliderDisplay, sliderMin, sliderMax, sliderValueDisplay;
  if (selectedOption === 0) {
    sliderLabel = "pressure (MPa)";
    sliderMin = 0.2;
    sliderMax = 1.5;
    const value = sliderMin + (sliderMax - sliderMin) * window.state.sliderValue;
    sliderDisplay = value.toFixed(2);
    sliderValueDisplay = value;
  } else {
    // Fugacity versus pressure mode
    if (window.state.realGasChecked) {
      sliderLabel = "temperature (K)";
      sliderMin = 350;
      sliderMax = 385;
    } else {
      sliderLabel = "temperature (K)";
      sliderMin = 350;
      sliderMax = 400;
    }
    // Snap to nearest integer temperature
    const value = Math.round(sliderMin + (sliderMax - sliderMin) * window.state.sliderValue);
    sliderDisplay = value;
    sliderValueDisplay = value;
    // Optionally, update the sliderValue to match the snapped value (if you want the handle to snap)
    // window.state.sliderValue = (value - sliderMin) / (sliderMax - sliderMin);
  }

  // Draw slider control
  drawSlider(margin + 26, margin + barHeight / 2, 28, window.state.sliderValue, sliderLabel, sliderDisplay);

  // Draw dropdown next to the value, vertically centered
  const dropdownX = margin + 20 + 25 + 10 + 12;
  drawDropdown(dropdownX, margin + barHeight / 2, dropdownOptions[selectedOption], dropdownOptions);

  // Draw checkbox only for 'fugacity versus pressure'
  if (selectedOption === 1) {
    const checkboxX = margin + 20 + 25 + 10 + 12 + 34 + 6; // moved 10 units further right
    const checkboxY = margin + barHeight / 2;
    drawCheckbox(checkboxX, checkboxY, 2.6, window.state.realGasChecked, "real gas");
  }

  // Draw a right-aligned hamburger icon
  const iconSize = 5.5;
  const iconMargin = 4;
  const iconX = state.canvasSize[0] - margin - iconSize - iconMargin;
  const iconY = margin + (barHeight - iconSize) / 2;

  // Icon background with sky blue fill and black outline
  fill(135, 206, 235); // sky blue
  stroke(0); // black outline
  strokeWeight(0.3);
  rect(iconX, iconY, iconSize, iconSize, 1);

  // Hamburger lines (spread out more)
  stroke(30);
  strokeWeight(0.4);
  const linePaddingX = 1;
  const lineStartX = iconX + linePaddingX;
  const lineEndX = iconX + iconSize - linePaddingX;
  // Spread lines more: use 1.2px from top, center, and 1.2px from bottom
  const lineYs = [
    iconY + 1.4,
    iconY + iconSize / 2,
    iconY + iconSize - 1.4
  ];
  for (let i = 0; i < 3; i++) {
    line(lineStartX, lineYs[i], lineEndX, lineYs[i]);
  }

  // Store icon bounds globally for click detection
  window.hamburgerIconBounds = {
    x: iconX,
    y: iconY,
    w: iconSize,
    h: iconSize
  };
}

function drawSlider(x, y, width, value, label, displayValue) {
  // Draw label on the left edge of the control bar (unchanged)
  fill(50, 50, 50);
  noStroke();
  textSize(3.0);
  textAlign(LEFT, CENTER);
  text(label, 4, y);

  // Draw slider track (rounded, light gray, thinner)
  const trackHeight = 0.8;
  stroke(180);
  strokeWeight(trackHeight);
  strokeCap(ROUND);
  line(x, y, x + width, y);
  noStroke();

  // Draw slider handle (light green ball, no border)
  const handleX = x + (value * width);
  const handleRadius = 1.4;
  fill('#1DCD9F'); // light green
  ellipse(handleX, y, handleRadius * 2, handleRadius * 2);

  // Draw value on the right (restored)
  fill(50, 50, 50);
  noStroke();
  textSize(2.8);
  textAlign(RIGHT, CENTER);
  text(displayValue, x + width + 7.5, y);

  // Store slider bounds for interaction
  window.sliderBounds = {
    x: x,
    y: y - trackHeight / 2,
    width: width,
    height: trackHeight + handleRadius,
    value: value
  };
}

function drawDropdown(x, y, selectedText, options) {
  // Make dropdown wider for full text
  const dropdownWidth = 34;
  fill(255);
  stroke(0);
  strokeWeight(0.3);
  rect(x, y - 2, dropdownWidth, 4, 1);
  
  // Draw selected text (smaller)
  fill(50, 50, 50);
  noStroke();
  textSize(2.2);
  textAlign(LEFT, CENTER);
  text(selectedText, x + 2, y);
  
  // Draw modern chevron arrow (downward '>' shape)
  const arrowCenterX = x + dropdownWidth - 2.5;
  const arrowCenterY = y + 0.1;
  const chevronSize = 1.2;
  stroke(40);
  strokeWeight(0.4);
  noFill();
  // Draw two lines to form a downward chevron
  line(arrowCenterX - chevronSize, arrowCenterY - chevronSize/2, arrowCenterX, arrowCenterY + chevronSize/2);
  line(arrowCenterX, arrowCenterY + chevronSize/2, arrowCenterX + chevronSize, arrowCenterY - chevronSize/2);
  noStroke();
  
  // Store dropdown bounds for interaction
  window.dropdownBounds = {
    x: x,
    y: y - 2,
    width: dropdownWidth,
    height: 4,
    options: options
  };
}

function drawDropdownOptionsOverlay() {
  // Draw dropdown options as a popup overlay above all
  if (!window.dropdownBounds) return;
  const { x, y, width, height, options } = window.dropdownBounds;
  fill(255);
  stroke(0);
  strokeWeight(0.3);
  // Reduce the vertical gap between box and options
  rect(x, y + height - 4, width, options.length * 4, 1);
  window.dropdownOptionBounds = [];
  for (let i = 0; i < options.length; i++) {
    const optionY = y + height - 4 + i * 4 + 2;
    // Hover effect: highlight if mouse is over this option
    const isHover = window.mX >= x && window.mX <= x + width && window.mY >= optionY - 2 && window.mY <= optionY + 2;
    if (isHover) {
      fill(220, 235, 255); // light blue highlight
      noStroke();
      rect(x + 0.5, optionY - 1.6, width - 1, 3.2, 1);
    }
    fill(50, 50, 50);
    noStroke();
    textSize(2.2);
    textAlign(LEFT, CENTER);
    text(options[i], x + 2, optionY);
    window.dropdownOptionBounds[i] = {
      x: x,
      y: optionY - 2,
      width: width,
      height: 4,
      index: i
    };
  }
}

function drawGraphBar() {
  // Draw a graph bar below the control bar
  const controlBarHeight = 8;
  const graphBarHeight = 107;
  const margin = 2;
  const graphBarY = margin + controlBarHeight + 1; // Position below control bar with 1px gap
  
  // Remove the background bar with margins in graph bar
  // fill(250, 250, 250); // Slightly darker than control bar
  // stroke(0);
  // strokeWeight(0.4);
  // rect(margin, graphBarY, state.canvasSize[0] - 2 * margin, graphBarHeight, 0);
  
  // Remove the 'Graph' text
  // Center the axes box in the graph section
  // Move axes box a little towards the upper right
  const axesWidth = 120;
  const axesHeight = 90;
  const axesX = margin + (state.canvasSize[0] - 2 * margin - axesWidth) * 0.75;
  const axesY = graphBarY + (graphBarHeight - axesHeight) * 0.35;
  // Fill axes box with white
  fill(255);
  noStroke();
  rect(axesX, axesY, axesWidth, axesHeight);
  // Draw axes border
  noFill();
  stroke(0);
  strokeWeight(0.3);
  rect(axesX, axesY, axesWidth, axesHeight);

  // Draw vertical label to the left of the axes, dynamic units
  const isPressure = window.state.dropdownSelection === 1;
  const fugacityLabel = isPressure ? "fugacity (MPa)" : "fugacity (MPa)";
  push();
  textSize(4.0); // reduced label size
  fill(30);
  noStroke(); // ensure not bold
  textAlign(CENTER, CENTER);
  translate(axesX - 12, axesY + axesHeight / 2); // moved further left
  rotate(-HALF_PI);
  text(fugacityLabel, 0, 0);
  pop();

  // Draw horizontal label below the axes, dynamic units
  const axisLabel = isPressure ? "pressure (MPa)" : "temperature (K)";
  textSize (4.0); // reduced label size
  fill(30);
  noStroke(); // ensure not bold
  textAlign(CENTER, CENTER);
  text(axisLabel, axesX + axesWidth / 2, axesY + axesHeight+7);

  // Draw axes ticks and labels for 'fugacity versus pressure'
  if (isPressure) {
    const { Pvals, fugacityVapor, fugacityLiquid, Psat, realGas } = window.state.fugacityPressureGraph;
    const isIdealGas = realGas === false;
    const isRealGas = realGas === true;
    // Y-axis (fugacity) always 0.0 to 0.3 MPa
    const minValY = 0.0;
    const maxValY = (isIdealGas || isRealGas) ? 3.0 : 0.3;
    const nTicksY = 7;
    const nMinorY = 4;
    // X-axis (pressure) range and ticks
    let minValX, maxValX, nTicksX, nMinorX;
    if (isIdealGas) {
      minValX = 0.0;
      maxValX = 3.0;
      nTicksX = 7;
      nMinorX = 4;
    } else if (isRealGas) {
      minValX = 0.0;
      maxValX = 3.0;
      nTicksX = 7;
      nMinorX = 4;
    } else {
      minValX = 0.0;
      maxValX = 3.0;
      nTicksX = 7;
      nMinorX = 4;
    }
    textSize(3.4); // increased tick number size
    fill(30);
    // Y axis (fugacity) major ticks and labels
    textAlign(RIGHT, CENTER);
    for (let i = 0; i < nTicksY; i++) {
      const frac = i / (nTicksY - 1);
      const y = axesY + axesHeight - frac * axesHeight;
      const val = (minValY + frac * (maxValY - minValY)).toFixed(1);
      // Left major tick
      stroke(0);
      strokeWeight(0.1);
      line(axesX, y, axesX + 3, y);
      // Right major tick
      line(axesX + axesWidth - 3, y, axesX + axesWidth, y);
      // Left label (only left)
      noStroke();
      text(val, axesX - 1, y);
      // Minor ticks (skip after last major)
      if (i < nTicksY - 1) {
        for (let j = 1; j <= nMinorY; j++) {
          const minorFrac = (i + j / (nMinorY + 1)) / (nTicksY - 1);
          const yMinor = axesY + axesHeight - minorFrac * axesHeight;
          stroke(0);
          strokeWeight(0.1);
          // Left minor
          line(axesX, yMinor, axesX + 1.5, yMinor);
          // Right minor
          line(axesX + axesWidth - 1.5, yMinor, axesX + axesWidth, yMinor);
        }
      }
    }
    // X axis (pressure) major ticks and labels
    textAlign(CENTER, TOP);
    for (let i = 0; i < nTicksX; i++) {
      const frac = i / (nTicksX - 1);
      const x = axesX + frac * axesWidth;
      const val = (minValX + frac * (maxValX - minValX)).toFixed(1);
      // Bottom major tick
      stroke(0);
      strokeWeight(0.1);
      line(x, axesY + axesHeight, x, axesY + axesHeight - 3);
      // Top major tick
      line(x, axesY + 3, x, axesY);
      // Bottom label (only bottom)
      noStroke();
      text(val, x, axesY + axesHeight + 1);
      // Minor ticks (skip after last major)
      if (i < nTicksX - 1) {
        for (let j = 1; j <= nMinorX; j++) {
          const minorFrac = (i + j / (nMinorX + 1)) / (nTicksX - 1);
          const xMinor = axesX + minorFrac * axesWidth;
          stroke(0);
          strokeWeight(0.1);
          // Bottom minor
          line(xMinor, axesY + axesHeight, xMinor, axesY + axesHeight - 1.5);
          // Top minor
          line(xMinor, axesY + 1.5, xMinor, axesY);
        }
      }
    }
    noStroke();
  }

  // Draw axes ticks and labels for 'fugacity versus temperature'
  if (!isPressure) {
    const nTicks = 5; // 5 major ticks for y-axis (fugacity)
    const nMinor = 4; // 4 minor ticks between major for y-axis
    const minValY = 0.0;
    const maxValY = 2.0;
    const minValX = 280;
    const maxValX = 400;
    textSize(3.4); // increased tick number size
    fill(30);
    // Y axis (fugacity) major ticks and labels
    textAlign(RIGHT, CENTER);
    for (let i = 0; i < nTicks; i++) {
      const frac = i / (nTicks - 1);
      const y = axesY + axesHeight - frac * axesHeight;
      const val = (minValY + frac * (maxValY - minValY)).toFixed(1);
      // Left major tick
      stroke(0);
      strokeWeight(0.1);
      line(axesX, y, axesX + 3, y);
      // Right major tick
      line(axesX + axesWidth - 3, y, axesX + axesWidth, y);
      // Left label (only left)
      noStroke();
      text(val, axesX - 1, y);
      // Minor ticks (skip after last major)
      if (i < nTicks - 1) {
        for (let j = 1; j <= nMinor; j++) {
          const minorFrac = (i + j / (nMinor + 1)) / (nTicks - 1);
          const yMinor = axesY + axesHeight - minorFrac * axesHeight;
          stroke(0);
          strokeWeight(0.1);
          // Left minor
          line(axesX, yMinor, axesX + 1.5, yMinor);
          // Right minor
          line(axesX + axesWidth - 1.5, yMinor, axesX + axesWidth, yMinor);
        }
      }
    }
    // X axis (temperature) major ticks and labels
    const nTicksX = 7; // 7 major ticks for temperature axis
    const nMinorX = 3; // 3 minor ticks between major for x-axis
    textAlign(CENTER, TOP);
    for (let i = 0; i < nTicksX; i++) {
      const frac = i / (nTicksX - 1);
      const x = axesX + frac * axesWidth;
      const val = Math.round(minValX + frac * (maxValX - minValX));
      // Bottom major tick
      stroke(0);
      strokeWeight(0.1);
      line(x, axesY + axesHeight, x, axesY + axesHeight - 3);
      // Top major tick
      line(x, axesY + 3, x, axesY);
      // Bottom label (only bottom)
      noStroke();
      text(val, x, axesY + axesHeight + 1);
      // Minor ticks (skip after last major)
      if (i < nTicksX - 1) {
        for (let j = 1; j <= nMinorX; j++) {
          const minorFrac = (i + j / (nMinorX + 1)) / (nTicksX - 1);
          const xMinor = axesX + minorFrac * axesWidth;
          stroke(0);
          strokeWeight(0.1);
          // Bottom minor
          line(xMinor, axesY + axesHeight, xMinor, axesY + axesHeight - 1.5);
          // Top minor
          line(xMinor, axesY + 1.5, xMinor, axesY);
        }
      }
    }
    noStroke();
  }

  // Draw fugacity vs temperature graph if in that mode and data is available
  if (!isPressure && window.state.fugacityTemperatureGraph) {
    const { Tvals, fugacityVals, Tsat, pres } = window.state.fugacityTemperatureGraph;
    // Helper to map T, f to axes coordinates
    function toXY(T, f) {
      const x = axesX + ((T - 280) / 120) * axesWidth;
      const y = axesY + axesHeight - (f / 2.0) * axesHeight;
      return [x, y];
    }
    // Find index of Tsat
    let iTsat = Tsat !== null ? Tvals.findIndex(t => t >= Tsat) : -1;
    if (iTsat === -1) iTsat = Tvals.length - 1;
    // Clip to axes box
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(axesX, axesY, axesWidth, axesHeight);
    drawingContext.clip();

    // Draw solid blue curve (liquid region)
    stroke('#093FB4');
    strokeWeight(0.5); // thinner solid line
    noFill();
    beginShape();
    for (let i = 0; i <= iTsat; i++) {
      const [x, y] = toXY(Tvals[i], fugacityVals[i]);
      vertex(x, y);
    }
    endShape();

    // Draw solid blue horizontal line (vapor region)
    stroke('#093FB4');
    strokeWeight(0.5);
    noFill();
    beginShape();
    for (let i = iTsat; i < Tvals.length; i++) {
      const [x, y] = toXY(Tvals[i], fugacityVals[i]);
      vertex(x, y);
    }
    endShape();

    // Draw dashed blue horizontal line (vapor extension to left)
    if (Tsat !== null) {
      stroke('#1976D2');
      strokeWeight(0.4);
      drawingContext.setLineDash([1.2, 1.2]);
      const [x0, yVap] = toXY(280, fugacityVals[iTsat]);
      const [xTsat, yVap2] = toXY(Tsat, fugacityVals[iTsat]);
      line(x0, yVap, xTsat, yVap2);
      drawingContext.setLineDash([]);
    }

    // Draw dashed blue curve (liquid extension to right)
    if (Tsat !== null && iTsat < Tvals.length - 1) {
      stroke('#1976D2');
      strokeWeight(0.4);
      drawingContext.setLineDash([1.2, 1.2]);
      noFill();
      beginShape();
      for (let i = iTsat; i < Tvals.length; i++) {
        // Use the liquid fugacity curve for T > Tsat (not the vapor value)
        const yVal = clausius(Tvals[i]); // bar
        const [x, y] = toXY(Tvals[i], yVal);
        vertex(x, y);
      }
      endShape();
      drawingContext.setLineDash([]);
    }

    // Draw dashed vertical line at Tsat
    if (Tsat !== null) {
      const [xTsat, yTsat] = toXY(Tsat, fugacityVals[iTsat]);
      stroke(0);
      strokeWeight(0.3); // thinner vertical dashed line
      drawingContext.setLineDash([0.8, 0.8]); // more frequent dashes
      line(xTsat, yTsat, xTsat, axesY + axesHeight);
      drawingContext.setLineDash([]);
      // Draw black dot at (Tsat, fugacity)
      fill(0);
      noStroke();
      ellipse(xTsat, yTsat, 3.2, 3.2);
      // Draw T^sat label
      fill(30);
      noStroke();
      textSize(3.2);
      textAlign(CENTER, BOTTOM);
      textStyle(ITALIC);
      text('T', xTsat - 7, yTsat - 2);
      textStyle(NORMAL);
      textSize(2.5); // smaller for superscript
      textAlign(LEFT, BOTTOM);
      text('sat', xTsat - 5.0, yTsat - 4);
    }
    drawingContext.restore();

    // Draw region labels (not clipped)
    if (Tsat !== null) {
      // 'liquid' label: along the lower left curve
      const fracLiquid = 0.20;
      const T_liq = 280 + (Tsat - 280) * fracLiquid;
      const y_liq = clausius(T_liq); // bar
      const [xL, yL] = toXY(T_liq, y_liq);
      push();
      textSize(4.2);
      fill(30);
      noStroke();
      textAlign(CENTER, CENTER);
      translate(xL, yL);
      rotate(-Math.PI / 20);
      text('liquid', 6, -4);
      pop();

      // 'vapor' label: to the right of Tsat, above the vapor line
      const T_vap = Tsat + (400 - Tsat) * 0.6;
      const y_vap = fugacityVals[iTsat];
      const [xV, yV] = toXY(T_vap, y_vap);
      push();
      textSize(4.2);
      fill(30);
      noStroke();
      textAlign(LEFT, BOTTOM);
      text('vapor', xV - 5, yV - 2);
      pop();
    }
  }

  // Draw fugacity vs pressure graph if in that mode and data is available
  if (isPressure && window.state.fugacityPressureGraph) {
    const { Pvals, fugacityVapor, fugacityLiquid, Psat, realGas } = window.state.fugacityPressureGraph;
    const isIdealGas = realGas === false;
    const isRealGas = realGas === true;
    // Helper to map P, f to axes coordinates
    function toXY(P, f) {
      // Use independent x/y axis scaling for each plot type
      const maxValX = (isIdealGas || isRealGas) ? 3.0 : 0.3;
      const maxValY = (isIdealGas || isRealGas) ? 3.0 : 0.3;
      const x = axesX + (P / maxValX) * axesWidth;
      const y = axesY + axesHeight - (f / maxValY) * axesHeight;
      return [x, y];
    }
    // Find index of Psat
    let iPsat = Psat !== null ? Pvals.findIndex(p => p >= Psat) : -1;
    if (iPsat === -1) iPsat = Pvals.length - 1;
    // Clip to axes box
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(axesX, axesY, axesWidth, axesHeight);
    drawingContext.clip();

    // Draw vapor line (solid, #093FB4 up to Psat)
    stroke('#093FB4');
    strokeWeight(0.5); // thinner solid line
    noFill();
    beginShape();
    for (let i = 0; i <= iPsat; i++) {
      const [x, y] = toXY(Pvals[i], fugacityVapor[i]);
      vertex(x, y);
    }
    endShape();

    // Only for ideal gas: draw vapor extension (dashed, faint blue) from Psat to (max, max)
    if (Psat !== null && isIdealGas && Psat < 3.0) { // Changed maxVal to 0.3 for ideal gas
      stroke('#1976D2');
      strokeWeight(0.4); // thinner dashed line
      drawingContext.setLineDash([1.2, 1.2]); // more frequent dashes
      const [xStart, yStart] = toXY(Psat, Psat);
      const [xEnd, yEnd] = toXY(3.0, 3.0); // Changed maxVal to 0.3 for ideal gas
      line(xStart, yStart, xEnd, yEnd);
      drawingContext.setLineDash([]);
    }

    // For real gas: draw vapor extension (dashed, faint blue) from Psat to maxValX as a curve
    if (Psat !== null && isRealGas) {
      stroke('#1976D2');
      strokeWeight(0.4); // thinner dashed line
      drawingContext.setLineDash([1.2, 1.2]); // more frequent dashes
      const maxValX = 3.0;
      const nExt = 40;
      // Real gas vapor fugacity function (copied from calcs.js)
      function fugV(P) { return (P - 0.8 * (P - Math.log(P + 1))); } // bar
      noFill();
      beginShape();
      for (let j = 0; j <= nExt; j++) {
        const P = Psat + (maxValX - Psat) * (j / nExt);
        const f = fugV(P);
        const [x, y] = toXY(P, f);
        vertex(x, y);
      }
      endShape();
      drawingContext.setLineDash([]);
    }

    // Only for ideal gas: draw liquid extension (dashed, faint blue) before Psat
    if (iPsat > 0 && isIdealGas) {
      stroke('#1976D2');
      strokeWeight(0.4); // thinner dashed line
      drawingContext.setLineDash([1.2, 1.2]); // more frequent dashes
      beginShape();
      for (let i = 0; i <= iPsat; i++) {
        const [x, y] = toXY(Pvals[i], fugacityLiquid[i]);
        vertex(x, y);
      }
      endShape();
      drawingContext.setLineDash([]);
    }

    // Draw liquid line (solid, #093FB4 from Psat to end)
    stroke('#093FB4');
    strokeWeight(0.5); // thinner solid line
    noFill();
    beginShape();
    for (let i = iPsat; i < Pvals.length; i++) {
      const [x, y] = toXY(Pvals[i], fugacityLiquid[i]);
      vertex(x, y);
    }
    endShape();

    // Draw dashed horizontal line at y=Psat (from y-axis to Psat)
    if (Psat !== null) {
      const fugL = fugacityLiquid[iPsat];
      const [x0, yPsat] = toXY(0, fugL);
      const [xPsat, yPsat2] = toXY(Psat, fugL);
      stroke('#1976D2');
      strokeWeight(0.4); // thinner dashed line
      drawingContext.setLineDash([1.2, 1.2]); // more frequent dashes
      line(x0, yPsat, xPsat, yPsat2);
      drawingContext.setLineDash([]);
    }
    // Draw vertical dashed line at Psat
    if (Psat !== null) {
      const fugL = fugacityLiquid[iPsat];
      const [xPsat, yPsat] = toXY(Psat, fugL);
      stroke(0);
      strokeWeight(0.3); // thinner vertical dashed line
      drawingContext.setLineDash([0.8, 0.8]); // more frequent dashes
      line(xPsat, yPsat, xPsat, axesY + axesHeight);
      drawingContext.setLineDash([]);
      // Draw black dot at (Psat, fugL)
      fill(0);
      noStroke();
      ellipse(xPsat, yPsat, 3.2, 3.2);
      // Draw P^sat label
      fill(30);
      noStroke();
      textSize(3.2);
      textAlign(CENTER, BOTTOM);
      textStyle(ITALIC);
      text('P', xPsat - 7, yPsat - 2);
      textStyle(NORMAL);
      textSize(2.5); // smaller for superscript
      textAlign(LEFT, BOTTOM);
      text('sat', xPsat - 5.0, yPsat - 4);
    }
    drawingContext.restore();

    // Draw region labels (not clipped)
    if (Psat !== null) {
      // 'liquid' label, horizontal, above liquid line near right
      if (isRealGas) {
        // Make the 'liquid' label move only vertically: fixed x, y from fugacityLiquid[iPsat]
        const fracX = 0.75;
        const xL = axesX + axesWidth * fracX;
        const fugL = fugacityLiquid[iPsat];
        const [_, yL] = toXY(0, fugL); // get y pixel for fugacity = fugL
        push();
        textSize(4.2);
        fill(30);
        noStroke();
        textAlign(CENTER, BOTTOM);
        text('liquid', xL + 22, yL -2);
        pop();
      } else {
        const fracLiquid = 0.85;
        const PxL = Psat + (3.0 - Psat) * fracLiquid;
        const FyL = Psat;
        const [xL, yL] = toXY(PxL, FyL - 0.02); // constant offset above line
        push();
        textSize(4.2);
        fill(30);
        noStroke();
        textAlign(LEFT, BOTTOM);
        text('liquid', xL - 10, yL - 2); // left and up
        pop();
      }
      // 'vapor' label, horizontal, above vapor line near right
      if (isRealGas) {
        const fixedP = 0.08; // fixed pressure for stable label position
        function fugV(P) { return (10.0 * P - 0.8 * (10.0 * P - Math.log(10.0 * P + 1))) / 10.0; }
        const f_label = fugV(fixedP);
        const [xV, yV] = toXY(fixedP, f_label - 0.02); // small, fixed offset below the curve
        push();
        textSize(4.2);
        fill(30);
        noStroke();
        textAlign(CENTER, CENTER);
        translate(xV, yV);
        rotate(-Math.PI / 5.8);
        text('vapor', 8, -6);
        pop();
      } else {
        push();
        textSize(4.2);
        fill(30);
        noStroke();
        textAlign(CENTER, CENTER);
        const fracVapor = 0.45; // a bit further along the line
        const Px = Psat * fracVapor;
        const Fy = Psat * fracVapor;
        const [xV, yV] = toXY(Px, Fy);
        translate(xV, yV);
        rotate(-Math.PI / 4.8);
        translate(0, -4); // Move up from the line
        text('vapor', 0, 0);
        pop();
      }
    }

  }
}

function drawCanvasMenu() {
  // Popup menu dimensions (even smaller)
  const menuWidth = 20;
  const buttonHeight = 4.8;
  const buttonSpacing = 1.0;
  const popupPadding = 1.2;
  const iconMargin = 4;
  const margin = 2;
  const iconSize = 6;
  const numButtons = 3;
  const menuHeight = 2 * popupPadding + numButtons * buttonHeight + (numButtons - 1) * buttonSpacing;
  // Align the popup so its right edge matches the right side of the hamburger border
  const menuX = state.canvasSize[0] - margin - iconSize - iconMargin + iconSize - menuWidth + iconSize - 6; // -1 for border
  const menuY = margin + (10 - iconSize) / 2 + iconSize + 1;

  // Draw menu background
  push();
  fill(255);
  stroke(0);
  strokeWeight(0.3);
  rect(menuX, menuY, menuWidth, menuHeight, 1);
  pop();

  // Draw buttons
  const labels = ["Directions", "Details", "About"];
  window.menuButtonBounds = [];
  for (let i = 0; i < 3; i++) {
    const btnX = menuX + popupPadding;
    const btnY = menuY + popupPadding + i * (buttonHeight + buttonSpacing);
    const btnW = menuWidth - 2 * popupPadding;
    const btnH = buttonHeight;
    // Button background (no outline)
    noStroke();
    fill('#0D6EFD');
    rect(btnX, btnY, btnW, btnH, 0.6);
    // Button label
    fill(255);
    textSize(2.8);
    textAlign(CENTER, CENTER);
    text(labels[i], btnX + btnW / 2, btnY + btnH / 2 + 0.05);
    // Store bounds for click detection
    window.menuButtonBounds.push({ x: btnX, y: btnY, w: btnW, h: btnH, label: labels[i] });
  }
}

function drawCheckbox(x, y, size, checked, label) {
  // Draw checkbox square
  fill(255);
  stroke(0);
  strokeWeight(0.3);
  rect(x, y - size / 2, size, size, 0.4);
  // Draw checkmark if checked
  if (checked) {
    stroke('#1976D2');
    strokeWeight(0.4);
    line(x + 0.5, y, x + size / 2, y + size / 2 - 0.5);
    line(x + size / 2, y + size / 2 - 0.5, x + size - 0.5, y - size / 2 + 0.5);
  }
  // Draw label
  noStroke();
  fill(50, 50, 50);
  textSize(2.2);
  textAlign(LEFT, CENTER);
  text(label, x + size + 1.2, y);
  // Store bounds for click detection
  window.checkboxBounds = {
    x: x,
    y: y - size / 2,
    w: size,
    h: size
  };
}
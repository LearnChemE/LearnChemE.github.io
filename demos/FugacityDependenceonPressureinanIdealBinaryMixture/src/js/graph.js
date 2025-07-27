export function drawBasicPlot(options = {}) {
  // Configurable parameters with defaults
  const leftMargin = options.leftMargin ?? 18;
  const topMargin = options.topMargin ?? 8;
  const rightMargin = options.rightMargin ?? 8;
  const bottomMargin = options.bottomMargin ?? 14;
  const tickLen = options.tickLen ?? 2;
  const tickCount = options.tickCount ?? 5;
  const yLabel = options.yLabel ?? "Y Axis";
  const xLabel = options.xLabel ?? "X Axis";
  const yTickLabel = options.yTickLabel ?? (i => (i * 20).toString());
  const xTickLabel = options.xTickLabel ?? (i => (i * 10).toString());
  const axisLabelSize = options.axisLabelSize ?? 3.5;
  const tickLabelSize = options.tickLabelSize ?? 3.0;
  const yLabelOffset = options.yLabelOffset ?? -4;
  const xLabelOffset = options.xLabelOffset ?? 10;

  const plotX = window.contentArea.x + leftMargin;
  const plotY = window.contentArea.y + topMargin;
  const plotW = window.contentArea.width - leftMargin - rightMargin;
  const plotH = window.contentArea.height - topMargin - bottomMargin;

  // Axes
  stroke(0);
  strokeWeight(0.4);
  line(plotX, plotY, plotX, plotY + plotH); // y-axis
  line(plotX, plotY + plotH, plotX + plotW, plotY + plotH); // x-axis
  line(plotX, plotY, plotX + plotW, plotY); // top
  line(plotX + plotW, plotY, plotX + plotW, plotY + plotH); // right

  // Ticks and number labels (left/right, bottom/top)
  textSize(tickLabelSize);
  fill(0);
  noStroke();
  // Y axis ticks (left and right)
  textAlign(RIGHT, CENTER);
  for (let i = 0; i <= tickCount; i++) {
    const y = plotY + plotH - (i * plotH / tickCount);
    // Left ticks and labels (ticks inside)
    stroke(0);
    strokeWeight(0.25);
    line(plotX, y, plotX + tickLen, y);
    noStroke();
    text(yTickLabel(i), plotX - 2, y); // closer to axis
    // Right ticks only (ticks inside)
    stroke(0);
    strokeWeight(0.25);
    line(plotX + plotW, y, plotX + plotW - tickLen, y);
    noStroke();
  }
  // X axis ticks (bottom and top)
  textAlign(CENTER, TOP);
  for (let i = 0; i <= tickCount; i++) {
    const x = plotX + (i * plotW / tickCount);
    // Bottom ticks and labels (ticks inside)
    stroke(0);
    strokeWeight(0.25);
    line(x, plotY + plotH, x, plotY + plotH - tickLen);
    noStroke();
    text(xTickLabel(i), x, plotY + plotH + 2); // closer to axis
    // Top ticks only (ticks inside)
    stroke(0);
    strokeWeight(0.25);
    line(x, plotY, x, plotY + tickLen);
    noStroke();
  }
  // Axis labels
  textSize(axisLabelSize);
  textAlign(CENTER, BOTTOM);
  text(xLabel, plotX + plotW / 2, plotY + plotH + xLabelOffset);
  textAlign(RIGHT, CENTER);
  push();
  translate(plotX - 10, plotY + plotH / 2 + yLabelOffset); // move Y axis label up
  rotate(-HALF_PI);
  text(yLabel, 0, 0);
  pop();
} 
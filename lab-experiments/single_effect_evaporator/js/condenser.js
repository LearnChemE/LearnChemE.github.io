// Condenser Component for SVG.js
// Rectangular shell-and-tube condenser (previous version) with water-jacket stubs
// Usage:
//    const condenser = createCondenser('#condenser', 0, 0);

function createCondenser(container, x = 0, y = 0) {
  // Create an SVG canvas; the main group will be positioned/scaled outside.
  const draw = SVG().addTo(container).size(200, 120);
  const group = draw.group().move(x, y).scale(1.6);

  // ─── Shell geometry ───────────────────────────────────────────
  const shellWidth  = 60;
  const shellHeight = 25;
  const shellRadius = 6;
  const shellX = 10;
  const shellY = 20;

  // Shell body
  group.rect(shellWidth, shellHeight)
    .move(shellX, shellY)
    .fill('#dce4ff')
    .stroke('#000')
    .radius(shellRadius);

  // ─── Cooling-water stubs (left & right) ──────────────────────
  const stubLen = 15;
  const stubThk = 6;
  const stubY   = shellY + shellHeight / 2 - stubThk / 2;

  group.rect(stubLen, stubThk) // left
    .move(shellX - stubLen, stubY)
    .fill('#d2d2d2')
    .stroke('#000');

  group.rect(stubLen, stubThk) // right
    .move(shellX + shellWidth, stubY)
    .fill('#d2d2d2')
    .stroke('#000');

  // ─── Vapour inlet (top) ──────────────────────────────────────
  group.rect(stubThk, 12)
    .move(shellX + shellWidth / 4 - stubThk / 2, shellY - 12)
    .fill('#d2d2d2')
    .stroke('#000');

  // ─── Condensate outlet (bottom) ──────────────────────────────
  group.rect(stubThk, 12)
    .move(shellX + (3 * shellWidth) / 4 - stubThk / 2, shellY + shellHeight)
    .fill('#d2d2d2')
    .stroke('#000');

  // ─── Internal tube bundle (4 horizontal lines) ───────────────
  const tubeGap = 6;
  for (let i = 0; i < 4; i++) {
    const yPos = shellY + 4 + i * tubeGap;
    group.line(shellX + 4, yPos, shellX + shellWidth - 4, yPos)
      .stroke('#3d3d3d')
      .attr('stroke-width', 1.2);
  }

  return { group };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createCondenser };
}

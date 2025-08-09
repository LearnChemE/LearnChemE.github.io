// Valve Component for SVG.js
// Simple valve symbol with optional open/close rotation of the disc
// Usage:
//   const valve = createValve('#some-div', 0, 0, true);
//   valve.setOpen(false);

function createValve(container, x = 0, y = 0, open = true) {
  // Create a compact drawing canvas; group will be moved to (x, y)
  // The raw symbol is ~40 px wide; group scaling can be adjusted by caller
  const draw = SVG().addTo(container).size(80, 40);

  // Master group for positioning & scaling
  const valveGroup = draw.group().move(x, y).scale(1.8);

  // Pipe stubs (left & right)
  const pipeLength = 16;
  const pipeThickness = 4;
  const centerY = 12;

  // Left stub
  valveGroup.rect(pipeLength, pipeThickness)
    .move(0, centerY - pipeThickness / 2)
    .fill('#d2d2d2')
    .stroke('#000')
    .attr('stroke-width', 0.1);

  // Right stub
  valveGroup.rect(pipeLength, pipeThickness)
    .move(24, centerY - pipeThickness / 2)
    .fill('#d2d2d2')
    .stroke('#000')
    .attr('stroke-width', 0.1);

  // Valve body (circle)
  const bodyRadius = 8;
  const bodyCenterX = pipeLength; // Align center after left stub

  valveGroup.circle(bodyRadius * 2)
    .center(bodyCenterX, centerY)
    .fill('#ffffff')
    .stroke('#000')
    .attr('stroke-width', 0.15);

  // Disc/handle inside body – we draw a short line then rotate it
  const discLength = bodyRadius * 1.4; // slightly shorter than diameter
  const disc = valveGroup.line(
    bodyCenterX - discLength / 2,
    centerY,
    bodyCenterX + discLength / 2,
    centerY
  )
    .stroke('#ff0000')
    .attr('stroke-width', 0.8)
    .attr('stroke-linecap', 'round');

  // Helper to update orientation according to open/close state
  function updateDisc(stateOpen) {
    const angle = stateOpen ? 45 : 0; // 45° = open, 0° (horizontal) = closed (visual choice)
    disc.rotate(angle, bodyCenterX, centerY);
  }

  // Initial orientation
  updateDisc(open);

  // Public API
  return {
    group: valveGroup,
    setOpen: function(newState) {
      open = Boolean(newState);
      updateDisc(open);
    }
  };
}

// Export for CommonJS environments (e.g., Jest or Node bundling)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createValve };
}

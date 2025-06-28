// Flowmeter/Rotameter Component for SVG.js
// Based on rotameter-2 from vortex tube system

function createFlowmeter(container, x = 0, y = 0, reading = 0) {
  const draw = SVG().addTo(container).size(200, 250);
  const flowmeterGroup = draw.group().move(x, y).scale(2.5);
  
  // Main rotameter body
  flowmeterGroup.rect(17.5, 65)
    .move(0, 0)
    .fill('#d2d2d2')
    .opacity(0.3)
    .stroke('#000')
    .attr('stroke-width', 0.1)
    .radius(0.5, 0.4);
  
  // Inner cutout/tube
  const cutoutPath = `M 7 65 v -3 l -3,-60 h 3.25 v -2 h 3 v 2 h 3.25 l -3,60 v 3 z`;
  flowmeterGroup.path(cutoutPath)
    .fill('#ffffff')
    .opacity(0.8)
    .stroke('#000')
    .attr('stroke-width', 0.1);
  
  // Reading indicator (red bar)
  const readingY = 57 - (reading * 0.5); // Scale reading position
  flowmeterGroup.rect(4, 1.25)
    .move(6.75, readingY)
    .fill('#ff0000')
    .stroke('#000')
    .attr('stroke-width', 0.05)
    .radius(0.5);
  
  // Scale markings on left side
  const scaleMarkings = [
    { value: 0, long: true, y: 57.5 },
    { value: 20, long: true, y: 47.5 },
    { value: 40, long: true, y: 37.5 },
    { value: 60, long: true, y: 27.5 },
    { value: 80, long: true, y: 17.5 },
    { value: 100, long: true, y: 7.5 }
  ];
  
  scaleMarkings.forEach(mark => {
    const lineLength = mark.long ? 2.5 : 1.25;
    flowmeterGroup.line(0, mark.y, lineLength, mark.y)
      .stroke('#000')
      .attr('stroke-width', 0.1);
    
    // Add intermediate markings
    if (mark.value < 100) {
      for (let i = 1; i < 5; i++) {
        const intermediateY = mark.y - (i * 2);
        if (intermediateY > 7.5) {
          flowmeterGroup.line(0, intermediateY, 1.25, intermediateY)
            .stroke('#000')
            .attr('stroke-width', 0.1);
        }
      }
    }
  });
  
  // Scale labels
  scaleMarkings.forEach(mark => {
    const xPosition = mark.value === 100 ? -8.5 : -6.75; // Only adjust 100 position
    flowmeterGroup.text(mark.value.toString())
      .font({ size: 4.93889, family: 'Arial' })
      .fill('#000')
      .move(xPosition, mark.y - 2.5);
  });
  
  // Units label
  flowmeterGroup.text('mL/s')
    .font({ size: 4.9389, family: 'Arial' })
    .fill('#000')
    .move(-6.5, 67);
  
  return {
    group: flowmeterGroup,
    updateReading: (newReading) => {
      const readingIndicator = flowmeterGroup.children()[2];
      const newY = 57 - (newReading * 0.5);
      readingIndicator.move(6.75, newY);
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createFlowmeter };
} 
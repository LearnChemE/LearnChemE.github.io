// Pressure Gauge Component for SVG.js
// Based on pressure-readout-1 from vortex tube system

function createPressureGauge(container, x = 0, y = 0, pressure = 1.0) {
  const draw = SVG().addTo(container).size(150, 150);
  const gaugeGroup = draw.group().move(x, y).scale(1.8);
  
  // Gauge body housing
  const housingPath = `m 46,239.25 -1,1 H 18 l -1,-1 v -2.5 l 1,-1 h 12 l 0.5,-0.5 v -2.5 l 0.25,-0.25 h 1.5 l 0.25,0.25 v 2.5 l 0.5,0.5 h 12 l 1,1 z`;
  gaugeGroup.path(housingPath)
    .fill('#c8aa64')
    .stroke('#000')
    .attr('stroke-width', 0.0499999);
  
  // Side connectors
  gaugeGroup.rect(1.5, 4)
    .move(46, 236)
    .fill('#d2b464')
    .stroke('#000')
    .attr('stroke-width', 0.05);
  
  gaugeGroup.rect(1.5, 4)
    .move(15.5, 236)
    .fill('#d2b464')
    .stroke('#000')
    .attr('stroke-width', 0.05);
  
  // Center stem
  gaugeGroup.rect(1.5, 7.5)
    .move(30.75, 225)
    .fill('#e6e6e6')
    .stroke('#000')
    .attr('stroke-width', 0.0499999);
  
  // Main gauge circle (outer)
  gaugeGroup.circle(24)
    .center(31.5, 213)
    .fill('#282828')
    .stroke('#000')
    .attr('stroke-width', 0.2);
  
  // Inner gauge circle (white background)
  gaugeGroup.circle(22)
    .center(31.5, 213)
    .fill('#ffffff')
    .stroke('#000')
    .attr('stroke-width', 0.05);
  
  // Scale markings (major lines at each number)
  const scalePositions = [
    { num: 0, angle: 180, x: 15.64, y: 214.79 },
    { num: 1, angle: 150, x: 17.59, y: 206.32 },
    { num: 2, angle: 120, x: 23.66, y: 200.34 },
    { num: 3, angle: 90, x: 31.64, y: 199.03 },
    { num: 4, angle: 60, x: 39.42, y: 200.51 },
    { num: 5, angle: 30, x: 45.66, y: 206.12 },
    { num: 6, angle: 0, x: 47.38, y: 214.62 },
    { num: 7, angle: -30, x: 45.31, y: 222.16 },
    { num: 8, angle: -60, x: 39.49, y: 227.87 }
  ];
  
  // Draw scale markings
  scalePositions.forEach(pos => {
    const angleRad = (pos.angle * Math.PI) / 180;
    const startRadius = 10;
    const endRadius = pos.num % 2 === 0 ? 12.5 : 11.5; // Longer lines for even numbers
    
    const startX = 31.5 + startRadius * Math.cos(angleRad);
    const startY = 213 - startRadius * Math.sin(angleRad);
    const endX = 31.5 + endRadius * Math.cos(angleRad);
    const endY = 213 - endRadius * Math.sin(angleRad);
    
    gaugeGroup.line(startX, startY, endX, endY)
      .stroke('#ffffff')
      .attr('stroke-width', 0.1);
  });
  
  // Add intermediate markings
  for (let angle = -60; angle <= 180; angle += 6) {
    if (!scalePositions.find(pos => pos.angle === angle)) {
      const angleRad = (angle * Math.PI) / 180;
      const startRadius = 10;
      const endRadius = 11;
      
      const startX = 31.5 + startRadius * Math.cos(angleRad);
      const startY = 213 - startRadius * Math.sin(angleRad);
      const endX = 31.5 + endRadius * Math.cos(angleRad);
      const endY = 213 - endRadius * Math.sin(angleRad);
      
      gaugeGroup.line(startX, startY, endX, endY)
        .stroke('#ffffff')
        .attr('stroke-width', 0.1);
    }
  }
  
  // Number labels
  scalePositions.forEach(pos => {
    // Move top numbers (2, 3, 4) upward for better spacing
    const yOffset = (pos.num >= 2 && pos.num <= 4) ? -4 : -2;
    gaugeGroup.text(pos.num.toString())
      .font({ size: 4.9389, family: 'Arial' })
      .fill('#000')
      .move(pos.x - 2, pos.y + yOffset);
  });
  
  // Calculate needle angle based on pressure (0-8 scale)
  const needleAngle = 180 - (pressure / 8) * 240; // 240 degrees total range
  
  // Create needle group at center of gauge
  const needleGroup = gaugeGroup.group();
  
  // Pressure needle - simple line from center to edge
  const needleLength = 8;
  const needleX = needleLength * Math.cos((needleAngle * Math.PI) / 180);
  const needleY = -needleLength * Math.sin((needleAngle * Math.PI) / 180);
  
  needleGroup.line(31.5, 213, 31.5 + needleX, 213 + needleY)
    .stroke('#ff0000')
    .attr('stroke-width', 0.8);
  
  // Center hub
  gaugeGroup.circle(1.5)
    .center(31.5, 213)
    .fill('#d2d2d2')
    .stroke('#000')
    .attr('stroke-width', 0.025);
  
  // Units label
  gaugeGroup.text('bar')
    .font({ size: 5.64444, family: 'Arial' })
    .fill('#000')
    .move(14.36, 221.79);
  
  return {
    group: gaugeGroup,
    updatePressure: (newPressure) => {
      // Update needle position
      const needle = gaugeGroup.children().find(child => 
        child.node.tagName === 'g' && child.children().length > 0 &&
        child.children()[0].node.tagName === 'line' && 
        child.children()[0].attr('stroke') === '#ff0000'
      );
      if (needle) {
        const newAngle = 180 - (newPressure / 8) * 240;
        const needleLength = 8;
        const needleX = needleLength * Math.cos((newAngle * Math.PI) / 180);
        const needleY = -needleLength * Math.sin((newAngle * Math.PI) / 180);
        
        const needleLine = needle.children()[0];
        needleLine.plot(31.5, 213, 31.5 + needleX, 213 + needleY);
      }
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createPressureGauge };
} 
// Temperature Reader Component - Exact SVG from Hilsch Tube
// Uses the precise SVG structure and styling from the original design

function createTemperatureReader(container, x = 0, y = 0, initialTemp = 22.0) {
  const draw = SVG().addTo(container).size(160, 100);
  const tempGroup = draw.group().move(x, y).scale(1.8);
  
  // Create the exact SVG structure from hilsch_tube
  const temperatureReadout = tempGroup.group().attr('id', 'temperature-readout');
  
  // Exact thermocouple probe from hilsch tube
  const thermocouple = temperatureReadout.group().attr('id', 'thermocouple');
  
  // Golden/brown probe tip (exact from hilsch tube) - moved further right
  thermocouple.rect(0.75, 15)
    .move(50, 20)
    .fill('#b49632')
    .stroke('#000')
    .attr('stroke-width', 0.0380265);
  
  // Gray connector assembly (exact complex path from hilsch tube) - moved further right  
  thermocouple.path('m 45.125,15.25 v 3.5 h 3.25 c 0,0 0.12816,-0.006 0.18908,0.0609 C 48.625,18.87735 48.625,19 48.625,19 v 2.25 H 52 V 19 c 0,0 -0.0111,-0.10048 0.072,-0.18908 0.0388,-0.0609 0.178,-0.0609 0.178,-0.0609 h 3.25 v -3.5 z')
    .fill('#d2d2d2')
    .stroke('#000')
    .attr('stroke-width', 0.05);
  
  // Additional connector rectangles (exact from hilsch tube) - moved further right
  thermocouple.rect(1, 4)
    .move(44.125, 15)
    .fill('#d2d2d2')
    .stroke('#000')
    .attr('stroke-width', 0.0499999);
    
  thermocouple.rect(1, 4)
    .move(55.625, 15)
    .fill('#d2d2d2')
    .stroke('#000')
    .attr('stroke-width', 0.0499999);
    
  thermocouple.rect(4, 1)
    .move(48.375, 21.25)
    .fill('#d2d2d2')
    .stroke('#000')
    .attr('stroke-width', 0.05);
  
  // Process pipe with orange/golden section and connectors (exact from hilsch tube)
  const processTube = temperatureReadout.group().attr('id', 'process-tube');
  
  // Main orange/golden tube section with curved left end (3/4 of total length - like original) - moved right
  processTube.rect(30, 6)
    .move(3.5, 14)
    .fill('#b49632')
    .stroke('#000')
    .attr('stroke-width', 0.0380265)
    .attr('rx', 3)
    .attr('ry', 3);
  
  // Cover the right side curve to make it straight for connection - moved right
  processTube.rect(4, 6)
    .move(30.5, 14)
    .fill('#b49632')
    .stroke('none');
  
  // Small gray pipe section (1/4 of total length - like original) - moved right
  processTube.rect(10, 3)
    .move(33.5, 15.5)
    .fill('#d2d2d2')
    .stroke('#000')
    .attr('stroke-width', 0.0499999);
  
  // Connector details/blips on the golden section (like original) - moved right
  processTube.rect(2, 7)
    .move(34, 13)
    .fill('#d2d2d2')
    .stroke('#000')
    .attr('stroke-width', 0.0499999);
    
  // Top connector blip in the golden section (like original) - moved right
  processTube.rect(6, 2)
    .move(15.5, 12)
    .fill('#b49632')
    .stroke('#000')
    .attr('stroke-width', 0.05);
  
  // Wire from thermocouple probe (perfectly straight down)
  thermocouple.path('M 50.375,25 L 50.375,38')
    .fill('none')
    .stroke('#000')
    .attr('stroke-width', 0.3);
  
  // Main wire from right side of display (straight right then straight down)
  thermocouple.path('M 42,49 L 50.375,49 L 50.375,38')
    .fill('none')
    .stroke('#000')
    .attr('stroke-width', 0.3);
  
  // Temperature readout body
  const readoutBody = temperatureReadout.group().attr('id', 'temperature-readout-body');
  
  // Outer gray housing
  readoutBody.rect(37.803471, 17.993858)
    .move(5, 40)
    .fill('#969696')
    .stroke('#000')
    .attr('stroke-width', 0.256142)
    .radius(1.0500964, 0.99965876);
  
  // Inner black display screen
  readoutBody.rect(25, 15)
    .move(6.6, 41.5)
    .fill('#141414')
    .stroke('#000')
    .attr('stroke-width', 0.15);
  
  // °C label (black text on gray housing)
  readoutBody.text('°C')
    .font({ 
      size: 9, 
      family: 'Arial',
      anchor: 'middle',
      weight: 'bold'
    })
          .fill('#141414')
      .stroke('none')
      .move(32, 44);
  
    // Temperature value (yellow digital text)
  const tempText = readoutBody.text(initialTemp.toFixed(1))
    .font({ 
      size: 10, 
      family: 'Digital-7, monospace',
      anchor: 'middle',
      weight: 'normal'
    })
    .fill('#ffff00')
    .stroke('none')
    .attr('id', 'temp-display')
    .move(10.5, 44);
  
  return {
    group: tempGroup,
    element: draw.node,
    updateTemperature: function(newTemp) {
      const tempElement = tempText;
      if (tempElement) {
        // Smooth animation
        const currentTemp = parseFloat(tempElement.text());
        const targetTemp = parseFloat(newTemp);
        const diff = targetTemp - currentTemp;
        
        if (Math.abs(diff) > 0.1) {
          const step = diff * 0.1;
          const animatedTemp = currentTemp + step;
          tempElement.text(animatedTemp.toFixed(1));
          
          // Continue animation
          setTimeout(() => this.updateTemperature(newTemp), 50);
        } else {
          tempElement.text(targetTemp.toFixed(1));
        }
      }
    },
    setPosition: function(newX, newY) {
      tempGroup.move(newX, newY);
    },
    remove: function() {
      draw.remove();
    }
  };
}

// Make function globally accessible
window.createTemperatureReader = createTemperatureReader; 
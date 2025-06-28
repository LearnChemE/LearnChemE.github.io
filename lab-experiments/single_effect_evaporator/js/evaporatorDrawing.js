// Standalone JavaScript file for Evaporator Diagram
// This file can be used independently with SVG.js library

// Global variables for the evaporator system
const gvs = {
    steam_label_color: '#ff0000',
    solution_label_color: '#14a514',
    heat_exchanger_color: '#dce4ff',
    tank_color: '#f8f8f8',
    liquid_color: '#c8c8ff',
    f_inlet: 10.5,
    p_inlet: 0.15,
    t_inlet: 373,
    conc_inlet: 0.12,
    s_inlet: 8.2,
    t_steam: 423,
    p_steam: 0.25,
    evap_flowrate: 3.8,
    t_evaporator: 363,
    conc_flowrate: 6.7,
    conc_concentrate: 0.18,
    steam_economy: 0.46
  };
  
  // Initialize the diagram
  function initEvaporatorDiagram(containerId) {
    // Create SVG canvas (requires SVG.js library to be loaded)
    const draw = SVG().addTo(containerId).size(800, 600);
    
    // Set background
    draw.rect(800, 600).fill('#ffffff');
  
    const centerWidth = 280;
    const centerHeight = 300;
  
    // Draw tank function
    function drawTank() {
      const tankGroup = draw.group();
      
      // Main tank body
      tankGroup.rect(150, 250)
        .center(centerWidth, centerHeight)
        .fill(gvs.tank_color)
        .stroke('#000')
        .radius(25);
  
      // Top and bottom outlet stems
      tankGroup.rect(20, 280)
        .center(centerWidth, centerHeight)
        .fill(gvs.tank_color)
        .stroke('none');
  
      // Liquid inlet
      tankGroup.rect(30, 20)
        .center(centerWidth - 75, centerHeight - 80)
        .fill(gvs.tank_color)
        .stroke('none');
  
      // Liquid in tank
      tankGroup.rect(149, 169)
        .center(centerWidth, centerHeight + 40)
        .fill(gvs.liquid_color)
        .stroke('none')
        .radius(25);
  
      // Liquid leaving bottom outlet
      tankGroup.rect(20, 30)
        .center(centerWidth, centerHeight + 125)
        .fill(gvs.liquid_color)
        .stroke('none');
  
      // Liquid being poured into tank
      tankGroup.rect(15, 20)
        .center(centerWidth - 82.5, centerHeight - 80)
        .fill(gvs.liquid_color)
        .stroke('none');
  
      // Curved liquid stream with wider connection to rectangular water
      const path = `M ${centerWidth - 75} ${centerHeight - 90} 
                   Q ${centerWidth - 50} ${centerHeight - 75} 
                   ${centerWidth - 25} ${centerHeight - 65}
                   Q ${centerWidth + 10} ${centerHeight - 55} 
                   ${centerWidth + 20} ${centerHeight - 40}
                   L ${centerWidth - 60} ${centerHeight - 40}
                   Q ${centerWidth - 70} ${centerHeight - 55} 
                   ${centerWidth - 75} ${centerHeight - 70} Z`;
      
      tankGroup.path(path).fill(gvs.liquid_color).stroke('none');
  
      // Stem lines
      tankGroup.line(centerWidth - 10, centerHeight - 125, centerWidth - 10, centerHeight - 140).stroke('#000');
      tankGroup.line(centerWidth + 10, centerHeight - 125, centerWidth + 10, centerHeight - 140).stroke('#000');
      tankGroup.line(centerWidth - 10, centerHeight + 125, centerWidth - 10, centerHeight + 140).stroke('#000');
      tankGroup.line(centerWidth + 10, centerHeight + 125, centerWidth + 10, centerHeight + 140).stroke('#000');
  
      // Inlet lines
      tankGroup.line(centerWidth - 90, centerHeight - 90, centerWidth - 75, centerHeight - 90).stroke('#000');
      tankGroup.line(centerWidth - 90, centerHeight - 70, centerWidth - 75, centerHeight - 70).stroke('#000');
    }
  
    // Draw heat exchanger function
    function drawHeatExchanger() {
      const hxGroup = draw.group();
      const hxCenterHeight = centerHeight + 40;
      const hxHeight = 130;
      const hxWidth = 120;
  
      // Heat exchanger body
      const hxPath = `M ${centerWidth - 90} ${hxCenterHeight - hxHeight / 2}
                     L ${centerWidth + hxWidth / 2} ${hxCenterHeight - hxHeight / 2}
                     L ${centerWidth + hxWidth / 2} ${hxCenterHeight + hxHeight / 2 - 20}
                     L ${centerWidth + 90} ${hxCenterHeight + hxHeight / 2 - 20}
                     L ${centerWidth + 90} ${hxCenterHeight + hxHeight / 2}
                     L ${centerWidth - hxWidth / 2} ${hxCenterHeight + hxHeight / 2}
                     L ${centerWidth - hxWidth / 2} ${hxCenterHeight - hxHeight / 2 + 20}
                     L ${centerWidth - 90} ${hxCenterHeight - hxHeight / 2 + 20} Z`;
  
      hxGroup.path(hxPath).fill(gvs.heat_exchanger_color).stroke('#000');
  
      // Mask the leftmost stub edge so the nozzle appears open
      const stubMaskHeight = 25;
      hxGroup.rect(3, stubMaskHeight)
        .move(centerWidth - 91.5, hxCenterHeight - hxHeight / 2)
        .fill(gvs.heat_exchanger_color)
        .stroke('none');
  
      // Right stub (bottom outlet) mask to open nozzle
      const rightStubY = hxCenterHeight + hxHeight / 2 - 20;
      hxGroup.rect(3, stubMaskHeight)
        .move(centerWidth + 88.5, rightStubY)
        .fill(gvs.heat_exchanger_color)
        .stroke('none');
  
      // Heat exchanger tubes
      const tubeWidth = 4;
      const tubeHeight = hxHeight - 35;
      const yTop = hxCenterHeight - tubeHeight / 2;
      const yBottom = hxCenterHeight + tubeHeight / 2;
  
      for (let i = -5; i <= 5; i++) {
        const tubeCenterX = centerWidth + i * 10;
  
        // Filled interior of the tube (liquid)
        hxGroup.rect(tubeWidth, tubeHeight)
          .center(tubeCenterX, hxCenterHeight)
          .fill(gvs.liquid_color)
          .stroke('none');
  
        // Left and right edges of the tube (open ends – no horizontal strokes)
        const xLeft  = tubeCenterX - tubeWidth / 2;
        const xRight = tubeCenterX + tubeWidth / 2;
  
        hxGroup.line(xLeft,  yTop,    xLeft,  yBottom).stroke('#000');
        hxGroup.line(xRight, yTop,    xRight, yBottom).stroke('#000');
      }
    }
  
    
  
        // Draw labels function (simplified without boxes/cards)
    function drawLabels() {
      // No labels needed - clean vessel only
    }
  
    // Draw all components
    drawTank();
    drawHeatExchanger();
    drawLabels();
  
    return draw;
  }
  
  // Function to update diagram with new data
  function updateEvaporatorData(newData) {
    Object.assign(gvs, newData);
  }
  
  // Export functions for use in other modules (if using ES6 modules)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      initEvaporatorDiagram,
      updateEvaporatorData,
      gvs
    };
  }
  
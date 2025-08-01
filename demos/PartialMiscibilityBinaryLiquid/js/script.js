const a = 7500, b = 1000, R = 8.314;

function gibbs(x,T){
  x = Math.min(Math.max(x,1e-6),1-1e-6);
  return x*(1-x)*(a+b*(1-2*x))
       + R*T*(x*Math.log(x)+(1-x)*Math.log(1-x));
}

// Derivative of Gibbs free energy with respect to x
function gibbsDerivative(x, T) {
  x = Math.min(Math.max(x, 1e-6), 1-1e-6);
  
  // Derivative of the excess term: d/dx[x(1-x)(a+b(1-2x))]
  // = (1-2x)(a+b(1-2x)) - 2bx(1-x)
  const excessDerivative = (1-2*x)*(a+b*(1-2*x)) - 2*b*x*(1-x);
  
  // Derivative of the ideal mixing term: d/dx[RT(x*ln(x) + (1-x)*ln(1-x))]
  // = RT[ln(x) - ln(1-x)]
  const idealDerivative = R*T*(Math.log(x) - Math.log(1-x));
  
  return excessDerivative + idealDerivative;
}

function computeCurve(T){
  const xs = [], gs = [];
  for(let i=0;i<=2000;i++){
    const x = i/2000;
    xs.push(x);
    gs.push(gibbs(x,T));
  }
  return { xs, gs };
}

// Find the common tangent points using numerical optimization
function findCommonTangent(T) {
  // At high temperatures (450K and above), no phase separation occurs
  if (T >= 450) {
    return null; // No tangent line should be drawn
  }
  
  let bestTangent = null;
  let minError = Infinity;
  
  // Coarse search with wider range and finer steps for lower temperatures
  const stepSize = T < 350 ? 5 : 10; // Finer search at low temperatures
  
  for (let i = 50; i < 950; i += stepSize) { // Search in left portion
    const x1 = i / 2000;
    const g1 = gibbs(x1, T);
    const dg1 = gibbsDerivative(x1, T);
    
    // For each x1, find x2 where the tangent condition is satisfied
    for (let j = 1050; j < 1950; j += stepSize) { // Search in right portion
      const x2 = j / 2000;
      const g2 = gibbs(x2, T);
      const dg2 = gibbsDerivative(x2, T);
      
      // Calculate the slope between the two points
      const lineSlope = (g2 - g1) / (x2 - x1);
      
      // Check if this line is tangent at both points
      const error1 = Math.abs(lineSlope - dg1);
      const error2 = Math.abs(lineSlope - dg2);
      const totalError = error1 + error2;
      
      if (totalError < minError) {
        minError = totalError;
        bestTangent = {
          x1: x1,
          g1: g1,
          x2: x2,
          g2: g2,
          slope: lineSlope,
          error: totalError
        };
      }
    }
  }
  
  // Fine search around the best coarse result
  if (bestTangent) {
    const centerX1 = bestTangent.x1;
    const centerX2 = bestTangent.x2;
    const searchRange = 0.08; // Larger search range for better coverage
    
    for (let i = -25; i <= 25; i++) {
      const x1 = centerX1 + (i / 500) * searchRange;
      if (x1 <= 0.02 || x1 >= 0.6) continue;
      
      const g1 = gibbs(x1, T);
      const dg1 = gibbsDerivative(x1, T);
      
      for (let j = -25; j <= 25; j++) {
        const x2 = centerX2 + (j / 500) * searchRange;
        if (x2 <= 0.4 || x2 >= 0.98) continue;
        
        const g2 = gibbs(x2, T);
        const dg2 = gibbsDerivative(x2, T);
        
        const lineSlope = (g2 - g1) / (x2 - x1);
        const error1 = Math.abs(lineSlope - dg1);
        const error2 = Math.abs(lineSlope - dg2);
        const totalError = error1 + error2;
        
        if (totalError < bestTangent.error) {
          bestTangent = {
            x1: x1,
            g1: g1,
            x2: x2,
            g2: g2,
            slope: lineSlope,
            error: totalError
          };
        }
      }
    }
  }
  
  // More lenient validation criteria, especially for low temperatures
  const maxError = T < 350 ? 50 : 10; // Much more lenient for low temperatures
  const minSeparation = T < 350 ? 0.05 : 0.1; // Smaller minimum separation allowed
  
  if (!bestTangent || bestTangent.error > maxError || Math.abs(bestTangent.x2 - bestTangent.x1) < minSeparation) {
    return null; // No valid tangent line
  }
  
  return [{x: bestTangent.x1, g: bestTangent.g1}, {x: bestTangent.x2, g: bestTangent.g2}];
}

function findMinima(T){
  let left={x:null,g:Infinity}, right={x:null,g:Infinity};
  for(let i=1;i<1000;i++){
    const x=i/2000, g=gibbs(x,T);
    if(g<left.g) left={x,g};
  }
  for(let i=1001;i<2000;i++){
    const x=i/2000, g=gibbs(x,T);
    if(g<right.g) right={x,g};
  }
  return [left,right];
}

function update(){
  const T = +tempSlider.value;
  const z = +zSlider.value;
  tempValue.textContent = T;
  zValue.textContent    = z.toFixed(2);

  const { xs, gs } = computeCurve(T);
  const tangentResult = findCommonTangent(T);
  const gZ        = gibbs(z,T);
  const hoverTpl  = '%{x:.3f}, %{y:.0f}<extra></extra>';

  let data, x1, x2, slope, tangent;
  
  if (tangentResult === null) {
    // No phase separation - single phase
    data = [
      { x: xs, y: gs, mode:'lines', line:{color:'black',width:2}, hovertemplate:hoverTpl },
      { x: [z], y: [gZ], mode:'markers', marker:{size:8, color:'black'}, hovertemplate:hoverTpl }
    ];
    
    // Single phase rectangle
    document.querySelector('#cylinder svg').innerHTML = `
      <rect x="15" y="30" width="120" height="240" fill="#6CA0FF" stroke="#000" stroke-width="2"/>
      <text x="75" y="150" fill="#fff"
            font-size="24" text-anchor="middle"
            alignment-baseline="middle">
        x₁ = ${z.toFixed(2)}
      </text>`;
  } else {
    // Phase separation occurs
    const [p1, p2] = tangentResult;
    slope = (p2.g-p1.g)/(p2.x-p1.x);
    tangent = xs.map(x => p1.g + slope*(x-p1.x));
    
    // find the two binodal compositions
    x1 = Math.min(p1.x,p2.x);
    x2 = Math.max(p1.x,p2.x);

    // overall z = slider
    if (z <= x1) {
      // pure blue phase
      document.querySelector('#cylinder svg').innerHTML = `
        <rect x="15" y="30" width="120" height="240" fill="#6CA0FF" stroke="#000" stroke-width="2"/>
        <text x="75" y="150" fill="#fff"
              font-size="24" text-anchor="middle"
              alignment-baseline="middle">
          x₁ = ${z.toFixed(2)}
        </text>`;
    }
    else if (z >= x2) {
      // pure blue phase (same as x=0.01)
      document.querySelector('#cylinder svg').innerHTML = `
        <rect x="15" y="30" width="120" height="240" fill="#6CA0FF" stroke="#000" stroke-width="2"/>
        <text x="75" y="150" fill="#fff"
              font-size="24" text-anchor="middle"
              alignment-baseline="middle">
          x₁ = ${z.toFixed(2)}
        </text>`;
    }
    else {
      // two‐phase split (unchanged)
      const fBlue  = (x2 - z)/(x2 - x1);
      const fGreen = 1 - fBlue;

      const topEllipseY    = 30,
            totalH         = 240,
            bottomEllipseY = topEllipseY + totalH;
      const blueH  = Math.round(fBlue  * totalH),
            greenH = Math.round(fGreen * totalH);
      const blueY  = topEllipseY + (totalH - blueH),
            greenY = topEllipseY;

      document.querySelector('#cylinder svg').innerHTML = `
        <!-- green top -->
        <rect x="15" y="${greenY}" width="120" height="${greenH}" fill="#66CC66"/>
        <!-- blue bottom -->
        <rect x="15" y="${blueY}" width="120" height="${blueH}" fill="#6CA0FF"/>
        <!-- container border -->
        <rect x="15" y="30" width="120" height="240" fill="none" stroke="#000" stroke-width="2"/>
        <text x="75" y="${greenY + greenH/2}" fill="#fff"
              font-size="24" text-anchor="middle"
              alignment-baseline="middle">
          x₁ = ${(Math.round(x2 * 100) / 100).toFixed(2)}
        </text>
        <text x="75" y="${blueY + blueH/2}" fill="#fff"
              font-size="24" text-anchor="middle"
              alignment-baseline="middle">
          x₁ = ${(Math.round(x1 * 100) / 100).toFixed(2)}
        </text>`;
    }
    
    // Create data array with tangent line and phase points
    data = [
      { x: xs, y: gs, mode:'lines', line:{color:'black',width:2}, hovertemplate:hoverTpl },
      { x: xs, y: tangent, mode:'lines', line:{color:'gray', width:2}, hovertemplate:hoverTpl },
      { x: [p1.x,p2.x], y: [p1.g,p2.g], mode:'markers', marker:{size:10,color:['#6CA0FF','#66CC66']}, hovertemplate:hoverTpl },
      { x: [z], y: [gZ], mode:'markers', marker:{size:8, color:'black'}, hovertemplate:hoverTpl }
    ];
  }


  // Dynamically compute y-axis ticks for a clean UI
  const minY = Math.min(...gs);
  const maxY = Math.max(...gs);
  const rangeY = maxY - minY;
  // Round min and max to nearest 20 for nice ticks
  const minTick = Math.floor(minY / 20) * 20;
  const maxTick = Math.ceil(maxY / 20) * 20;
  const nTicks = 5;
  const step = (maxTick - minTick) / (nTicks - 1);
  const tickvals = Array.from({length: nTicks}, (_, i) => Math.round(minTick + i * step));
  const ticktext = tickvals.map(v => v.toString());



  const layout = {
    margin: { l: 80, r: 30, t: 30, b: 70 },
    plot_bgcolor: '#fff',
    paper_bgcolor: '#fff',
    hovermode: 'closest',
    xaxis: {
      title: { text: 'mole fraction of component 1', font: { size: 22, family: 'Arial', color: '#000', weight: 'bold' } },
      showgrid: false,
      zeroline: false,
      showline: true,
      linecolor: '#000',
      linewidth: 1,
      ticks: 'inside',
      ticklen: 10,
      tickwidth: 1,
      tickcolor: '#000',
      mirror: 'all',
      tickfont: { size: 18, family: 'Arial', color: '#000', weight: 'normal' },
      range: [0, 1],
      dtick: 0.2,
      minor: {
        dtick: 0.05,
        ticks: 'inside',
        ticklen: 5,
        tickwidth: 1
      },
    },
    yaxis: {
      title: { text: 'change in Gibbs free energy (J/mol)', font: { size: 22, family: 'Arial', color: '#000', weight: 'bold' }, standoff: 70 },
      showgrid: false,
      zeroline: true,
      zerolinecolor: '#888',
      zerolinewidth: 1,
      showline: true,
      linecolor: '#000',
      linewidth: 1,
      ticks: 'inside',
      ticklen: 10,
      tickwidth: 1,
      tickcolor: '#000',
      mirror: 'all',
      tickfont: { size: 18, family: 'Arial', color: '#000', weight: 'normal' },
      tickvals: tickvals,
      ticktext: ticktext,
      range: [minTick, maxTick],
      minor: {
        dtick: step / 5,
        ticks: 'inside',
        ticklen: 5,
        tickwidth: 1
      },
    },
    showlegend: false,
    width: 520,
    height: 440,
    // Add a border to the plot area
    shapes: [
      {
        type: 'rect',
        xref: 'paper',
        yref: 'paper',
        x0: 0,
        y0: 0,
        x1: 1,
        y1: 1,
        line: { color: '#000', width: 1 },
        fillcolor: 'rgba(0,0,0,0)',
        layer: 'below'
      }
    ]
  };

  Plotly.react('plot', data, layout, { 
    displayModeBar: false, 
    scrollZoom: false 
  });
}

tempSlider.addEventListener('input', update);
zSlider.addEventListener('input', update);
window.addEventListener('DOMContentLoaded', update);

// ─── MENU & MODAL BEHAVIOR ────────────────────────────────────────
const menuBtn     = document.querySelector('.menu-btn');
const dropdown    = document.getElementById('dropdownMenu');
const modal       = document.getElementById('modal');
const modalTitle  = document.getElementById('modalTitle');
const modalBody   = document.getElementById('modalBody');
const modalClose  = document.querySelector('.modal-close');

// 1. Toggle dropdown on hamburger click
menuBtn.addEventListener('click', e => {
  e.stopPropagation();
  dropdown.classList.toggle('hidden');
});

// 2. Hide dropdown when clicking anywhere else
// (except the menu itself)
document.addEventListener('click', () => {
  dropdown.classList.add('hidden');
});

// 3. Open modal with content when a menu item is clicked
dropdown.querySelectorAll('li').forEach(item => {
  item.addEventListener('click', e => {
    const opt = e.target.dataset.option;
    let title = '', body = '';
    if (opt === 'directions') {
      title = 'Directions';
      body  = `<p>This simulation plots the change in Gibbs free energy versus mole fraction of one component in a non-ideal binary mixture. Two liquid phases form when the Gibbs free energy is lower for the two phases than for one phase. A line that is tangent to the Gibbs free energy curve at two points (blue and green points) represents the Gibbs free energy change over the mole fraction range between the two points. The mole fractions at the blue and green points are the mole fractions of the two phases, and these mole fractions are shown on the container on the right. The size of each phase on the right is proportional to the amount of that phase, and these amounts are obtained from a mass balance (lever rule). Increasing the temperature with the slider decreases the range of partial miscibility. The black circle represents the overall mole fraction, which is changed with the slider. The phase in blue is more dense and thus is below the less-dense green phase.</p>`;
    } else if (opt === 'details') {
      title = 'Details';
      body  = `<p>For the non‑ideal mixture modeled in this simulation, the change in Gibbs free energy when two components are mixed (\\(\\Delta G\\) in units of J/mol) is:</p>

  <p style="text-align:center">\\[
    \\Delta G = x(1-x)\\,\\big(a + b(1-2x)\\big) \\, + \\, RT\\left[x\\ln x + (1-x)\\ln(1-x)\\right]
  \\]</p>

  <p>where \\(x\\) is the mole fraction of one component in a binary mixture (\\(1-x\\) is the mole fraction of the second component), \\(a\\) and \\(b\\) are constants, \\(R\\) is the gas constant (J·mol\\(^{-1}\\)·K\\(^{-1}\\)), and \\(T\\) is temperature (K).</p>

  <p>The Gibbs free energy of mixing for an ideal solution is composed of two parts:</p>

  <p style="text-align:center">\\[
    \\Delta G^{\\mathrm{is}} = RT\\left[x\\ln x + (1-x)\\ln(1-x)\\right]
  \\]</p>

  <p>The empirical term that models non‑ideal behavior is the excess Gibbs free energy:</p>

  <p style="text-align:center">\\[
    G^{E} = x(1-x)\\,\\big(a + b(1-2x)\\big)
  \\]</p>

  <p>For this system, the mixture separates into two liquid phases over some range of composition; each phase contains both components. Phase separation occurs if the two phases have a lower Gibbs free energy than a single phase. This means if a linear combination of the Gibbs free energies of the two phases (determined in the graph by a line tangent to the curve at two points) is lower than the Gibbs free energy of the mixture, phase separation occurs. As the temperature increases, the range of compositions where phase separation occurs decreases. Mathematically, the two points where the tangent line intersects the curve are the mole fractions where the derivative of \\(G\\) with respect to \\(x\\) is the same.</p>`;
    } else if (opt === 'about') {
      title = 'About';
      body  = ` This simulation was created in the <a href="https://www.colorado.edu/chbe" target="_blank" rel="noopener">Department of Chemical and Biological Engineering</a> at University of Colorado Boulder 
        for <a href="https://learncheme.com/" target="_blank" rel="noopener">LearnChemE.com</a> by Venkateswarlu Mopidevi under the direction of Professor John L. Falconer and Michelle Medlin. 
        It is a JavaScript/HTML5 implementation of a <a href="https://demonstrations.wolfram.com/EffectOfTemperatureOnPartialMiscibilityInABinaryLiquidSystem/" target="_blank" rel="noopener">Mathematica simulation</a> by Kaiyuan Tang and Rachael L. Baumann. It was prepared with financial support from the National Science Foundation (DUE 2336987 and 2336988) in collaboration with Washington State University. Address any questions or comments to <a href="mailto:LearnChemE@gmail.com">LearnChemE@gmail.com</a>.`;
    }
    modalTitle.textContent = title;
    modalBody.innerHTML    = body;
    modal.classList.remove('hidden');
    dropdown.classList.add('hidden');
    if (window.MathJax) {
      MathJax.typesetPromise();
    }
  });
});

// 4. Close modal when clicking the "×"
modalClose.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// 5. Close modal when clicking outside the content box
modal.addEventListener('click', e => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});
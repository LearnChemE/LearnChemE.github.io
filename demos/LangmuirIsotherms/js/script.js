// script.js - Menu, modal, and Langmuir simulation functionality

// ─── MENU & MODAL BEHAVIOR ────────────────────────────────────────
const menuBtn     = document.querySelector('.menu-btn');
const dropdown    = document.getElementById('dropdownMenu');
const modal       = document.getElementById('modal');
const modalTitle  = document.getElementById('modalTitle');
const modalBody   = document.getElementById('modalBody');
const modalClose  = document.querySelector('.modal-close');

// Ensure modal starts hidden
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded');
  modal.classList.add('hidden');
  dropdown.classList.add('hidden');
});

// 1. Toggle dropdown on hamburger click
menuBtn.addEventListener('click', e => {
  e.stopPropagation();
  dropdown.classList.toggle('hidden');
});

// 2. Hide dropdown when clicking anywhere else
document.addEventListener('click', (e) => {
  if (!dropdown.contains(e.target) && !menuBtn.contains(e.target)) {
  dropdown.classList.add('hidden');
  }
});

// 3. Open modal with content when a menu item is clicked
dropdown.querySelectorAll('li').forEach(item => {
  item.addEventListener('click', e => {
    e.stopPropagation();
    const opt = e.target.dataset.option;
    let title = '', body = '';

    if (opt === 'directions') {
      title = 'Directions';
      body  = `
        <p>This simulation uses Langmuir isotherms to model adsorption of a binary gas mixture on a surface. The number of molecules per site are plotted versus the total pressure (P<sub>A</sub> + P<sub>B</sub>). Use the sliders above to vary the heats of adsorption of each component, the temperature, and the ratio of partial pressures; adjust the relative number of sites per molecule to account for larger molecules occupying more surface area than smaller molecules. The two components compete for adsorption sites but do not interact with each other. Zoom on the graph with your scroll wheel.</p>
        `;
    }
    else if (opt === 'details') {
      title = 'Details';
      body  = `
        <p>The number of molecules per site for components A and B are:</p>
        $$\\theta_A = \\frac{K_A P_A}{1 + K_A P_A + K_B P_B}$$
        $$\\theta_B = \\frac{K_B P_B}{\\alpha (1 + K_A P_A + K_B P_B)}$$
        <p>where \\(K_i\\) is the adsorption equilibrium constant for component \\(i = A, B\\) (1/bar), \\(P_i\\) is the partial pressure (bar), and \\(\\alpha\\) is the saturation coverage of B to A.</p>
        $$K_i = k \\, e^{\\lambda_i / (R T)}$$
        <p>where \\(k\\) is a pre-exponential factor (1/bar), \\(\\lambda_i\\) is the heat of adsorption (kJ/mol), \\(R\\) is the ideal gas constant (kJ/[mol K]), and \\(T\\) is temperature (K).</p>
        $$P_A = \\frac{P}{1+r}$$
        $$P_B = r P_A = r \\frac{P}{1+r}$$
        <p>where \\(P\\) is the total pressure \\(P = P_A + P_B\\) (bar), and \\(r\\) is the ratio of partial pressures.</p>
        `;
    }
    else if (opt === 'about') {
      title = 'About';
      body  = `
        <p>
        This simulation was created in the <a href="https://www.colorado.edu/chbe" target="_blank" rel="noopener">Department of Chemical and Biological Engineering</a> at University of Colorado Boulder 
        for <a href="https://learncheme.com/" target="_blank" rel="noopener">LearnChemE.com</a> by Venkateswarlu Mopidevi under the direction of Professor John L. Falconer and Michelle Medlin. 
        It is a JavaScript/HTML5 implementation of a Mathematica simulation by Rachael L. Baumann. It was prepared with financial support from the National Science Foundation (DUE 2336987 and 2336988) in collaboration with Washington State University. Address any questions or comments to <a href="mailto:LearnChemE@gmail.com">LearnChemE@gmail.com</a>.
      `;
    }

    modalTitle.textContent = title;
    modalBody.innerHTML    = body;
    modal.classList.remove('hidden');
    dropdown.classList.add('hidden');
    // re-render MathJax formulas
    if (window.MathJax) {
      MathJax.typesetPromise();
    }
  });
});

// 4. Close modal when clicking the "×"
modalClose.addEventListener('click', (e) => {
  e.stopPropagation();
  modal.classList.add('hidden');
});

// 5. Close modal when clicking outside the content box
modal.addEventListener('click', e => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});

// 6. Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modal.classList.add('hidden');
    dropdown.classList.add('hidden');
  }
});

// ─── LANGMUIR SIMULATION FUNCTIONS ──────────────────────────────────

function computeData() {
  const T    = +document.getElementById('temp').value;
  const lamA = +document.getElementById('heatA').value;
  const lamB = +document.getElementById('heatB').value;
  const r    = +document.getElementById('ratio').value;
  const n    = +document.getElementById('sites').value;
  const R    = 8.314e-3;
  const kA   = 1e-8 * Math.exp(lamA/(R*T));
  const kB   = 1e-8 * Math.exp(lamB/(R*T));
  const N    = 200;
  const Ptot = Array.from({length:N+1},(_,i)=>10*(i/N));
  return {
    Ptot,
    thetaA: Ptot.map(P=>{
      const pA=P/(1+r), pB=r*P/(1+r);
      return (kA*pA)/(1 + kA*pA + kB*pB);
    }),
    thetaB: Ptot.map(P=>{
      const pA=P/(1+r), pB=r*P/(1+r);
      return n*((kB*pB)/(1 + kA*pA + kB*pB));
    })
  };
}

function updatePlot() {
  const {Ptot, thetaA, thetaB} = computeData();
  const idxA = Math.round(3/(10/200));
  const idxB = Math.round(7/(10/200));

  Plotly.react('plot',
    [
      {
        x: Ptot,
        y: thetaA,
        mode: 'lines',
        line: { color: 'blue', width: 3 },
        hovertemplate: '%{x:.2f}, %{y:.3f}<extra></extra>'
      },
      {
        x: Ptot,
        y: thetaB,
        mode: 'lines',
        line: { color: 'green', width: 3 },
        hovertemplate: '%{x:.2f}, %{y:.3f}<extra></extra>'
      }
    ],
    {
      margin:{t:22,l:60,r:40,b:80},
      showlegend:false,
      autosize: true,
      xaxis:{
        title:{ 
          text:'total pressure (bar) = P<sub>A</sub> + P<sub>B</sub>',
          standoff:15,
          font:{size:20,family:'Helvetica, sans-serif',color:'#000'}
        },
        range:[0,10],
        dtick:2,
        ticks:'inside',
        tick0:0,
        ticklen:6,
        tickwidth:1,
        tickcolor:'#000',
        mirror:'all',
        showline:true,
        linecolor:'#000',
        linewidth:1,
        minor:{dtick:0.5,ticks:'inside',ticklen:3},
        showgrid:false,
        tickfont:{size:18,family:'Arial, sans-serif',color:'#000'}
      },
      yaxis:{
        title:{
          text:'number of molecules/site',
          standoff:25,
          font:{size:20,family:'Helvetica, sans-serif',color:'#000'}
        },
        range:[0,1],
        dtick:0.2,
        ticks:'inside',
        tick0:0,
        ticklen:6,
        tickwidth:1,
        tickcolor:'#000',
        mirror:'all',
        showline:true,
        linecolor:'#000',
        linewidth:1,
        minor:{dtick:0.05,ticks:'inside',ticklen:3},
        showgrid:false,
        tickfont:{size:18,family:'Arial, sans-serif',color:'#000'}
      },
      annotations:[
        {
          x:Ptot[idxA], y:thetaA[idxA], text:'A',
          showarrow:false, font:{color:'blue',size:16},
          bgcolor:'white', borderpad:4,
          xanchor:'left', yanchor:'middle', cliponaxis:false
        },
        {
          x:Ptot[idxB], y:thetaB[idxB], text:'B',
          showarrow:false, font:{color:'green',size:16},
          bgcolor:'white', borderpad:4,
          xanchor:'left', yanchor:'middle', cliponaxis:false
        }
      ]
    },
    {displayModeBar:false, responsive:true}
  );
}

function updateValue(id) {
  document.getElementById(id+'-value').innerText =
    document.getElementById(id).value;
}

// Set up exactly like the original langmuir.html
['temp','heatA','heatB','ratio','sites'].forEach(id=>{
  const s = document.getElementById(id);
  if (s) {
    s.addEventListener('input',()=>{
      updateValue(id);
      updatePlot();
    });
    updateValue(id);
  }
});

// Initialize plot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM ready, calling updatePlot...');
  setTimeout(updatePlot, 500); // Give Plotly time to load
});
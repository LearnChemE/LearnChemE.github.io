
// Constants and parameters
const R = 8.314; // cm³·MPa/(mol·K)
const Pc = [3.797, 2.486]; // MPa
const Tc = [425.2, 568.8]; // K
const omega = [0.193, 0.396]; //
const theta1 = 0.22806;
const theta2 = 0.18772;

const FontSize = 16;

// DOM elements
const tempSlider = document.getElementById('temperature');
const moleSlider = document.getElementById('moleFraction');
const tempValue = document.getElementById('tempValue');
const moleValue = document.getElementById('moleValue');
const pressureValue = document.getElementById('pressureValue');
const x1Value = document.getElementById('x1Value');
const y1Value = document.getElementById('y1Value');
// Hamburger
const menuBtn = document.querySelector('.menu-btn');
const menuContent = document.querySelector('.menu-content');
const menuItems = document.querySelectorAll('.menu-item');
const modals = document.querySelectorAll('.modal');
const closeBtns = document.querySelectorAll('.close-btn');


// Hamburger menu functionality
menuBtn.addEventListener('click', () => {
    menuContent.classList.toggle('show');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !menuContent.contains(e.target)) {
        menuContent.classList.remove('show');
    }
});

// Menu items click handlers
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        const modalId = item.getAttribute('data-modal') + '-modal';
        document.getElementById(modalId).style.display = 'block';
        menuContent.classList.remove('show');
    });
});

// Close modal buttons
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal').style.display = 'none';
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

function toScientific10(val) {
    const exp = Math.log10(val);
    if (!Number.isInteger(exp)) return '';
    return "10" + "⁰¹²³⁴⁵⁶⁷⁸⁹"[exp];
}

function tens(val) {
    const exp = Math.log10(val);
    if (!Number.isInteger(exp)) return '';

    if (exp < 1)return val.toFixed(Math.abs(exp));
    else return val.toFixed(0)
}

// Chart setup
const ctx = document.getElementById('chart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [
            {
                label: '',
                pointBackgroundColor: 'blue',
                borderColor: 'blue',
                borderWidth: 2,
                fillColor: 'blue',
                // borderDash: [5, 5],
                data: [],
                pointRadius: 4,
                fill: true,
                showLine: false
            },
            {
                // label: 'VLE Connection',
                pointBackgroundColor: 'green',
                borderColor: 'green',
                borderWidth: 2,
                fillColor: 'green',
                // borderDash: [5, 5],
                data: [],
                pointRadius: 4,
                fill: true,
                showLine: false
            },
            {
                label: 'VLE connection',
                borderColor: 'black',
                borderWidth: 2,
                borderDash: [5, 5],
                data: [],
                pointRadius: 0,
                fill: false,
                showLine: true
            },
            {
                label: 'vapor phase (y₁)',
                borderColor: 'green',
                backgroundColor: 'rgba(0, 128, 0, 0.1)',
                borderWidth: 2,
                data: [],
                pointRadius: 0,
                fill: false
            },
            {
                label: 'liquid phase (x₁)',
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.1)',
                borderWidth: 2,
                data: [],
                pointRadius: 0,
                fill: false
            },
        ]
    },
    options: {
        responsive: true,
        animation: false,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'logarithmic',
                title: {
                    display: true,
                    text: 'volume (cm³/mol)',
                    font: {
                        size: FontSize
                    },
                    color: "black"
                },
                min: 50,
                max: 250000,
                grid: {
                    drawBorder: true,
                    drawOnChartArea: false,
                    color: "black"
                },
                border: {
                    display: true,
                    color: "black",
                    width: 1
                },
                ticks: {
                    color: "black",
                    font: {
                        size: FontSize
                    },
                    callback: (value) => toScientific10(value),
                    minRotation: 0,
                    maxRotation: 0,
                }
            },
            y: {
                type: 'logarithmic',
                title: {
                    display: true,
                    text: 'pressure (MPa)',
                    font: {
                        size: FontSize
                    },
                    color: "black"
                },
                min: 0.01,
                max: 50,
                grid: {
                    drawBorder: true,
                    drawOnChartArea: false,
                    color: "black"
                },
                border: {
                    display: true,
                    color: "black",
                    width: 1
                },
                ticks: {
                    color: "black",
                    font: {
                        size: FontSize
                    },
                    callback: (value) => tens(value)
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'n-butane(1) / n-octane(2)',
                font: {
                    size: FontSize,
                    weight: "normal"
                },
                color: "black"
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.dataset.label || '';
                        const value = context.parsed;
                        return `${label}: P=${value.y.toExponential(2)} MPa, V=${value.x.toExponential(2)} cm³/mol`;
                    }
                }
            },
            legend: {
                labels: {
                    filter: (legendItem, chartData) => {
                        return legendItem.text !== '' && legendItem.text !== undefined;
                    },
                    usePointStyle: true,
                    pointStyle: "line",
                    color: "black",
                    font: {
                        size: FontSize
                    }
                }
            }
        }
    }
});

// Update displayed values
tempSlider.addEventListener('input', updateValues);
moleSlider.addEventListener('input', updateValues);

function updateValues() {
    tempValue.textContent = tempSlider.value;
    moleValue.textContent = parseFloat(moleSlider.value).toFixed(2);
    calculateAndUpdate();
}

// Peng-Robinson equation calculations
function kappa(i) {
    return 0.37464 + 1.54226 * omega[i] - 0.26992 * Math.pow(omega[i], 2);
}

function a(i, T) {
    const term = 1 + kappa(i) * (1 - Math.sqrt(T / Tc[i]));
    return 0.45724 * (Math.pow(R, 2) * Math.pow(Tc[i], 2) / Pc[i]) * Math.pow(term, 2);
}

function b(i) {
    return 0.0778 * (R * Tc[i] / Pc[i]);
}

function calculateK(T) {
    const a1 = a(0, T);
    const a2 = a(1, T);
    const b1 = b(0);
    const b2 = b(1);
    
    return 1 - 0.5 * (b2 / b1) * Math.sqrt(a1 / a2) - 
            0.5 * (b1 / b2) * Math.sqrt(a2 / a1) + 
            0.5 * (b2 * R * T / Math.sqrt(a1 * a2)) * (theta1 / Math.pow(T / Tc[1], theta2));
}

function am(z, T) {
    const k = calculateK(T);
    let sum = 0;
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            sum += z[i] * z[j] * (1 - k) * Math.sqrt(a(i, T) * a(j, T));
        }
    }
    return sum;
}

function bm(z) {
    let sum = 0;
    for (let i = 0; i < 2; i++) {
        sum += z[i] * b(i);
    }
    return sum;
}

function pressure(z, V, T) {
    const amVal = am(z, T);
    const bmVal = bm(z);
    return (R * T) / (V - bmVal) - amVal / (Math.pow(V, 2) + 2 * V * bmVal - Math.pow(bmVal, 2));
}

function psat(i, T) {
    if (i === 1) { // butane
        return 0.1 * Math.pow(10, 4.35576 - 1175.581 / (T - 2.071));
    } else { // octane
        return 0.1 * Math.pow(10, 4.04867 - 1355.126 / (T - 63.63));
    }
}

function calculateVLE(T, x1) {
    const x = [x1, 1 - x1];
    const Pvle = x[0] * psat(1, T) + x[1] * psat(2, T);
    const y1 = x[0] * psat(1, T) / Pvle;
    const y = [y1, 1 - y1];
    
    return { Pvle, x, y };
}

function findVolumeRoots(z, P, T) {
    // For simplicity, we'll use a numerical approach to find roots
    // This is a simplified version - a real implementation would need a more robust root-finding algorithm
    const volumes = [];
    const bmVal = bm(z);
    
    // Generate a range of volumes and find where pressure equals P
    const minV = bmVal * 1.1; // Just above bm
    const maxV = 1000000; // Large volume
    
    // Use a coarse search followed by refinement
    const step = (maxV - minV) / 1000;
    let prevPressure = pressure(z, minV, T);
    
    for (let V = minV + step; V <= maxV; V += step) {
        const currentPressure = pressure(z, V, T);
        
        // Check for sign change (indicates a root)
        if ((prevPressure - P) * (currentPressure - P) <= 0) {
            // Refine the root using linear interpolation
            const rootV = V - step * (currentPressure - P) / (currentPressure - prevPressure);
            volumes.push(rootV);
        }
        
        prevPressure = currentPressure;
        
        // We typically expect 1 or 3 roots for the Peng-Robinson equation
        if (volumes.length >= 3) break;
    }
    
    return volumes;
}

function calculateAndUpdate() {
    const T = parseFloat(tempSlider.value);
    const x1 = parseFloat(moleSlider.value);
    
    // Calculate VLE properties
    const { Pvle, x, y } = calculateVLE(T, x1);
    
    // Update info box
    pressureValue.textContent = `P = ${Pvle.toFixed(2)} MPa`;
    x1Value.innerHTML = `<i>x</i><sub>1</sub> = ${x[0].toFixed(2)}`;
    y1Value.innerHTML = `<i>y</i><sub>1</sub> = ${y[0].toFixed(2)}`;
    
    // Generate volume data
    const volumes = [];
    const minLogV = Math.log10(50);
    const maxLogV = Math.log10(250000);
    const steps = 200;
    
    for (let i = 0; i <= steps; i++) {
        const logV = minLogV + (maxLogV - minLogV) * (i / steps);
        volumes.push(Math.pow(10, logV));
    }
    
    // Calculate pressure data for liquid and vapor phases
    const liquidPressures = [];
    const vaporPressures = [];
    
    for (const V of volumes) {
        liquidPressures.push(pressure(x, V, T));
        vaporPressures.push(pressure(y, V, T));
    }

    // Sort out the 0s
    
    // Find VLE points (where pressure equals Pvle)
    const liquidRoots = findVolumeRoots(x, Pvle, T);
    const vaporRoots = findVolumeRoots(y, Pvle, T);
    
    // Prepare chart data
    const liquidData = [];
    const vaporData = [];
    const vleData = [];
    
    var lastLiq = .01;
    var lastVap = .01;
    var pv = 0;
    for (let i = 0; i < volumes.length; i++) {
        const V = volumes[i];
        const P_liquid = liquidPressures[i];
        const P_vapor = vaporPressures[i];

        // Insert before and after the solver goes undefined
        if (P_liquid * lastLiq <= 0) {
            if (P_liquid <=0 && lastLiq > 0.01) {
                // Curr is zero; change vol until P is in (0, 0.01]
                if (lastLiq < 40.0) liquidData.push({ x: V, y: 0.001 });
            }
            else if (P_liquid > 0.01) {
                // last is zero; add one P in (0, 0.01]
                if (P_liquid < 40.0) liquidData.push({ x: V, y: 0.001 });
            }
        }

        // Same for vapour
        if (P_vapor * lastVap <= 0) {
            if (P_vapor <=0 && lastVap > 0.01) {
                // Curr is zero; change vol until P is in (0, 0.01]
                if (lastVap < 40.0) vaporData.push({ x: V, y: 0.001 });
            }
            else if (P_vapor > 0.01) {
                // last is zero; add one P in (0, 0.01]
                if (P_vapor < 40.0) vaporData.push({ x: V, y: 0.001 });
            }
        }
        
        if (P_liquid > 0) {
            liquidData.push({ x: V, y: P_liquid });
        }
        
        if (P_vapor > 0) {
            vaporData.push({ x: V, y: P_vapor });
        }

        lastLiq = P_liquid;
        lastVap = P_vapor;
        pv = V;
    }

    // Try and find the liquid root with new data
    for (let i=0;i<liquidData.length-1;i++) {
        if ((liquidData[i].y - Pvle) * (liquidData[i+1].y - Pvle) <= 0) {
            // The root is in between the two
            vleData.push({ x: (liquidData[i].x + liquidData[i+1].x) / 2, y: Pvle });
            break;
        }
    }

    // Take the higher root
    const vaporV = Math.max(...vaporRoots);
        
    vleData.push({ x: vaporV, y: Pvle });
    
    // Update chart
    chart.data.datasets[0].data = [vleData[0]];
    chart.data.datasets[1].data = [vleData[1]];
    chart.data.datasets[2].data = vleData;
    chart.data.datasets[3].data = vaporData;
    chart.data.datasets[4].data = liquidData;
    chart.update();
}

// Initialize the simulation
updateValues();

const defaults = {
    muMax: 0.2,
    ks: 0.5,
    cs0: 1.0,
    kd: 0.06
};

const plotlyScriptUrl = 'assets/plotly.js';

const colors = {
    blue: '#0000ff',
    green: 'rgb(0, 153, 0)'
};

const fontSizes = {
    base: 16,
    axisTitle: 18,
    tick: 16,
    label: 17,
    info: 12
};

let drawRef;
let plotlyRoot;
let plotlyPromise;
let plotInitialized = false;
let controlsReady = false;
let pendingResizeFrame;

const elements = {
    sliders: {},
    sliderValues: {}
};

export function drawFigure(draw) {
    drawRef = draw;
    if (drawRef?.hide) drawRef.hide();
    plotlyRoot = document.getElementById('plotly-root');
    setupControls();
    renderPlot();
    window.addEventListener('resize', handleResize, { passive: true });
}

function setupControls() {
    if (controlsReady) return;

    elements.svgContainer = document.getElementById('svg-container');
    elements.plotLayout = document.querySelector('.plot-layout');
    elements.iconContainer = document.querySelector('.icon-container');
    elements.sliderStack = document.querySelector('.slider-stack');

    elements.sliders.muMax = document.getElementById('muMaxSlider');
    elements.sliders.ks = document.getElementById('ksSlider');
    elements.sliders.cs0 = document.getElementById('cs0Slider');
    elements.sliders.kd = document.getElementById('kdSlider');

    elements.sliderValues.muMax = document.getElementById('muMaxValue');
    elements.sliderValues.ks = document.getElementById('ksValue');
    elements.sliderValues.cs0 = document.getElementById('cs0Value');
    elements.sliderValues.kd = document.getElementById('kdValue');

    const sliderKeys = ['muMax', 'ks', 'cs0', 'kd'];
    sliderKeys.forEach((key) => {
        const slider = elements.sliders[key];
        if (!slider) return;
        slider.addEventListener('input', renderPlot);
    });

    syncControls(defaults);
    updatePlotLayoutOffset();
    controlsReady = true;
}

function handleResize() {
    if (pendingResizeFrame) cancelAnimationFrame(pendingResizeFrame);
    pendingResizeFrame = window.requestAnimationFrame(() => {
        pendingResizeFrame = null;
        updatePlotLayoutOffset();
        if (window.Plotly && plotlyRoot) {
            window.Plotly.Plots.resize(plotlyRoot);
        }
    });
}

function syncControls(values) {
    if (elements.sliders.muMax) elements.sliders.muMax.value = `${values.muMax}`;
    if (elements.sliders.ks) elements.sliders.ks.value = `${values.ks}`;
    if (elements.sliders.cs0) elements.sliders.cs0.value = `${values.cs0}`;
    if (elements.sliders.kd) elements.sliders.kd.value = `${values.kd}`;
    updateOutputs(values);
}

function updateOutputs(values) {
    if (elements.sliderValues.muMax) {
        elements.sliderValues.muMax.textContent = formatFixed(values.muMax, 2);
    }
    if (elements.sliderValues.ks) {
        elements.sliderValues.ks.textContent = formatFixed(values.ks, 2);
    }
    if (elements.sliderValues.cs0) {
        elements.sliderValues.cs0.textContent = formatFixed(values.cs0, 1);
    }
    if (elements.sliderValues.kd) {
        elements.sliderValues.kd.textContent = formatFixed(values.kd, 2);
    }
}

function getParams() {
    const muMax = parseFloat(elements.sliders.muMax?.value);
    const ks = parseFloat(elements.sliders.ks?.value);
    const cs0 = parseFloat(elements.sliders.cs0?.value);
    const kd = parseFloat(elements.sliders.kd?.value);

    return {
        muMax: Number.isFinite(muMax) ? muMax : defaults.muMax,
        ks: Number.isFinite(ks) ? ks : defaults.ks,
        cs0: Number.isFinite(cs0) ? cs0 : defaults.cs0,
        kd: Number.isFinite(kd) ? kd : defaults.kd
    };
}

async function renderPlot() {
    if (!plotlyRoot) plotlyRoot = document.getElementById('plotly-root');
    if (!plotlyRoot) return;

    const params = getParams();
    updateOutputs(params);

    const model = computeModel(params);
    let plotlyLib;
    try {
        plotlyLib = await loadPlotly();
    } catch (error) {
        showPlotPlaceholder('Plotly failed to load.');
        return;
    }

    const figure = buildFigure(model);
    const config = {
        displayModeBar: false,
        responsive: true,
        staticPlot: true
    };

    try {
        if (plotInitialized && plotlyLib.react) {
            await plotlyLib.react(plotlyRoot, figure.data, figure.layout, config);
        } else {
            await plotlyLib.newPlot(plotlyRoot, figure.data, figure.layout, config);
            plotInitialized = true;
        }
        window.requestAnimationFrame(() => updatePlotLayoutOffset());
    } catch (error) {
        showPlotPlaceholder('Unable to render the plot.');
    }
}

function computeModel({ muMax, ks, cs0, kd }) {
    const xMax = Math.max(muMax - kd, 0.0001);
    const denom = cs0 + ks;
    let dMax = denom === 0 ? 0 : (cs0 * muMax - kd * denom) / denom;
    if (!Number.isFinite(dMax)) dMax = 0;
    const dMaxPlot = clamp(dMax, 0, xMax);
    const csAtDmax = computeCs(dMax, muMax, ks, kd);

    const csAt = (d) => (d <= dMax ? computeCs(d, muMax, ks, kd) : csAtDmax);
    const muAt = (d) => {
        const cs = csAt(d);
        const denomMu = ks + cs;
        if (!Number.isFinite(cs) || denomMu === 0) return 0;
        return muMax * (cs / denomMu);
    };
    const ccAt = (d) => {
        if (d > dMax) return 0;
        const mu = muAt(d);
        if (!Number.isFinite(mu) || mu === 0) return 0;
        const cs = csAt(d);
        return 0.5 * d * ((cs0 - cs) / mu);
    };

    const sampleCount = 600;
    const dValues = [];
    const csValues = [];
    const ccValues = [];
    const dcValues = [];

    for (let i = 0; i <= sampleCount; i += 1) {
        const d = (xMax * i) / sampleCount;
        const cs = sanitizeValue(csAt(d));
        const cc = sanitizeValue(ccAt(d));
        dValues.push(d);
        csValues.push(cs);
        ccValues.push(cc);
        dcValues.push(d * cc);
    }

    const yMinRaw = Math.min(...csValues, ...ccValues);
    const yMaxRaw = Math.max(...csValues, ...ccValues);
    const y2MinRaw = Math.min(...dcValues);
    const y2MaxRaw = Math.max(...dcValues);

    const [yMin, yMax] = rangeWithPadding(yMinRaw, yMaxRaw, 0.045, 0.26);
    const [y2Min, y2Max] = rangeWithPadding(y2MinRaw, y2MaxRaw, 0.045, 0.26);
    const dMaxProd = dMax > 0 ? computeDmaxProd(dMax, ccAt) : 0;

    return {
        dValues,
        csValues,
        ccValues,
        dcValues,
        xMax,
        yMin,
        yMax,
        y2Min,
        y2Max,
        dMax,
        dMaxPlot,
        dMaxProd,
        csAt,
        ccAt
    };
}

function buildFigure(model) {
    const traces = [
        {
            type: 'scatter',
            mode: 'lines',
            x: model.dValues,
            y: model.csValues,
            line: { color: colors.blue, width: 3 },
            hoverinfo: 'skip'
        },
        {
            type: 'scatter',
            mode: 'lines',
            x: model.dValues,
            y: model.ccValues,
            line: { color: colors.blue, width: 3, dash: 'dash' },
            hoverinfo: 'skip'
        },
        {
            type: 'scatter',
            mode: 'lines',
            x: model.dValues,
            y: model.dcValues,
            line: { color: colors.green, width: 3 },
            yaxis: 'y2',
            hoverinfo: 'skip'
        }
    ];

    const infoText = buildInfoText(model);
    const annotations = buildAnnotations(model, infoText);

    const layout = {
        margin: { l: 75, r: 80, t: 10, b: 60 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        showlegend: false,
        font: {
            family: 'Arial, sans-serif',
            size: fontSizes.base,
            color: '#000'
        },
        xaxis: {
            range: [0, model.xMax],
            title: {
                text: 'dilution rate (h<sup>-1</sup>)',
                font: { size: fontSizes.axisTitle }
            },
            showline: true,
            linecolor: '#000',
            linewidth: 1,
            ticks: 'outside',
            tickfont: { size: fontSizes.tick },
            // tickformat: getTickFormat(model.xMax),
            exponentformat: 'none',
            zeroline: false,
            showgrid: false
        },
        yaxis: {
            range: [model.yMin, model.yMax],
            title: {
                text: 'concentration (g/L)',
                font: { size: fontSizes.axisTitle, color: colors.blue }
            },
            showline: true,
            linecolor: colors.blue,
            linewidth: 1,
            ticks: 'outside',
            tickfont: { size: fontSizes.tick, color: colors.blue },
            // tickformat: getTickFormat(model.yMax - model.yMin),
            exponentformat: 'none',
            zeroline: false,
            showgrid: false
        },
        yaxis2: {
            range: [model.y2Min, model.y2Max],
            title: {
                text: '<i>D</i> &times; concentration (g/[L h])',
                font: { size: fontSizes.axisTitle, color: colors.green }
            },
            overlaying: 'y',
            side: 'right',
            showline: true,
            linecolor: colors.green,
            linewidth: 1,
            ticks: 'outside',
            tickfont: { size: fontSizes.tick, color: colors.green },
            // tickformat: getTickFormat(model.y2Max - model.y2Min),
            exponentformat: 'none',
            zeroline: false,
            showgrid: false
        },
        annotations
    };

    return { data: traces, layout };
}

function buildAnnotations(model, infoText) {
    const dLabel = model.dMaxPlot > 0 ? 0.5 * model.dMaxPlot : 0.5 * model.xMax;
    const ccLabelY = clamp(sanitizeValue(model.ccAt(dLabel)), model.yMin, model.yMax);
    const dcLabelY = clamp(sanitizeValue(dLabel * model.ccAt(dLabel)), model.y2Min, model.y2Max);
    const csLabelX = 0.85 * model.xMax;
    const csLabelY = clamp(sanitizeValue(model.csAt(csLabelX)), model.yMin, model.yMax);

    return [
        {
            x: dLabel,
            y: ccLabelY,
            xref: 'x',
            yref: 'y',
            text: '<i>C</i><sub>cell</sub>',
            showarrow: false,
            bgcolor: 'white',
            borderwidth: 0,
            font: { size: fontSizes.label, color: colors.blue }
        },
        {
            x: csLabelX,
            y: csLabelY,
            xref: 'x',
            yref: 'y',
            text: '<i>C</i><sub>substrate</sub>',
            showarrow: false,
            bgcolor: 'white',
            borderwidth: 0,
            font: { size: fontSizes.label, color: colors.blue }
        },
        {
            x: dLabel,
            y: dcLabelY,
            xref: 'x',
            yref: 'y2',
            text: '<i>D</i> &times; <i>C</i><sub>cell</sub>',
            showarrow: false,
            bgcolor: 'white',
            borderwidth: 0,
            font: { size: fontSizes.label, color: colors.green }
        },
        {
            x: 0.22,
            y: 0.98,
            xref: 'paper',
            yref: 'paper',
            xanchor: 'left',
            yanchor: 'top',
            align: 'left',
            text: infoText,
            showarrow: false,
            bgcolor: 'white',
            bordercolor: '#000',
            borderwidth: 1,
            borderpad: 6,
            font: { size: fontSizes.base, color: '#000' }
        }
    ];
}

function buildInfoText(model) {
    const dMaxProd = model.dMaxProd;
    const dMax = model.dMax;
    return `dilution rate for maximum production = ${formatFixed(dMaxProd, 2)} h<sup>-1</sup><br>`
        + `washout dilution rate = ${formatFixed(dMax, 2)} h<sup>-1</sup>`;
}

function computeCs(d, muMax, ks, kd) {
    const denom = d + kd - muMax;
    if (Math.abs(denom) < 1e-9) return 0;
    const value = -(ks * ((d + kd) / denom));
    return Number.isFinite(value) ? value : 0;
}

function computeDmaxProd(dMaxPlot, ccAt) {
    if (dMaxPlot <= 0) return 0;
    const samples = 800;
    let bestD = 0;
    let bestVal = -Infinity;
    for (let i = 0; i <= samples; i += 1) {
        const d = (dMaxPlot * i) / samples;
        const val = d * ccAt(d);
        if (Number.isFinite(val) && val > bestVal) {
            bestVal = val;
            bestD = d;
        }
    }
    if (!Number.isFinite(bestVal) || bestVal <= 0) return 0;
    return bestD;
}

function getTickFormat(span) {
    const safeSpan = Math.abs(Number.isFinite(span) ? span : 0);
    if (safeSpan >= 1) return '.2f';
    if (safeSpan >= 0.1) return '.3f';
    if (safeSpan >= 0.01) return '.4f';
    if (safeSpan >= 0.001) return '.5f';
    return '.6f';
}

function rangeWithPadding(minRaw, maxRaw, padLow, padHigh) {
    let minVal = Number.isFinite(minRaw) ? minRaw : 0;
    let maxVal = Number.isFinite(maxRaw) ? maxRaw : minVal + 1;
    if (minVal > maxVal) {
        const temp = minVal;
        minVal = maxVal;
        maxVal = temp;
    }
    const span = Math.max(maxVal - minVal, 1e-6);
    const lower = minVal - span * padLow;
    const upper = maxVal + span * padHigh;
    return [lower, upper];
}

function updatePlotLayoutOffset() {
    if (!elements.plotLayout || !elements.svgContainer) return;
    const containerRect = elements.svgContainer.getBoundingClientRect();
    const anchor = elements.iconContainer || elements.sliderStack;
    if (!anchor) return;
    const anchorRect = anchor.getBoundingClientRect();
    const offset = Math.max(anchorRect.bottom - containerRect.top + 8, 0);
    elements.plotLayout.style.setProperty('--plot-top', `${Math.round(offset)}px`);
}

function clamp(value, min, max) {
    if (!Number.isFinite(value)) return min;
    return Math.min(Math.max(value, min), max);
}

function sanitizeValue(value) {
    if (!Number.isFinite(value)) return 0;
    return value;
}

function formatFixed(value, digits) {
    if (!Number.isFinite(value)) return '0';
    return Number(value).toFixed(digits);
}

function showPlotPlaceholder(message) {
    if (!plotlyRoot) return;
    plotlyRoot.innerHTML = `<div class="plotly-placeholder">${message}</div>`;
}

async function loadPlotly() {
    if (window.Plotly) return window.Plotly;
    if (!plotlyPromise) {
        plotlyPromise = new Promise((resolve, reject) => {
            let script = document.querySelector('script[data-plotly-loader="true"]');
            if (!script) {
                script = document.createElement('script');
                script.src = plotlyScriptUrl;
                script.async = true;
                script.dataset.plotlyLoader = 'true';
            }

            const handleLoad = () => {
                script.dataset.plotlyLoaded = 'true';
                if (window.Plotly) resolve(window.Plotly);
                else {
                    plotlyPromise = null;
                    reject(new Error('Plotly failed to expose API'));
                }
            };

            const handleError = () => {
                plotlyPromise = null;
                reject(new Error('Plotly failed to load'));
            };

            if (script.dataset.plotlyLoaded === 'true' && window.Plotly) {
                resolve(window.Plotly);
                return;
            }

            script.addEventListener('load', handleLoad, { once: true });
            script.addEventListener('error', handleError, { once: true });
            if (!script.parentNode) document.head.appendChild(script);
        });
    }
    return plotlyPromise;
}

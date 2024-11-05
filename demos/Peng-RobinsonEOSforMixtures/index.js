window.g = {
    cnv: undefined,
    temp: 390, // Initial temperature
    mr: 0.55, // Initial mole fraction of n-butane in liquid
    R: 8.314,
    Pc: [3.797, 2.486],
    Tc: [425.2, 568.8],
    w: [0.193, 0.396],
    theta1: 0.22806,
    theta2: 0.18772
};

function setup() {
    g.cnv = createCanvas(700, 420);
    g.cnv.parent("graphics-wrapper");
    graph.setBounds(700, 420);
    graph.setLabelRanges([50, 2.5e5], [0.01, 50]);
}

const graph = new P5_Graph({
    classList: [""],
    title: "n-butane(1)/n-octane(2)",
    titleFontSize: 20,
    padding: [
        [60, 20],
        [30, 50],
    ],
    parent: document.getElementById("graph-container"),
    xTitle: 'Volume (cm^3/mol)',
    yTitle: 'Pressure (MPa)',
})

function draw() {
    graph.on_draw();
    const T = g.temp;
    const x1 = g.mr;
    const x2 = 1 - x1;

    const R = g.R;
    const Pc = g.Pc;
    const Tc = g.Tc;
    const w = g.w;
    const theta1 = g.theta1;
    const theta2 = g.theta2;

    let kappa = (i) => 0.37464 + 1.54226 * w[i] - 0.26992 * w[i] ** 2;
    let a = (i) => 0.45724 * (R ** 2 * Tc[i] ** 2) / Pc[i] * (1 + kappa(i) * (1 - sqrt(T / Tc[i]))) ** 2;
    let b = (i) => 0.0778 * (R * Tc[i]) / Pc[i];

    let Psat1 = 0.1 * 10 ** (4.35576 - 1175.581 / (T - 2.071)); // butane
    let Psat2 = 0.1 * 10 ** (4.04867 - 1355.126 / (T - 63.63)); // octane
    let Pvle = x1 * Psat1 + x2 * Psat2;

    // Calculate am and bm
    let am = (z) => z[0] * z[1] * sqrt(a(0) * a(1));
    let bm = (z) => z[0] * b(0) + z[1] * b(1);

    let x = [x1, x2];
    let y1 = x1 * Psat1 / Pvle;
    let y = [y1, 1 - y1];

    let vol = [];
    let P = (z, V) => (R * T) / (V - bm(z)) - am(z) / (V ** 2 + 2 * V * bm(z) - bm(z) ** 2);

    // Collect volumes and pressures for graphing
    for (let V = 50; V < 2.5e5; V += 500) {
        let P_x = P(x, V);
        let P_y = P(y, V);
        vol.push([V, P_x, P_y]);
    }

    graph.clear();

    // Plot both the liquid and vapor phase curves
    graph.plotLine(vol, 1, { color: 'blue' });
    graph.plotLine(vol, 2, { color: 'green' });

    // Display results
    fill(0);
    text(`Temperature: ${T} K`, 20, 20);
    text(`x1: ${x1.toFixed(2)} (n-Butane mole fraction)`, 20, 40);
    text(`VLE Pressure: ${Pvle.toFixed(2)} MPa`, 20, 60);
}

// Event listeners for sliders
document.getElementById("temperature-slider").addEventListener("input", function () {
    const T = Number(this.value);
    window.g.temp = T;
    document.getElementById("temp-label").textContent = T;
});

document.getElementById("molar-slider").addEventListener("input", function () {
    const x1 = Number(this.value);
    window.g.mr = x1;
    document.getElementById("molar-label").textContent = x1.toFixed(2);
});
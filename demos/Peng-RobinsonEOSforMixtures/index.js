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

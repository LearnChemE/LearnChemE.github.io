window.g = {
    cnv: undefined,

    temp: 350,
    mr: .2,

    deltaH: -50000, // J/(L pure A)
    Cp: 50, // J/(L K)


    energyBalEqn: [0, 0],
}

function setup() {
    g.cnv = createCanvas(700, 420);
    g.cnv.parent("graphics-wrapper");
    graph.setBounds(700, 420);
    graph.setLabelRanges([300, 550], [0, 1]);


}

const graph = new P5_Graph({
    classList: [""],
    title: "A ⇌ B",
    titleFontSize: 20,
    padding: [
        [60, 20],
        [30, 50],
    ],
    parent: document.getElementById("graph-container"),
    xLabelPrecision: 0,
    yLabelPrecision: 1,
    xTitle: 'temperature (K)',
    yTitle: 'conversion',
})


function draw() {
    graph.on_draw();
    graph.drawLine(nrgBal(), 'blue');
}

function nrgBal() {
    let k = (1 + g.mr) * g.Cp / g.deltaH;
    return [k * g.temp, -k];
}

const tempElement = document.getElementById("temperature-slider");
const tempLabel = document.getElementById("temp-label");

const molElement = document.getElementById("molar-slider");
const molLabel = document.getElementById("molar-label");

tempElement.addEventListener("input", function () {
    let tmp = Number(tempElement.value);
    g.temp = tmp;
    tempLabel.innerHTML = `${tmp}`
})

molElement.addEventListener("input", function () {
    let tmp = Number(molElement.value);
    g.mr = tmp;
    molLabel.innerHTML = `${tmp.toFixed(2)}`
})

$(() => {
    // Update the constants of the graph based on which reaction button is clicked
    $("#exothermic-btn").click(() => {
        g.deltaH = -50000;
        // Change Min and Max of the slider
        $("#temperature-slider").attr({
            min: 300,
            max: 400,
        });
        // toggleGraph();
    });
    $("#endothermic-btn").click(() => {
        g.deltaH = 50000;
        // Change Min and Max of the slider
        $("#temperature-slider").attr({
            min: 400,
            max: 500,
        });
        // toggleGraph();
    });

    // Labels for lines on the graph
    const energyBalanceLabel = $("<text>energy balance</text>");
    energyBalanceLabel.css({
        x: 55,
        y: 85,
        color: "blue",
    });
    $("#equilibrium-conversion-from-ke-curve").append(energyBalanceLabel);
});
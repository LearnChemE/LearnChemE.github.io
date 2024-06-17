window.g = {
    cnv: undefined,

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
}
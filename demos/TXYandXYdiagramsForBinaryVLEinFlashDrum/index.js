
window.g = {
    cnv: undefined,
    diagram: "x-y",
    x: 0.5,
    ratio: 2,

    // Graph edges
    lx: 100,
    rx: 650,
    ty: 50,
    by: 450,
    lx1: 425, // lx1 & rx1 for when there's two graphs
    rx1: 650,

    // Colors to be used repeatedly
    blue: [0,0,200],
    green: [0,100,0],
    mag: [100,0,100],
}

function setup(){
    g.cnv = createCanvas(700,520);
    g.cnv.parent("graphics-wrapper");
    document.getElementsByTagName("main")[0].remove();
}

function draw(){
    background(250);
    if(g.diagram == "T-x-y" || g.diagram == "x-y"){
        singleGraph();
    } else {
        doubleGraph();
    }
    curveDraw();
    mathSolve();
}


// Event listeners and such
const diagramType = document.getElementById("diagram-type").children;
const ratioSlider = document.getElementById("ratio-slider");
const ratioLabel = document.getElementById("ratio-value");
const xSlider = document.getElementById("methanol-slider");
const xLabel = document.getElementById("methanol-value");

for(let i = 0; i < diagramType.length; i++){
    diagramType[i].addEventListener("click", function(){
        for(let j = 0; j < diagramType.length; j++){
            diagramType[j].classList.remove("selected");
        };
        diagramType[i].classList.add("selected");
        g.diagram = diagramType[i].value;
    });
};

ratioSlider.addEventListener("input", function(){
    const temp = Number(ratioSlider.value);
    ratioLabel.innerHTML = `${temp}`;
    g.ratio = temp;
});

xSlider.addEventListener("input", function(){
    const temp = Number(xSlider.value);
    xLabel.innerHTML = `${temp}`;
    g.x = temp;
});
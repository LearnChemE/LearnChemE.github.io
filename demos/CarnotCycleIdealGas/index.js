
window.g = {
    cnv: undefined,

    Tc: 250,
    Th: 351,
    V1: 2,
    V2: 6,
    ratio: 1.66,
    diagram: "P-V",
    engine: "heat-engine",
    eta: 0,
    COP: 0,

    // Graph edges
    lx: 70,
    rx: 420,
    ty: 50,
    by: 400,

    // Constants
    R: 8.3145,

    // Colors
    red: [200,0,0],
    blue: [0,0,200],

}

function setup(){
    g.cnv = createCanvas(700,450);
    g.cnv.parent("graphics-wrapper");
    document.getElementsByTagName("main")[0].remove();
}

function draw(){
    background(250);
    graphDraw();
    if(g.engine == 'heat-engine'){
        HE_figure();
    } else {
        HP_figure();
    }

    if(g.diagram == 'P-V'){
        PV_diagram();
    } else {
        TS_diagram();
    }
}

// Event listeners and such
const coldTemp = document.getElementById("cold-temp-slider");
const coldLabel = document.getElementById("cold-temp-label");

const hotTemp = document.getElementById("hot-temp-slider");
const hotLabel = document.getElementById("hot-temp-label");

const V1slider = document.getElementById("vol1-slider");
const V1label = document.getElementById("vol1-label");

const V2slider = document.getElementById("vol2-slider");
const V2label = document.getElementById("vol2-label");

const ratioSlider = document.getElementById("ratio-slider");
const ratioLabel = document.getElementById("ratio-label");

const diagramType = document.getElementById("diagram-type").children;
const engineType = document.getElementById("engine-type").children;

coldTemp.addEventListener("input", function(){
    const temp = Number(coldTemp.value);
    coldLabel.innerHTML = `${temp}`;
    g.Tc = temp;
});

hotTemp.addEventListener("input", function(){
    const temp = Number(hotTemp.value);
    hotLabel.innerHTML = `${temp}`;
    g.Th = temp;
});

V1slider.addEventListener("input", function(){
    const temp = Number(V1slider.value);
    V1label.innerHTML = `${temp}`;
    g.V1 = temp;
});

V2slider.addEventListener("input", function(){
    const temp = Number(V2slider.value);
    V2label.innerHTML = `${temp}`;
    g.V2 = temp;
});

ratioSlider.addEventListener("input", function(){
    const temp = Number(ratioSlider.value);
    ratioLabel.innerHTML = `${temp}`;
    g.ratio = temp;
});

for(let i = 0; i < diagramType.length; i++){
    diagramType[i].addEventListener("click", function(){
        for(let j = 0; j < diagramType.length; j++){
            diagramType[j].classList.remove("selected");
        };
        diagramType[i].classList.add("selected");
        g.diagram = diagramType[i].value;
    });
};

for(let i = 0; i < engineType.length; i++){
    engineType[i].addEventListener("click", function(){
        for(let j = 0; j < engineType.length; j++){
            engineType[j].classList.remove("selected");
        };
        engineType[i].classList.add("selected");
        g.engine = engineType[i].value;
    });
};
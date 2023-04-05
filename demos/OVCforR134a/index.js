
window.g = {
    cnv: undefined,
    diaORcycle: "diagram",
    axes: "pressure-enthalpy",

    Pcond: 1, // Condenser pressure value
    Pevap: 0.15, // Evaporator pressure value

    // Graph edges
    lx: 100,
    rx: 650,
    ty: 50,
    by: 450,

    // Colors to be used repeatedly
    orange: [200,100,0],
    purple: [150,0,200],
}

function setup(){
    g.cnv = createCanvas(700,520);
    g.cnv.parent("graphics-wrapper");
    document.getElementsByTagName("main")[0].remove();
}

function draw(){
    background(250);
    if(g.diaORcycle == "diagram"){
        graphDraw();
        curveDraw();
        if(g.axes == "pressure-enthalpy"){
            PE_OVC();
        } else {
            TS_OVC();
        }
    } else {
        cycleDraw();
    }
}


// Event listeners and such
const diagramType = document.getElementById("diagram-type").children;
const axes = document.getElementById("axes").children;
const condenserValue = document.getElementById("condenser-slider");
const condenserLabel = document.getElementById("condenser-value");
const evaporatorValue = document.getElementById("evaporator-slider");
const evaporatorLabel = document.getElementById("evaporator-value");

// For hiding the sliders in cycle mode
const condenserSlider = document.getElementById("condenser");
const evaporatorSlider = document.getElementById("evaporator");
const axesButton = document.getElementById("axes");
const PE = document.getElementById("pressure-enthalpy");
const TS = document.getElementById("temperature-entropy");
const pressuresSpan = document.getElementById("pressure")


condenserValue.addEventListener("input", function(){
    const temp = Number(condenserValue.value);
    condenserLabel.innerHTML = `${temp}`;
    g.Pcond = temp;
});

evaporatorValue.addEventListener("input", function(){
    const temp = Number(evaporatorValue.value);
    evaporatorLabel.innerHTML = `${temp}`;
    g.Pevap = temp;
});

for(let i = 0; i < diagramType.length; i++){
    diagramType[i].addEventListener("click", function(){
        for(let j = 0; j < diagramType.length; j++){
            diagramType[j].classList.remove("selected");
        }
        diagramType[i].classList.add("selected");
        g.diaORcycle = diagramType[i].value;

        if(g.diaORcycle == "diagram"){
            pressuresSpan.innerHTML = "<b>pressures (MPa):</b>";
            PE.disabled = false;
            TS.disabled = false;
            evaporatorSlider.style.display = "grid";
            condenserSlider.style.display = "grid";
        } else {
            pressuresSpan.innerHTML = "<b>mouse over the numbers to display phases</b>";
            PE.disabled = true;
            TS.disabled = true;
            evaporatorSlider.style.display = "none";
            condenserSlider.style.display = "none";
        }
    });
};

for(let i = 0; i < axes.length; i++){
    axes[i].addEventListener("click", function(){
        for(let j = 0; j < axes.length; j++){
            axes[j].classList.remove("selected");
        }
        axes[i].classList.add("selected");
        g.axes = axes[i].value;
    });
};
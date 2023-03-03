
window.g = {
    cnv: undefined,
    slider: 500,
    diagram: "P-V-diagram",

    // Constants to be used 
    R: 8.314,
    Tc: 647.096,
    Pc: 22.12,
    Vc: 0,
    w: 0.344,
    a: 0,
    b: 0,

    topText: 0,


    // Graph edge coordinates to be used when plotting
    lx: 100,
    rx: 750,
    ty: 75,
    by: 525,
    dx: 190,

}

function setup() {
    g.cnv = createCanvas(800,600);
    g.cnv.parent("graphics-wrapper");
    document.getElementsByTagName("main")[0].remove();
    fillConstants();
    generatePixelData();
    sliderProps();
}

function draw() {
    background(250);
    graphDraw();
    
    if(g.diagram == 'P-V-diagram'){
        pressureVolume();
    } else {
        temperatureVolume();
    }

    graphLabels();
    PsatORTsat();
    
    
    
}

const slider = document.getElementById("slider");
const slider_label = document.getElementById("slider-value");
const slider_units = document.getElementById("units");
const diagramType = document.getElementById("diagram-type").children;



slider.addEventListener("input", function (){
    const temp = Number(slider.value);
    slider_label.innerHTML = `${temp}`;
    g.slider = temp;
});

for(let i = 0; i < diagramType.length; i++){
    diagramType[i].addEventListener("click", function(){
        for(let j = 0; j < diagramType.length; j++){
            diagramType[j].classList.remove("selected");
            
        };
        diagramType[i].classList.add("selected");
        g.diagram = diagramType[i].value;
        sliderProps();
        
    });
};

// Changes slider values accordingly
function sliderProps() {
    if(g.diagram == "P-V-diagram"){
        slider.setAttribute("min","275");
        slider.setAttribute("max","750");
        slider.setAttribute("step","5");
        slider.value = "500";
        g.slider = Number(slider.value);
        slider_label.innerHTML = `${g.slider}`;
        slider_units.innerHTML = "Temperature (K)";
    } else {
        slider.setAttribute("min","0.2");
        slider.setAttribute("max","25");
        slider.setAttribute("step","0.2");
        slider.value = "9";
        g.slider = Number(slider.value);
        slider_label.innerHTML = `${g.slider}`;
        slider_units.innerHTML = "Pressure (MPa)";
    }
}

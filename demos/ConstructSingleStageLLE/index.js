window.g = {
    cnv: undefined,

    problemPart: 0, // Keeps track of what part of the question we're on
    massPercents: [80,20,0], // Solute, carrier, solvent

    // Triangle information
    angle: 60,
    xtip: 0,
    ytip: 0,
    dy: 0,
    dx: 0,
    L: [0,0],
    R: [0,0],
    
    tiepx: [], // Holds the pixel information about tie lines

    question: 'Step 1: move the point to the correct feed composition', // Question text
    phaseNumber: 0, // For which phase curve and tie lines will be used
    solutionTruth: false, // For keeping track of the answer being submitted
    
    // Color information to be used repeatedly
    blue: [0,0,255],
    red: [100,0,0],
    green: [0,100,0],

    // Colors to be used in the various parts
    color1: [200,100,0], // Step 1
    color2: [0,100,0], // Step 2
    color3: [200,0,200], // Step 3
    color4: [120,0,120], // Step 4
    color6R: [0,100,255], // Step 6 Raffinate
    color6E: [255,0,0], // Step 6 Extract


    // The various answers for each part
    step1: [0,0,0], // Solute, carrier, solvent
    step2: [0,0,0], // Solute, carrier, solvent
    step4: [0,0,0], // Feed, F/S, solvent

    // Variables for use in manipulating dots to submit answers
    radius: 8,
    points: [],
    nP: 1,
    dragPoint: null,

}

function setup(){
    g.cnv = createCanvas(750,500);
    g.cnv.parent("graphics-wrapper");
    document.getElementsByTagName("main")[0].remove();
    triSetup();
    phaseAndTietoPx();
    assignPhase();
    assignAnswers();
    for(let i = 0; i < g.nP; i++){
        g.points.push(createVector(g.xtip,g.ytip+94));
    }
}

function draw(){
    background(250);
    frameDraw(); // Doesn't change
    phaseAndTieDraw(); // Changes with new problem
    questionDetails();
    hideSliders();
    
    
    answersAndInput();

    

    // for(let p of g.points){
    //     ellipse(p.x,p.y,g.radius*2);
    // }
}


// Event listeners and the like
const newProblem = document.getElementById("new-problem");
const nextPart = document.getElementById("next-part");
const solutionButton = document.getElementById("solution");
const questionText = document.getElementById("question");
// Sliders
const soluteMass = document.getElementById("solute-mass-slider");
const soluteLabel = document.getElementById("solute-mass-value");
const carrierMass = document.getElementById("carrier-mass-slider");
const carrierLabel = document.getElementById("carrier-mass-value");
const solventMass = document.getElementById("solvent-mass-slider");
const solventLabel = document.getElementById("solvent-mass-value");

// For hiding and displaying them depending on problem part
const soluteSlider = document.getElementById("slider1");
const carrierSlider = document.getElementById("slider2");
const solventSlider = document.getElementById("slider3");

newProblem.addEventListener("click", function(){
    g.solutionTruth = false;
    solutionButton.disabled = false;
    g.problemPart = 0;
    nextPart.disabled = false;
    startingPoints();
    questionTextLabel();
    assignPhase();
    assignAnswers();
});

nextPart.addEventListener("click", function(){
    g.solutionTruth = false;
    solutionButton.disabled = false;
    if(g.problemPart < 5){
        g.problemPart++;
    } 

    if(g.problemPart == 5){
        nextPart.disabled = true;
    }
    startingPoints();
    questionTextLabel();
});

solutionButton.addEventListener("click", function(){
    g.solutionTruth = true;
    solutionButton.disabled = true;
});

soluteMass.addEventListener("input", function(){
    const temp = Number(soluteMass.value);
    soluteLabel.innerHTML = `${temp}`;
    g.massPercents[0] = temp;
});

carrierMass.addEventListener("input", function(){
    const temp = Number(carrierMass.value);
    carrierLabel.innerHTML = `${temp}`;
    g.massPercents[1] = temp;
});

solventMass.addEventListener("input", function(){
    const temp = Number(solventMass.value);
    solventLabel.innerHTML = `${temp}`;
    g.massPercents[2] = temp;
});

function questionTextLabel(){
    if(g.problemPart == 0){
        questionText.style = "margin-top: 5px"
        questionText.innerHTML = "(1) Feed composition";
    } else if (g.problemPart == 1){
        questionText.style = "margin-top: 5px"
        questionText.innerHTML = "(2) Solvent composition";
    } else if (g.problemPart == 2){
        questionText.style = "margin-top: 5px";
        questionText.innerHTML = "(3) Draw mass balance line";
    } else if (g.problemPart == 3){
        questionText.style = "margin-top: 5px";
        questionText.innerHTML = "(4) Mixing point composition";
    } else if (g.problemPart == 4){
        questionText.style = "margin-top: 5px";
        questionText.innerHTML = "(5) Mixing point composition";
    } else if (g.problemPart == 5){
        questionText.style = "margin-top: 5px";
        questionText.innerHTML = "(6) Outlet streams";
    }
}

function triSetup(){
    g.xtip = 450;
    g.ytip = 50;
    g.dy = 375;
    g.dx = g.dy*Math.tan(radians(g.angle/2));

    g.R[0] = g.dy/g.dx; // Right line slope
    g.R[1] = g.ytip - g.R[0]*g.xtip; // Right line b-value
    
    g.L[0] = g.dy/-g.dx; // Left line slope
    g.L[1] = g.ytip - g.L[0]*g.xtip; // Left line b-value
}

function hideSliders(){
    if(g.problemPart == 4){ // Shows sliders
        soluteSlider.style.display = 'grid';
        carrierSlider.style.display = 'grid';
        solventSlider.style.display = 'grid';
    } else { // Hides sliders and resets values
        soluteSlider.style.display = 'none';
        carrierSlider.style.display = 'none';
        solventSlider.style.display = 'none';

        soluteMass.value = '80';
        soluteLabel.innerHTML = '80';
        g.massPercents[0] = 80;

        carrierMass.value = '20';
        carrierLabel.innerHTML = '20';
        g.massPercents[1] = 20;

        solventMass.value = '0';
        solventLabel.innerHTML = '0';
        g.massPercents[2] = 0;
    }
}

// For manipulating the position of dot within the triangle
function mousePressed(){
    for (let i = g.points.length - 1; i >= 0; i--) {
      const isPressed = inCircle(g.points[i], g.radius);
      if (isPressed) {
        g.dragPoint = g.points.splice(i, 1)[0];
        g.points.push(g.dragPoint);
  
      }
    }
}

function mouseDragged(){
    if(!g.solutionTruth){
        if(g.dragPoint){
            g.dragPoint.x = mouseX;
            g.dragPoint.y = mouseY;
        }
    }
}

function mouseReleased(){
    g.dragPoint = null;
}

function inCircle(pos,radius){
    return dist(mouseX, mouseY, pos.x, pos.y) < radius;
}



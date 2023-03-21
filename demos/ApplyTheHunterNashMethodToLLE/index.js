window.g = {
    cnv: undefined,

    // Variables related to triangle
    angle: 60,
    xtip: 0,
    ytip: 0,
    dx: 0,
    dy: 0,
    L: [0,0],
    R: [0,0],

    // Phase information
    phaseConstants: [0,0,0],
    yVals: [0,0,0],
    phaseLims: [0,0],
    tiepx: [],
    tieslopes: [],
    tiebs: [],


    // Variables related to buttons
    solutionTruth: false,
    hintTruth: false,
    problemPart: 6,
    hintText: 'Hint: read the compositions on the axes',

    // Colors to be used repeatedly
    blue: [0,0,200],
    red: [100,0,0],
    green: [0,100,0],
    part4: [0,100,200],
    part5: [255,100,0],
    part6: [120,0,120],

    // Variables for use in manipulating dots to submit answers
    radius: 8,
    points: [],
    nP: 1,
    dragPoint: null,
    temp: [0,0],
}

ans = {
    step1: [0,0,0], // solute, solvent, carrier (Feed)
    step2: [0,1,0], // solute, solvent, carrier (Solvent)
    step3: [0,0,0], // solute, solvent, carrier (Rn)
    step4: [0,0,0,0,0,0], // solute, solvent, carrier, F, S, M (Mixing point)
    step3px: [0,0], // Keeping these stored as well to make step 5 easier
    step5: [0,0], // Pixel values (x and y) for extract1
    step6: [0,0], // Pixel values (x and y) for operating point

}

function setup(){
    g.cnv = createCanvas(800,550);
    g.cnv.parent("graphics-wrapper");
    document.getElementsByTagName("main")[0].remove();
    triSetup();
    g.points.push(createVector(g.xtip,g.ytip+94));
    startingPoints();
    definePhaseCurve();
    generateAnswers();
    defineTieLines();
}

function draw(){
    background(250);
    frameDraw();
    phaseDraw();
    questionOrHintDisplay();
    answersAndUserInput();


}


// Event listeners and such
const newProblem = document.getElementById("new-problem");
const nextPart = document.getElementById("next-part");
const solutionButton = document.getElementById("solution");
const hintButton = document.getElementById("hint");
const questionText = document.getElementById("question");

newProblem.addEventListener("click",function(){
    g.solutionTruth = false;
    g.hintTruth = false;
    hintButton.innerHTML = 'Show hint';
    hintButton.disabled = false;

    solutionButton.disabled = false;
    nextPart.disabled = false;
    g.problemPart = 0;

    definePhaseCurve();
    generateAnswers();
    startingPoints();
    
    defineTieLines();
    questionTextLabel();
});

nextPart.addEventListener("click",function(){
    g.solutionTruth = false;
    g.hintTruth = false;
    hintButton.innerHTML = 'Show hint';
    solutionButton.disabled = false;
    hintButton.disabled = false;

    if(g.problemPart < 10){
        g.problemPart++;
    }

    if(g.problemPart == 10){
        nextPart.disabled = true;
        hintButton.disabled = true;
    }
    startingPoints();
    questionTextLabel();
});

solutionButton.addEventListener("click",function(){
    g.solutionTruth = true;
    solutionButton.disabled = true;
    hintButton.disabled = true;
});

hintButton.addEventListener("click",function(){
    g.hintTruth = !g.hintTruth;
    if(g.hintTruth == true){
        hintButton.innerHTML = 'Hide hint';
    } else {
        hintButton.innerHTML = 'Show hint'
    }
    
});

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

// For modifying span element in HTML
function questionTextLabel(){
    switch (g.problemPart){
        case (0):
            questionText.style = "margin-top: 5px";
            questionText.innerHTML = "(1) locate feed point";
            break;
        case (1):
            questionText.style = "margin-top: 5px";
            questionText.innerHTML = "(2) locate solvent point";
            break;
        case (2): 
            questionText.style = "margin-top: 5px";
            questionText.innerHTML = "(3) locate raffinate point";
            break;
        case (3):
            questionText.style = "margin-top: 5px";
            questionText.innerHTML = "(4) locate mixing point";
            break;
        case (4):
            questionText.style = "margin-top: 5px";
            questionText.innerHTML = "(5) locate first extract point";
            break;
        case (5):
            questionText.style = "margin-top: 5px";
            questionText.innerHTML = "(6) locate operating point";
            break;
        case (6):
            questionText.style = "margin-top: 5px";
            questionText.innerHTML = "(7) determine R<sub>1</sub>";
            break;
        case (7):
            questionText.style = "margin-top: 5px";
            questionText.innerHTML = "(8) determine E<sub>2</sub>";
            break;
        case (8):
            questionText.style = "margin-top: 5px";
            questionText.innerHTML = "(9) determine R<sub>2</sub>";
            break;
        case (9): 
            questionText.style = "margin-top: 5px";
            questionText.innerHTML = "(10) determine E<sub>3</sub>";
            break;
        case (10):
            questionText.style = "margin-top: 5px";
            questionText.innerHTML = "(11) solution";
            break;
    }
}


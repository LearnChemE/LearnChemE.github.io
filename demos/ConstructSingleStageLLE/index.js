window.g = {
    cnv: undefined,
    problemPart: 0,

    // Triangle information
    angle: 60,
    xtip: 0,
    ytip: 0,
    dy: 0,
    dx: 0,
    L: [0,0],
    R: [0,0],
    blue: [0,0,255],
    red: [100,0,0],
    green: [0,100,0],

    // Holds the pixel information about tie lines
    tiepx: [],


    // Question text
    question: 'Step 1: move the point to the correct feed composition',
    // For which phase curve and tie lines will be used
    phaseNumber: 0,
    

}

function setup(){
    g.cnv = createCanvas(750,500);
    g.cnv.parent("graphics-wrapper");
    document.getElementsByTagName("main")[0].remove();
    triSetup();
    //addPhasePoints();
    phaseAndTietoPx();
    assignPhase();
}

function draw(){
    background(250);
    frameDraw();
    phaseAndTieDraw();
    //console.log(tie[1])

}


// Event listeners and the like
const newProblem = document.getElementById("new-problem");
const nextPart = document.getElementById("next-part");
const solutionButton = document.getElementById("solution");
const questionText = document.getElementById("question");

newProblem.addEventListener("click", function(){
    g.problemPart = 0;
    nextPart.disabled = false;
    questionTextLabel();
    assignPhase();
});

nextPart.addEventListener("click", function(){
    if(g.problemPart < 5){
        g.problemPart++;
    } 

    if(g.problemPart == 5){
        nextPart.disabled = true;
    }

    questionTextLabel();
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



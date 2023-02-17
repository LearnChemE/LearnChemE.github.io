window.g = {
    cnv: undefined,
    alfa: 0,
    upORdown: true,

    heatWall: 'A',
    kvalues: [0,0,0], // W/m-K (A,B,C)
    Rtc: 0.08, // m^2-K/W
    Q: 0, // kW/M
    length: 20/1000, // 20 mm for each wall
    h: 10, // W/[m^2-K]
    Tinf: 20, // C

    wallX: [570,410,400,240,230,70], // Positions of wall edges

    answers: [0,0,0,0,0],
    chosenAnswer: null,
    problemPart: 0,

}

function setup() {
    g.cnv = createCanvas(800,600);
    g.cnv.parent("graphics-wrapper");
    document.getElementsByTagName("main")[0].remove();
    
    assignWall();
    assignThermalProps();
    g.answers = assignAnswers();
   
}

let t = [1,2,3,4,5]

function draw(){
    background(250);
    alphaManipulation();
    frameDraw();
    question();

    if(g.heatWall == 'A'){
        solveProblemA();
    }
    
    
    
}


// Event listeners and the like
const newProblem = document.getElementById("new-problem");
const nextPart = document.getElementById("next-part");
const answerChoices = [document.getElementById("answerA"),document.getElementById("answerB"),document.getElementById("answerC"),document.getElementById("answerD"),document.getElementById("answerE")];

newProblem.addEventListener("click", function(){
    assignWall(); // Reassigns wall that's generating heat
    assignThermalProps(); // Reassigns various thermal properties
    g.answers = assignAnswers(); // Reassigns the answer choices
    g.alfa = 0;
    g.problemPart = 0;
    nextPart.disabled = false;

    // Removes the previously selected answer choice
    for(let i = 0; i < answerChoices.length; i++){
        if(answerChoices[i].checked){
            answerChoices[i].checked = false;
        }
    }
});

nextPart.addEventListener("click", function(){
    if(g.problemPart < 1){
        g.problemPart++;
    } else {
        nextPart.disabled = true;
    }
});


// Gets selected answer choice
for(let i = 0; i < answerChoices.length; i++){
    answerChoices[i].addEventListener("click", function(){
        for(let j = 0; j < answerChoices.length; j++){
            if(answerChoices[j].checked){
                g.chosenAnswer = answerChoices[j].value;
            };
        };
    });
};
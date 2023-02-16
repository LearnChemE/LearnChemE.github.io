window.g = {
    cnv: undefined,
    alfa: 0,
    upORdown: true,

    heatWall: 'A',
    kvalues: [0,0,0],
    Rtc: 0,
    Q: 0,

    answers: [0,0,0,0,0],

}

function setup() {
    g.cnv = createCanvas(800,600);
    g.cnv.parent("graphics-wrapper");
    document.getElementsByTagName("main")[0].remove();
    
    assignWall();
    assignThermalProps();
    g.answers = assignAnswers();
    frameRate(2);
}

let t = [1,2,3,4,5]

function draw(){
    background(250);

    alphaManipulation();
    frameDraw();
    question();
    
    
    //console.log(Math.round(Math.random()*2)) //gets random number 0, 1, or 2
    
    
}
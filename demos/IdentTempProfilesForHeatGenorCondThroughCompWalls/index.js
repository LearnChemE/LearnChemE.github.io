window.g = {
    cnv: undefined,
    alfa: 0,
    upORdown: true,

}

function setup() {
    g.cnv = createCanvas(800,600);
    g.cnv.parent("graphics-wrapper");
    document.getElementsByTagName("main")[0].remove();
}

function draw(){
    background(250);

    frameDraw();
    alphaManipulation();

    
    // push();
    // fill(255,0,0,g.alfa);
    // rect(100,100,100,100);
    // pop();
    
}
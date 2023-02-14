
// Draws general shape of and some layers
function frameDraw(){
    push();
    fill(0);
    for(let i = 0; i <= 2; i++){
        rect(640+50*i, 200, 1, 300);
        triangle(630+50*i,200,650+50*i,200,640+50*i,170);
    }

    textSize(25); noStroke();
    text("T  =  20\xB0C", 625, 100);
    text("h = 10 W/[m  K]", 595, 150);

    textSize(20);
    text("2",730,138);
    pop();
}

// This is used to modify the alpha value to highlight the wall segment that is generating heat
function alphaManipulation(){
    if(g.alfa < 255 && g.upORdown){
        g.alfa++;
        if(g.alfa >= 255){
            g.upORdown = false;
        }
    } else if (!g.upORdown){
        g.alfa--;
        if(g.alfa <= 0){
            g.upORdown = true;
        }
    }
}
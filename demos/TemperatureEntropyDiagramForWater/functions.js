

function graphDraw(){
    let temp_labels = ['0','50','100','150','200','250','300','350','400','450','500','550','600'];
    let s_labels = ['0','1','2','3','4','5','6','7','8','9'];
    
    push();
    textSize(18);
    

    for(let i = 0; i < temp_labels.length; i++){
        if(i > 0 && i < temp_labels.length-1){
            line(g.xL,g.by-(g.by-g.ty)/12*i,g.xL+5,g.by-(g.by-g.ty)/12*i);
        }

        if(i == 0){
            text(temp_labels[i],g.xL-15,g.by-(g.by-g.ty)/12*i+7)
        } else if (i == 1){
            text(temp_labels[i],g.xL-25,g.by-(g.by-g.ty)/12*i+7);
        } else {
            text(temp_labels[i],g.xL-35,g.by-(g.by-g.ty)/12*i+7);
        }
        
    
    }

    for(let i = 0; i < s_labels.length; i++){
        line(g.xL+10+(g.xR-g.xL-20)/9*i,g.by,g.xL+10+(g.xR-g.xL-20)/9*i,g.by-5);
        text(s_labels[i],g.xL+10+(g.xR-g.xL-20)/9*i-5,g.by+20);
    }
    noFill();
    rect(100,40,600,500);
    pop();

    
}
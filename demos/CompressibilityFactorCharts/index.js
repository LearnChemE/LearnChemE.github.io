window.g = {
    cnv: undefined,

    // Element graphs being shown for
    element: "n-hexane",

    // Variable that holds vectors for the chosen element and the curve coefficients of upper line
    vec: [],

    // Graph edges
    lx: 75,
    rx: 675,
    ty: 50,
    by: 450,

    // For manipulating the dot
    radius: 5,
    points: [],
    nP: 1,
    dragPoint: null,
    lowerTest: false,
    higherTest: false,

}

function setup() {
    g.cnv = createCanvas(700, 500);
    g.cnv.parent("graphics-wrapper");
    document.getElementsByTagName("main")[0].remove();
    defineVecs();
    g.points.push(createVector(200,200));
}

function draw() {
    boundaryTest();
    background(250);
    frameDraw();
    curveDraw();
    


    push(); fill(0);
    temp = g.points[0]; ellipse(temp.x,temp.y,2*g.radius);
    pop();
}


const element = document.getElementById("element").children;
for (let i = 0; i < element.length; i++) {
    element[i].addEventListener("click", function () {
        for (let j = 0; j < element.length; j++) {
            element[j].classList.remove("selected");
        };
        element[i].classList.add("selected");
        g.element = element[i].value;
        defineVecs();
    });
};

// For manipulating the position of dot within the triangle
function mousePressed() {
    for (let i = g.points.length - 1; i >= 0; i--) {
        const isPressed = inCircle(g.points[i], g.radius);
        if (isPressed) {
            g.dragPoint = g.points.splice(i, 1)[0];
            g.points.push(g.dragPoint);

        }
    }
}

function mouseDragged() {

    if(g.dragPoint){
        if(g.lowerTest && g.higherTest && mouseX >= g.lx && mouseX <= g.rx){
            console.log('hello',g.lowerTest,g.higherTest)
            g.dragPoint.x = mouseX;
            g.dragPoint.y = mouseY;
        } else if (!g.lowerTest && g.higherTest && mouseX >= g.lx && mouseX <= g.rx){
            console.log('hello2',g.lowerTest,g.higherTest)
            g.dragPoint.x = mouseX;
            let Pr = map(mouseX,g.lx,g.rx,0,5); 
            let Z = find2D(Pr,Z10); console.log(Z)
            g.dragPoint.y = map(Z,0,1.1,g.by,g.ty);
        }
    }
}

function mouseReleased() {
    g.dragPoint = null;
}

function inCircle(pos, radius) {
    return dist(mouseX, mouseY, pos.x, pos.y) < radius;
}
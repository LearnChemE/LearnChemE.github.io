window.g = {
    cnv: undefined,
    width: 800,
    height: 480,

    orangeFluidColor: [255, 80, 0, 200],
    blueFluidColor: [0, 0, 255, 180],
}

function setup() {
    g.cnv = createCanvas(g.width, g.height);
    g.cnv.parent("graphics-wrapper");

    dt = doubleTubeGraphic(500, 400);
}

function draw() {
    background(250);
    image(dt, 0, 0);
}


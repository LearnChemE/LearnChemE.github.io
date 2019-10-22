/**functions related to the creation and deletion of LaTeX onto the p5 canvas*/

class Tex {
    constructor(_args) {
        this.name = _args["name"] || String("tex", Math.floor(Math.random()*1000000));
        this.content = _args["content"] || "hey put some text here";
        this.position = _args["position"] || [0, 0];

        this.div = createDiv(`\\( ${this.content}\\)`);
        this.div.parent('main');
        this.div.position(this.position[0], this.position[1]);
    }
}
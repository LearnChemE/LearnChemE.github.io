class submitInput {
    constructor (beforeText, w, afterText, buttonText) {
        this.beforeText = beforeText;
        this.w = w;
        this.afterText = afterText;
        this.buttonText = buttonText;
        this.i = createInput('');
        this.b = createButton(this.buttonText);
        this.b.mousePressed(performAction);
    }

    place (x, y) {
        push();
        textAlign(RIGHT, TOP);
        text(this.beforeText, x, y);
        this.i.size(this.w);
        this.i.position(margX + x + 10, margY + y);
        textAlign(LEFT);
        text(this.afterText, x + this.w*1.2 + 10, y);
        this.b.position(margX + x + this.w*1.2 + this.afterText.length*10 + 20, margY + y);
        this.i.show();
        this.b.show();
        pop();
    }

    hide () {
        this.i.hide();
        this.b.hide();
    }

}
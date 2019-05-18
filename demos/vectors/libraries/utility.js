class Between {
    constructor(x, a, b) {
        this.x = x;
        this.a = a;
        this.b = b;
        if(this.a >= this.b) {
            this.isBetween = this.x <= this.a && x >= this.b;
        } else if (this.a < this.b) {
            this.isBetween = this.x >= this.a && x <= this.b;
        }
    }

    interp() {
        return (this.x - this.a)/(this.b - this.a);
    }

    diff() {
        return (this.b - this.a)
    }
}
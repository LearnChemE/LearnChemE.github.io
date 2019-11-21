class Molecule {
    constructor(_args) {
        let colors = {'a': Acolor, 'b': Bcolor};
        this.component = _args['component'] || 'a';
        this.color = _args['color'] || colors[`${this.component}`];
        this.diameter = _args['diameter'] || 10;
        this.temperature = _args['temperature'] || 290;
        this.direction = Math.random() * Math.PI * 2;
        let determineState = Math.random();
        this.state = determineState > fracLiq ? 'vapor' : 'liquid';
        this.speed = this.state == 'vapor' ? (this.temperature - 273) / 3 : (this.temperature - 273) / 10;
        this.velocity = [Math.cos(this.direction)*this.speed, Math.sin(this.direction)*this.speed];
        this.position = [Math.trunc(Math.random()*dims), 0];
        this.position[1] = this.state == 'vapor' ?  Math.trunc(Math.random()*liquidLine) :  liquidLine + Math.trunc(Math.random()*(yDims - liquidLine));
        this.noiseScaleXY = 8;
        this.noiseScaleTheta = 0.8;
        this.noiseSeedX = Math.trunc(1000 * Math.random());
        this.noiseSeedY = Math.trunc(1000 * Math.random());        
        this.noiseSeedTheta = Math.trunc(1000 * Math.random()) / 1000;
        this.noiseX = 0;
        this.noiseY = 0;
        this.noiseTheta = 0;
        this.onoff = true;
        this.div = document.createElement('div');
        this.div.style.backgroundColor = this.color;
        this.div.classList.add('molecule');
        this.div.style.top = `${this.position[1]}px`;
        this.div.style.left = `${this.position[0]}px`;
        this.div.style.opacity = '0.75';
        document.getElementById('molecules').appendChild(this.div);
        if(this.state == 'liquid') {molsLiquid[0]++; if(this.component == 'a'){molsLiquid[1]++} else {molsLiquid[2]++}}
        else {molsVapor[0]++; if(this.component == 'a'){molsVapor[1]++} else {molsVapor[2]++}}
        xA = molsLiquid[1] / molsLiquid[0]; yA = molsVapor[1] / molsVapor[0]; xB = 1 - xA; yB = 1 - yA;
    }

    Draw() {
        this.Move();
        this.div.style.top = `${this.position[1]}px`;
        this.div.style.left = `${this.position[0]}px`;
    }

    Move(n) {

        this.onoff = !this.onoff;
        if(this.onoff) {
            this.noiseSeedX += 0.25;
            this.noiseSeedY += 0.25;
            this.noiseSeedTheta += 0.05;
            this.direction = Math.atan2(this.velocity[1], this.velocity[0]);

            this.noiseX = this.noiseScaleXY * /*noise(this.noiseSeedX)*/Math.random() - this.noiseScaleXY / 2;
            this.noiseY = this.noiseScaleXY * /*noise(this.noiseSeedY)*/Math.random() - this.noiseScaleXY / 2;
            this.noiseTheta = Math.random() * this.noiseScaleTheta - this.noiseScaleTheta / 2;

            this.direction += this.noiseTheta;
            this.velocity = [Math.cos(this.direction)*this.speed, Math.sin(this.direction)*this.speed];
        }

        if(this.position[0] <= 0) {this.velocity[0] = Math.abs(this.velocity[0])}
        if(this.position[0] >= dims - this.diameter) {this.velocity[0] = Math.abs(this.velocity[0]) * (-1)}
        if(this.position[1] <= 0) {this.velocity[1] = Math.abs(this.velocity[1])}
        if(this.position[1] >= yDims - this.diameter) {this.velocity[1] = Math.abs(this.velocity[1]) * (-1)}

        if(this.state == 'vapor' && this.position[1] >= liquidLine - this.diameter) {
            let condQ = this.Condense();
            this.velocity[1] = condQ ? Math.abs(this.velocity[1]) : Math.abs(this.velocity[1]) * (-1);
            this.noiseY = condQ ? Math.abs(this.noiseY) : Math.abs(this.noiseY) * (-1);
        }
        if(this.state == 'liquid' && this.position[1] <= liquidLine) {
            let evapQ = this.Evaporate();
            this.velocity[1] = evapQ ? Math.abs(this.velocity[1]) * (-1) : Math.abs(this.velocity[1]);
            this.noiseY = evapQ ? Math.abs(this.noiseY) * (-1) : Math.abs(this.noiseY) * 2;
        }

        let totalVelocity = [this.velocity[0] + this.noiseX, this.velocity[1] + this.noiseY];
        this.position[0] = Math.max(0, Math.min(dims - this.diameter, this.position[0] + totalVelocity[0]));
        this.position[1] = Math.max(0, Math.min(yDims - this.diameter, this.position[1] + totalVelocity[1]));
    }

    Condense() {
        molsLiquid[0]++;
        molsVapor[0]--;
        if(this.component == 'a') {molsLiquid[1]++;molsVapor[1]--} else {molsLiquid[2]++;molsVapor[2]--};
        xA = molsLiquid[1] / molsLiquid[0]; xB = 1 - xA;
        this.state = 'liquid';
        this.position[1] += this.diameter;
        this.speed /= 3;
        return true;
    }

    Evaporate() {
        if((this.component == 'a' && (yA/xA)/(yB/xB) <= Alpha) || (this.component == 'b' && (yA/xA)/(yB/xB) >= Alpha)) {
            if((molsLiquid[0]/mols) >= fracLiq) {
                molsVapor[0]++;
                molsLiquid[0]--;
                if(this.component == 'a') {molsVapor[1]++;molsLiquid[1]--} else {molsVapor[2]++;molsLiquid[2]--};
                yA = molsVapor[1] / molsVapor[0]; yB = 1 - yA;
                this.state = 'vapor';
                this.position[1] -= this.diameter;
                this.speed *= 2.5 + Math.random();
                return true;
            }
        }
        return false;
    }

    ChangeComponent(comp) {
        if(this.component != comp) {
            if(this.state == 'vapor') {if(this.component == 'a'){molsVapor[1]--;molsVapor[2]++}else{molsVapor[1]++;molsVapor[2]--}} else {if(this.component == 'a'){molsLiquid[1]--;molsLiquid[2]++}else{molsLiquid[1]++;molsLiquid[2]--}}
            xA = molsLiquid[1] / molsLiquid[0]; xB = 1 - xA;
            yA = molsVapor[1] / molsVapor[0]; yB = 1 - yA;
            this.component = comp;
            this.color = this.component == 'a' ? Acolor : Bcolor;
            this.div.style.backgroundColor = this.color;
        }
    }
}
class Molecule {
    constructor(_args) {
        let colors = {'a': 'rgba(100, 180, 0, 0.75)', 'b': 'rgba(50, 0, 150, 0.75)'};
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
        this.position[1] = this.state == 'vapor' ?  Math.trunc(Math.random()*liquidLine) :  liquidLine + Math.trunc(Math.random()*(dims - liquidLine));
        this.noiseScaleXY = 5;
        this.noiseScaleTheta = 0.2;
        this.noiseSeedX = Math.trunc(1000 * Math.random());
        this.noiseSeedY = Math.trunc(1000 * Math.random());        
        this.noiseSeedTheta = Math.trunc(1000 * Math.random()) / 1000;
        this.div = document.createElement('div');
        this.div.style.backgroundColor = this.color;
        this.div.classList.add('molecule');
        this.div.style.top = `${this.position[1]}px`;
        this.div.style.left = `${this.position[0]}px`;
        document.body.appendChild(this.div);
        if(this.state == 'liquid') {molsLiquid[0]++; if(this.component == 'a'){molsLiquid[1]++} else {molsLiquid[2]++}}
        else {molsVapor[0]++; if(this.component == 'a'){molsVapor[1]++} else {molsVapor[2]++}}
        xA = molsLiquid[1] / molsLiquid[0]; yA = molsVapor[1] / molsVapor[0]; xB = 1 - xA; yB = 1 - yA;
    }

    Draw() {
        this.Move();
        this.div.style.top = `${this.position[1]}px`;
        this.div.style.left = `${this.position[0]}px`;
    }

    Move() {
        
        this.noiseSeedX += 0.25;
        this.noiseSeedY += 0.25;
        this.noiseSeedTheta += 0.05;
        this.direction = atan2(this.velocity[1], this.velocity[0]);

        let noiseX = this.noiseScaleXY * noise(this.noiseSeedX) - this.noiseScaleXY / 2;
        let noiseY = this.noiseScaleXY * noise(this.noiseSeedY) - this.noiseScaleXY / 2;
        let noiseTheta = Math.random() * this.noiseScaleTheta - this.noiseScaleTheta / 2//this.noiseScaleTheta * noise(this.noiseSeedTheta) - this.noiseScaleTheta / 2;

        this.direction += noiseTheta;
        this.velocity = [Math.cos(this.direction)*this.speed, Math.sin(this.direction)*this.speed];

        if(this.position[0] <= 0) {this.velocity[0] = Math.abs(this.velocity[0])}
        if(this.position[0] >= dims - this.diameter) {this.velocity[0] = Math.abs(this.velocity[0]) * (-1)}
        if(this.position[1] <= 0) {this.velocity[1] = Math.abs(this.velocity[1])}
        if(this.position[1] >= dims - this.diameter) {this.velocity[1] = Math.abs(this.velocity[1]) * (-1)}

        if(this.state == 'vapor' && this.position[1] >= liquidLine - this.diameter) {
            let condQ = this.Condense();
            this.velocity[1] = condQ ? Math.abs(this.velocity[1]) : Math.abs(this.velocity[1]) * (-1);
            noiseY = condQ ? Math.abs(noiseY) : Math.abs(noiseY) * (-1);
        }
        if(this.state == 'liquid' && this.position[1] <= liquidLine) {
            let evapQ = this.Evaporate();
            this.velocity[1] = evapQ ? Math.abs(this.velocity[1]) * (-1) : Math.abs(this.velocity[1]);
            noiseY = evapQ ? Math.abs(noiseY) * (-1) : Math.abs(noiseY) * 2;
        }

        let totalVelocity = [this.velocity[0] + noiseX, this.velocity[1] + noiseY];
        this.position[0] = Math.max(0, Math.min(dims - this.diameter, this.position[0] + totalVelocity[0]));
        this.position[1] = Math.max(0, Math.min(dims - this.diameter, this.position[1] + totalVelocity[1]));
    }

    Condense() {
        if((this.component == 'a' && (yA/xA)/(yB/xB) >= Alpha) || (this.component == 'b' && (yA/xA)/(yB/xB) <= Alpha)) {
            if(Math.random() < condFraction && (molsVapor[0]/mols) >= (1 - fracLiq)) {
                molsLiquid[0]++;
                molsVapor[0]--;
                if(this.component == 'a') {molsLiquid[1]++;molsVapor[1]--} else {molsLiquid[2]++;molsVapor[2]--};
                xA = molsLiquid[1] / molsLiquid[0]; xB = 1 - xA;
                this.state = 'liquid';
                this.position[1] += this.diameter / 2;
                this.speed /= 3;
                return true;
            }
        }
        return false;
    }

    Evaporate() {
        if((this.component == 'a' && (yA/xA)/(yB/xB) <= Alpha) || (this.component == 'b' && (yA/xA)/(yB/xB) >= Alpha)) {
            if(Math.random() < evapFraction && (molsLiquid[0]/mols) >= fracLiq) {
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
}
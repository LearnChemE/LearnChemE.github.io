import { P5CanvasInstance } from "@p5-wrapper/react";

export class PathTrace
{
    totalTime: number;
    vertices: number[][];
    normDist: number[];

    constructor(totalTime: number, vertices: number[][]) {
        this.totalTime = totalTime;
        this.vertices = vertices;
        this.normDist = [0];

        this.setDistances();
    }

    setDistances() {
        var dist = new Array(this.vertices.length);
        var totDist: number = 0;
        var dif: Array<number>;

        dist[0] = 0;

        let vert = this.vertices; 
        // Find distances
        for (let i=0;i<vert.length-1;i++) {
            dif = [vert[i+1][0] - vert[i][0] , vert[i+1][1] - vert[i][1]];
            totDist += Math.sqrt(dif[0]*dif[0] + dif[1]*dif[1]);
            dist[i+1] = totDist;
        }
        
        var id = 1/totDist;
        // Normalize distances
        for (let i=0;i<dist.length;i++) {
            dist[i] *= id;
        }
        this.normDist = dist;
    };

    findPreviousVertex(time: number) {
        var lo;
        var s = time / this.totalTime;
        if (s>1) 
            return this.vertices.length-1;

        // Find lower bound
        for (lo=0;lo<this.normDist.length;lo++) {
            if (this.normDist[lo+1] >= s) 
                return lo;
        }
        return this.vertices.length-1;
    }

    calculatePosition(time: number) {
        var s = time/this.totalTime;
        if (s >= 1) 
            return this.vertices[this.vertices.length-1];

        var lo = 0;
        // Find lower bound
        for (lo;lo<this.normDist.length;lo++) {
            if (this.normDist[lo] === s) 
                return this.vertices[lo];
            if (this.normDist[lo+1] > s) 
                break;
        }

        // Interpolate values
        // Find vector from 0 to 1
        var highVert = this.vertices[lo+1];
        var loVert   = this.vertices[lo];
        var dif = [highVert[0]-loVert[0] , highVert[1]-loVert[1]];
        // Normalized values
        var hiVal = this.normDist[lo+1];
        var loVal = this.normDist[lo];
        // Interpolate between values to scale dif vector
        s = (s - loVal) / (hiVal - loVal);
        dif[0] *= s; dif[1] *= s;
        // Add to lo vert to find position
        return [loVert[0]+dif[0] , loVert[1]+dif[1]];
    }

    drawPath(p: P5CanvasInstance, current?: number) {
        p.push();
        p.stroke('red');
        p.strokeWeight(2);
        p.noFill();
        p.beginShape();
        let n = this.vertices.length;
        for (let i=0;i<n;i++) {
            p.vertex(...this.vertices[i]);
        }
        p.endShape();
        if (current) {
            p.fill('red');
            p.stroke(0);
            let currentPos = this.calculatePosition(current);
            p.circle(...currentPos, 5);
        }
        p.pop();
    } 
}

import { P5CanvasInstance } from "@p5-wrapper/react";
import { PathTrace } from "./pathTrace";

interface AnimationSegment {
    totalTime: number;
    draw(p:P5CanvasInstance, time: number): void;
}

export class HexFill implements AnimationSegment
{
    totalTime: number;
    fillPath: PathTrace;
    animationCallback: (p: P5CanvasInstance, time: number, fillPath: PathTrace) => void;
    postAnimationCallback?: (p: P5CanvasInstance) => void;

    constructor(
        segmentTime: number, 
        fillPathVertices: number[][], 
        animationCallback: (p: P5CanvasInstance, time: number) => void, 
        postAnimationCallback?: (p: P5CanvasInstance) => void) 
    {
        this.totalTime = segmentTime;
        this.fillPath = new PathTrace(segmentTime, fillPathVertices);
        this.animationCallback = animationCallback;
        this.postAnimationCallback = postAnimationCallback;
    }

    draw(p:P5CanvasInstance, time: number) {
        // Short circuit and draw full image
        if (time >= this.totalTime) {
            this.postAnimationCallback?.(p);
        }
        else {
            let fillPathNum = this.fillPath.findPreviousVertex(time);
            this.animationCallback(p, time, this.fillPath);
        }
    }
}

export class TubeFill implements AnimationSegment
{
    totalTime: number;
    path: PathTrace;
    color: string | number[];

    constructor (totalTime: number, path: number[][], color: string | number[]) {
        this.totalTime = totalTime;
        this.path = new PathTrace(totalTime, path);
        this.color = color;
    }

    draw(p: P5CanvasInstance, time: number) {
        let path = this.path;
        let v = path.vertices;
        let prev = path.findPreviousVertex(time);

        // For debugging purposes
        // path.drawPath(p, time);

        // Push state
        p.push();
        p.noFill();
        p.stroke(this.color);
        p.strokeWeight(9);
        p.strokeJoin(p.MITER);
        p.strokeCap(p.ROUND);

        // Draw all previous vertices
        p.beginShape();
        for (let i=0,n=prev+1;i<n;i++) {
            p.vertex(...v[i]);
        }
        p.vertex(...path.calculatePosition(time));
        p.endShape();

        p.pop();
    }
}

type AnimationSegmentConstructor<T extends AnimationSegment> = new (...args: any[]) => T;

// Factory class to manage a complex animation
export class AnimationFactory implements AnimationSegment
{
    animationSegments: Array<AnimationSegment>;
    startTimes: Array<number>;
    totalTime: number;

    constructor() {
        this.animationSegments = new Array;
        this.startTimes = new Array;
        this.totalTime = 0;
    }

    // Create a segment using a class that extends AnimationSegment and append
    createSegment<T extends AnimationSegment>(
        startTime: number,
        animationClass: AnimationSegmentConstructor<T>, 
        ...args: ConstructorParameters<AnimationSegmentConstructor<T>>)
    {
        // Create a new segment using the specific class
        let newSegment = new animationClass(...args);
        // Append the segment
        this.appendSegment(startTime, newSegment);
        // Return a reference to the new animation
        return newSegment;
    }

    // Append a segment to the segment list
    appendSegment<T extends AnimationSegment>(
        startTime: number,
        segment: T
    )
    {
        // Append new segment
        this.startTimes.push(startTime);
        this.animationSegments.push(segment);
        // Update the total time
        this.totalTime += segment.totalTime;
    }

    draw(p: P5CanvasInstance, time: number) {
        this._drawAnimation(p, time)
    }

    // Draw each animation segment
    _drawAnimation(p: P5CanvasInstance, time: number) {
        let n = this.startTimes.length;
        for (let i=0;i<n;i++) {
            if (time > this.startTimes[i]) {
                this.animationSegments[i].draw(p, time - this.startTimes[i]);
            }
        }
    }
}

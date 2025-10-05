import type { Component } from "solid-js";

export const DirectionsText: Component = () => {
    return <>
    <p>
        This virtual experiment simulates a kettle boiler and its heat exchange capabilities.
    </p>
    <p>
        Use the flow-control valve (red) to adjust the feed flowrate, which can be read from the rotameter above it.
    </p>
    <p>
        To fill the inner tubes with steam, click the steam shutoff valve to open it (parallel with the pipe), then drag the pressure regulator handle to adjust the pressure.
    </p>
    <p>
        Tare the empty beakers for accuracy using the button on the scale.
        Then, click and drag the beakers under the flowing streams to catch water, and drag them to the scale to weigh.
        To empty a beaker, drag it onto the table and click on it, and then click on the "empty beaker" button.
        Use a stopwatch during catch and weigh to record stream flowrates. 
    </p>
    <p>
        Scroll to zoom and drag the screen to pan.
    </p>
</>;
}

export const AboutText: Component = () => {
    return <p>
        This digital experiment was created in the Department of Chemical and Biological Engineering at University of Colorado Boulder 
        for <a href="learncheme.com">LearnChemE.com</a> by Drew Smith under the direction of Professor John L. Falconer and Professor David B. Thiessen. It was 
        prepared with financial support from the National Science Foundation (DUE 2336987 and 2336988) and is based on a Kettle Boiler 
        laboratory module and accompanying worksheet protocol developed with separate support under NSF 1821578 led by Washington State 
        University.  Address any questions or comments to LearnChemE@gmail.com.
    </p>
}

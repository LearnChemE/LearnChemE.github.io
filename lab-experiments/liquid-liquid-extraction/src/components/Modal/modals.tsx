import type { Component } from "solid-js";

export const DirectionsText: Component = () => {
    return <>
    <p>
        This digital experiment simulates the separation of acetic acid from chloroform using an aqueous solvent.
    </p>
    <p>
        Before starting the experiment, use the menu in the top left to select the number of stages in the column and the stage efficiency.
    </p>
    <p>
        To start the experiment, first click the solvent valve (right) to fill the column, then click the feed valve (left) to start the flow of feed. Drag and rotate each valve to change the flow rates.
    </p>
    <p>
        Raffinate and extract compositions can be viewed by hovering near the column. Use the scales at each outlet to estimate flow rates.
    </p>
    <p>
        To reset the experiment, click the reset button in the top left. Note that this will also reset the number of stages and stage efficiency to their default values.
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
        prepared with financial support from the National Science Foundation (DUE 2336987 and 2336988) and is based on a Blood Cell Sedimentation desktop module 
        laboratory module and accompanying worksheet protocol developed with separate support under NSF 1821578 led by Washington State 
        University. Address any questions or comments to LearnChemE@gmail.com.
    </p>
}

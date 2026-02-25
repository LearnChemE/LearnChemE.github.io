import type { Component } from "solid-js";

export const DirectionsText: Component = () => {
    return <>
    <p>
        This digital experiment simulates the separation of acetic acid from chloroform using an aqueous solvent.
        Before starting the experiment, use the menu in the top left to select the number of stages in the column and the stage efficiency.
        To start the experiment, first switch on the solvent pump (right) to fill the column, then switch on the feed pump (left) to start the flow of feed. 
        Drag and rotate each valve to change the flow rates.
        Raffinate and extract compositions can be viewed by hovering over the white and blue dots next to the column. 
        Use the weight scales at each outlet to measure outlet mass flowrates.

        To reset the experiment, click the reset button with the rotating arrows in the top left. Note that this will also reset the number of stages and stage efficiency to their default values.
        Scroll to zoom and drag the screen to pan.
    </p>
</>;
}

export const AboutText: Component = () => {
    return <p>
        This digital experiment was created in the Department of Chemical and Biological Engineering at University of Colorado Boulder 
        for <a href="learncheme.com">LearnChemE.com</a> by Drew Smith under the direction of Professor John L. Falconer. It was 
        prepared with financial support from the National Science Foundation (DUE 2336987 and 2336988). Address any questions or comments to LearnChemE@gmail.com.
    </p>
}

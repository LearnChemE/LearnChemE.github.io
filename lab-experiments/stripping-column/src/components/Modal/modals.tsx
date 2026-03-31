import type { Component } from "solid-js";
import { SIM_MODE } from "../../globals";

export const DirectionsText: Component = () => {
    if (SIM_MODE === "stripping") return <>
    <p>
        This digital experiment simulates the stripping of a volatile solute from a liquid stream to a gas stream.
        Before starting the experiment, use the menu in the top left to select the number of stages in the column and the stage efficiency.
        To start the experiment, first switch on the liquid feed pump (left) to fill the column, then open the cylinder valve (right) to pressurize the line. 
        Drag and rotate the feed valve to change the flow rate. Likewise, rotate the pressure regulator and use the buttons on the flow controller to adjust the pressure and flow of gas through the system.
        Liquid and vapor compositions can be viewed by hovering over the blue and white dots next to the column. 
        Use the weight scale at the liquid outlet to measure the corresponding mass flowrate.

        To reset the experiment, click the reset button with the rotating arrows in the top left. Note that this will also reset the number of stages and stage efficiency to their default values.
        Scroll to zoom and drag the screen to pan.
    </p>
</>;

    else if (SIM_MODE === "absorption") return <>
    <p>
        This digital experiment simulates the absorption of a solute from a vapor stream to a liquid solvent stream.
        Before starting the experiment, use the menu in the top left to select the number of stages in the column and the stage efficiency.
        To start the experiment, first switch on the liquid feed pump (left) to fill the column, then open the cylinder valve (right) to pressurize the line. 
        Drag and rotate the feed valve to change the flow rate. Likewise, rotate the pressure regulator and use the buttons on the flow controller to adjust the pressure and flow of gas through the system.
        Liquid and vapor compositions can be viewed by hovering over the blue and white dots next to the column. 
        Use the weight scale at the liquid outlet to measure the corresponding mass flowrate.

        To reset the experiment, click the reset button with the rotating arrows in the top left. Note that this will also reset the number of stages and stage efficiency to their default values.
        Scroll to zoom and drag the screen to pan.
    </p>
</>;

    else return <>
    <p>
        This digital experiment simulates the material and energy balances regarding stripping and absorption columns.
        Before starting the experiment, use the menu in the top left to select either stripping or absorption and the number of stages in the column.
        To start the experiment, first switch on the liquid feed pump (left) to fill the column, then open the cylinder valve (right) to pressurize the line. 
        Drag and rotate the feed valve to change the flow rate. Likewise, rotate the pressure regulator and use the buttons on the flow controller to adjust the pressure and flow of gas through the system.
        Liquid and vapor compositions can be viewed by hovering over the blue and white dots next to the column. 
        Use the weight scale at the liquid outlet to measure the corresponding mass flowrate.

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

import type { Component } from "solid-js";

export const DirectionsText: Component = () => {
    return <>
    <p>
        This digital experiment simulates the stripping of a volatile solute from a liquid stream to a gas stream. 
        Before starting the experiment, use the menu on the top left to select the number of stages in the column and the stage efficiency. 
        Switch on the liquid feed pump (left) first to fill the column, and then drag and rotate the red feed valve to change the liquid flow rate. 
        Next, click on the cylinder valve (right) to open it and pressurize the line. 
        Rotate the regulator valve to change the pressure, and use the buttons on the flow controller to adjust the gas flow. 
        Allow the system to reach steady state and then view the liquid and vapor mole ratios by hovering over the blue and white dots next to the column. 
        Use the weight scale at the liquid outlet to measure the corresponding mass flowrate. 
        
        To reset the experiment, click the reset button with the rotating arrows in the top left. 
        This also resets the number of stages and stage efficiency to their default values. 
        Click on Worksheet to see a detailed experimental plan. Scroll to zoom and drag the screen to pan. 
    </p>
</>;
}

export const AboutText: Component = () => {
    return <p>
        This digital experiment was created in the Department of Chemical and Biological Engineering at University of Colorado Boulder 
        for <a href="learncheme.com">LearnChemE.com</a> by Drew Smith under the direction of Professor John L. Falconer. 
        It was prepared with financial support from the National Science Foundation (DUE 2336987 and 2336988) in collaboration with Washington State University. 
        Address any questions or comments to LearnChemE@gmail.com.
    </p>
}

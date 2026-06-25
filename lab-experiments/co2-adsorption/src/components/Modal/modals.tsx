import type { Component } from "solid-js";
import { SIM_MODE } from "../../globals";

export const DirectionsText: Component = () => {
    return <>
    <p>
        This digital experiment measures CO₂ {SIM_MODE} on a zeolite bed.
        Click the cylinder valves and click and drag the regulators to allow flow into the system.
        Use the left valve handle to change what cylinder is connected to the bed system. Use the right valve handle to direct the flow of gas towards the bed or bypass it.
        Click the buttons on the mass flow controller to adjust the mass flowrate.
        Use the recording menu to record data from the simulation, then download a CSV for further processing with other software.
        Move the mouse over either of the valve handles to show in green lines through which gas flows. Lines where gas does not flow are in black. 
        
        To reset the experiment, click the reset button with the rotating arrows in the top left. 
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

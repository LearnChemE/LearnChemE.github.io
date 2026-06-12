import type { Component } from "solid-js";

export const DirectionsText: Component = () => {
    return <>
    <p>
        This virtual experiment shows the adsorption and desorption of carbon dioxide from a zeolite bed.
        Click the cylinder valves and click and drag the regulators to allow flow into the system.
        Use the left valve handle to change what cylinder is connected to the bed system. Use the right valve handle to direct the flow of gas towards the bed or bypass it.
        Click the buttons on the mass flow controller to adjust the mass flowrate.
        Use the recording menu to record data from the simulation, then download a csv for further processing with other software.
        
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

import type { Component } from "solid-js";
import { SIM_MODE } from "../../globals";

export const DirectionsText: Component = () => {
    if (SIM_MODE === "stripping") return <>
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

    else if (SIM_MODE === "absorption") return <>
    <p>
        This digital experiment simulates the absorption of a solute from a vapor stream to a liquid solvent stream. 
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

    else return <>
    <p>
        This experiment applies material balances to a trayed stripping column or an absorption column. 
        Use the menu on the top left to select the column mode (either stripping or absorption) and the number of stages in the column. 
        First switch on the liquid feed pump (left) to fill the column. Then drag and rotate the red feed valve to change the liquid flow rate. 
        Next, open the cylinder valve to pressurize the line. Rotate the pressure regulator valve to adjust the pressure. 
        Use the buttons on the flow controller to adjust the gas flowrate. 
        View liquid and vapor solute mole ratios by hovering over the blue and white dots next to the column. 
        Use the weight scale at the liquid outlet to measure the liquid mass flowrate. 

        To reset the experiment, click the reset button with the rotating arrows in the top left. This will also reset the number of stages. 
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

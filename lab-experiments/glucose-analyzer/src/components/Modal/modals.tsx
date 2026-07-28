import type { Component } from "solid-js";

export const DirectionsText: Component = () => {
    return <>
    <p>
        This digital experiment simulates the analysis of the Trinder reaction and
        absorbance spectroscopy. Use the menu to choose which solutions to inject into
        the cartridge and the concentration of sample solutions. Press inject to inject the liquids.
        After injecting, press the green play button to mix the fluids and begin the reaction. You can
        consider the reaction started when the fluids reach the bottom chamber.
        Press the eye-dropper button to display the rgb values at the location of your cursor.
        
        Scroll the mouse wheel to zoom and click and drag 
        to pan the view. Click the "Reset" button to reset the experiment. 
    </p>
</>;
}

export const AboutText: Component = () => {
    return <p>
        This digital experiment was created in the Department of Chemical and Biological Engineering at University of Colorado Boulder 
        for <a href="learncheme.com">LearnChemE.com</a> by Drew Smith under the direction of Professor John L. Falconer. 
        It was prepared with financial support from the National Science Foundation (DUE 2336987 and 2336988) and is based on a 
        Glucose Analyzer experimental kit and
        accompanying worksheet protocol developed with separate support
        under NSF 1821578 led by Riley Fosbre at Washington State University. 
        Address any questions or comments to LearnChemE@gmail.com.
    </p>
}

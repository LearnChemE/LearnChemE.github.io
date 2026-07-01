import type { Component } from "solid-js";

export const DirectionsText: Component = () => {
    return <>
    <p>
        This digital experiment simulates a small vessel with a 50% propane / 50% hexane mixture exaporating.
        Click the cylinder valve to open it and click and drag the regulator to change the nitrogen pressure. 
        Click the arrow buttons on the controllers to change the flowrate of nitrogen and the temperature of the vessel.
        Record the liquid level mixture evaporates to determine how the composition changes with time.
        Scroll the mouse wheel to zoom and click and drag to pan the view.  
        Click the "Reset" button to reset the experiment.
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

import type { Component } from "solid-js";

export const DirectionsText: Component = () => {
    return <>
    <p>
        This digital experiment simulates a simplified rotary viscometer with several fluids.
        Use the fluid selection menu to choose which fluid is tested. Press the play button to begin testing.
        After a short animation, use the buttons on the motor control panel to adjust the rotation speed of the die head.
        Hover over the spring scale to read the resulting force exerted on it.
        
        Scroll the mouse wheel to zoom and click and drag 
        to pan the view. Click the "Reset" button to reset the experiment. 
    </p>
</>;
}

export const AboutText: Component = () => {
    return <p>
        This digital experiment was created in the Department of Chemical and Biological Engineering at University of Colorado Boulder 
        for <a href="learncheme.com">LearnChemE.com</a> by Drew Smith under the direction of Professor John L. Falconer. 
        It was prepared with financial support from the National Science Foundation (DUE 2336987 and 2336988) and is based on laboratory
        rotary viscometers.
        Address any questions or comments to LearnChemE@gmail.com.
    </p>
}

import type { Component } from "solid-js";

export const DirectionsText: Component = () => {
    return <>
    <p>
        This virtual experiment simulates the sedimentation of two types of particles in a rigid vial.
    </p>
    <p>
        Use the top magnifying glass button to visualize the relative particle amounts and velocities within a section of the vial by hovering your mouse over it or tapping it on a touchscreen.
    </p>
    <p>
        The reset button will shake the vials, mixing the particles well to reset the animation.
    </p>
    <p>
        The pause/play button will stop and start the animation of the particles settling.
    </p>
    <p>
        Lastly, use the vial button to change the initial concentrations of each vial. Hit reset after setting the desired concentrations to make it appear in the vials.
    </p>
</>;
}

export const AboutText: Component = () => {
    return <p>
        This digital experiment was created in the Department of Chemical and Biological Engineering at University of Colorado Boulder 
        for <a href="learncheme.com">LearnChemE.com</a> by Drew Smith under the direction of Professor John L. Falconer and Professor David B. Thiessen. It was 
        prepared with financial support from the National Science Foundation (DUE 2336987 and 2336988) and is based on a Kettle Boiler 
        laboratory module and accompanying worksheet protocol developed with separate support under NSF 1821578 led by Washington State 
        University.  Address any questions or comments to LearnChemE@gmail.com.
    </p>
}

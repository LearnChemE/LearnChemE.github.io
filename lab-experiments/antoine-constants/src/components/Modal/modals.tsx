import type { Component } from "solid-js";

export const DirectionsText: Component = () => {
    return <>
        <p>
            This is a digital experiment in which the user determines Antoine constants via linear or nonlinear regression. Select one of the species to inject, a temperature for the evacuated chamber to be held at, and a volume to inject. Next, fill the syringe
            with the selected species and inject it into the evacuated chamber. The pressure will take a few seconds to equilibrate. The syringe can be refilled and injected multiple times. After measurement at one temperature the temperature can be changed for measurements at another temperature. Press "reset" to select a different molecule. 
            The corresponding worksheet accompanying this digital experiment can be downloaded by pressing "Worksheet".
        </p>
</>;
}

export const AboutText: Component = () => {
    return (
        <p>
        This digital experiment was created in the Department of Chemical and Biological Engineering, at University of Colorado Boulder for <a href="https://learncheme.com" target="_blank">LearnChemE.com</a> by Neil Hendren and Drew Smith under the direction of
        Professor John L. Falconer and Michelle Medlin. It is based on a <a href="https://demonstrations.wolfram.com/InjectingALiquidIntoAnEvacuatedTank/" target="_blank">Mathematica simulation</a> prepared by Rachael L. Baumann, Derek M. Machalek,
        Nathan S. Nelson, Neil Hendren, and Garrison J. Vigil, which was converted to a <a href="https://learncheme.com/simulations/thermodynamics/thermo-1/injecting-a-liquid-into-an-evacuated-tank/" target="_blank">browser-based simulation</a> by
        Neil Hendren at the University of Colorado Boulder. This digital experiment was prepared with financial support from the National Science Foundation (DUE 2336987 and 2336988) in collaboration with Washington State University. Address any questions
        or comments to LearnChemE@gmail.com.
        </p>
    );
}

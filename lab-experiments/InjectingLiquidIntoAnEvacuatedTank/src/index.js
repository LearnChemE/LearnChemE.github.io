require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// TO DO:

// GLOBAL VARIABLES OBJECTåç
window.gvs = {
    liquid_level: 0, // 0-1 value of how high liquid is in tank
    final_liquid_level: 0, // The final liquid level, between 0 and 0.3 depending on value of V_final
    max_liquid_level: 0.3, // The highest that the liquid can go in the tank (30% full)
    background_color: [253, 253, 253], // RGB color
    liquid_color: [150, 150, 255], // RGB color
    vapor_density: 0, // 0-1 value of how dark the vapor color is
    final_vapor_density: 0, // final value for how dense the vapor will be after injecting
    P: 0, // Current pressure, bar
    V: 0, // moles of vapor in tank at any given point during the animation
    L: 0, // moles of liquid in tank at any given point during the animation
    L_final: 0, // the solution to moles of liquid in the tank
    V_final: 0, // the solution to moles of vapor in the tank
    P_final: 0, // the final pressure in the tank
    T: 5, // Initial Temperature (deg. C) starts at 5°C
    max_temperature: 100,
    n: 1.0, // moles to inject (moles)
    chemical: "propane", // chemical to inject
    syringe_initial: 0.5, // The initial value for how far the syringe is pushed in. Dictated by moles to inject (n)
    syringe_fraction: 0.5, // How far pushed in the syringe is, 0-1
    is_running: false, // Whether the simulation is currently running
    is_finished: false, // Whether the animation has finished running
    percent_injected: 0, // Value between 0 and 1, used during the animation phase
    reset_button_bright: false, // Switches every second false and true to make the reset button "glow" after finishing a run
};

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

    p.setup = function() {
        p.createCanvas(800, 530);
        p.noLoop();
        gvs.p = p;
        gvs.drawAll = require("./js/draw.js");
        require("./js/inputs.js");
        
        p.windowResized = function() {
            // Optional window resizing behavior
        }
    };

    p.draw = function() {
        p.background.apply(this, gvs.background_color);
        gvs.drawAll(p);

        // Constant for temperature update duration (seconds)
        const seconds_to_inject = 2.5;
        const frameRate = 60;
        const frames_per_second = frameRate;
        const frames = frames_per_second * seconds_to_inject;
        const dt = 1 / frames;
        const dInj = (1 - gvs.syringe_initial) / frames;
        const dL = gvs.L_final / frames;
        const dV = gvs.V_final / frames;
        const dP = gvs.P_final / frames;
        const dVap = gvs.final_vapor_density / frames;
        const dLiq = gvs.final_liquid_level / frames;

        // Update temperature continuously from 5°C to 100°C
        if (gvs.is_running && !gvs.is_finished) {
            // const maxTemperature = 100; // 100°C
            // const minTemperature = 5;  // 5°C
            // const temperatureRange = maxTemperature - minTemperature;
            // const elapsedTime = (p.frameCount / frameRate); // Total time elapsed in seconds
            // const newTemperature = minTemperature + (temperatureRange * (elapsedTime / 100)); // Increase temperature over time
            // if (newTemperature <= maxTemperature) {
            //     gvs.T = newTemperature; // Update the temperature
            // } else {
            //     gvs.T = maxTemperature; // Stop at 100°C
            // }
            gvs.updateTemperature();

            // Update other simulation parameters during the "running" state
            gvs.syringe_fraction += dInj;
            gvs.percent_injected += dt;
            gvs.P += dP;
            gvs.L += dL;
            gvs.V += dV;
            gvs.liquid_level += dLiq;
            gvs.vapor_density += dVap;

            // If injection is complete, finish the experiment
            if (gvs.percent_injected >= 1) {
                gvs.percent_injected = 1;
                gvs.is_finished = true;
                gvs.is_running = false;
                gvs.P = gvs.P_final;
                gvs.L = gvs.L_final;
                gvs.P = gvs.P_final;
                gvs.syringe_fraction = 1;
                const reset_button = document.getElementById("reset-button");
                reset_button.style.transition = "background 2s";
                gvs.reset_interval = setInterval(() => {
                    if (gvs.reset_button_bright) {
                        reset_button.classList.remove("bright");
                    } else {
                        reset_button.classList.add("bright");
                    }
                    gvs.reset_button_bright = !gvs.reset_button_bright;
                }, 1000);
            }
        }

        //drawTemperatureProgressBar(p);
    };

};

// Initialize the p5 instance with the sketch
const P5 = new p5(sketch, containerElement);

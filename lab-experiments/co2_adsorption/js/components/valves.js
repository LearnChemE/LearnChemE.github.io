// js/components/valves.js
import * as config from '../config.js';
import * as state from '../state.js';
import { getTankFromMultiValvePosition } from '../utils.js';
import { checkAndStartMFCFlow, animateGasFlow } from '../pipes.js'; // Import pipe functions

export function createVerticalValve(draw, x, y, valveId) {
    
    const group = draw.group();

    // Initialize valve state
    state.setValveState(valveId, false, { x, y });

    // Create valve body parts
    group.rect(config.verticalValveBlockWidth, config.verticalValveBlockHeight)
        .fill('#ccc')
        .stroke({ color: '#444', width: 1 })
        .move(x, y);

    group.rect(config.verticalValveBodyWidth, config.verticalValveBodyHeight)
        .fill('#ddd')
        .stroke({ color: '#444', width: 1 })
        .radius(6)
        .move(x, y + config.verticalValveBlockHeight);

    group.rect(config.verticalValveBlockWidth, config.verticalValveBlockHeight)
        .fill('#ccc')
        .stroke({ color: '#444', width: 1 })
        .move(x, y + config.verticalValveBlockHeight + config.verticalValveBodyHeight);

    const stemX = x - config.verticalValveStemWidth;
    const stemY = y + config.verticalValveBlockHeight + (config.verticalValveBodyHeight - config.verticalValveStemHeight) / 2;
    group.rect(config.verticalValveStemWidth, config.verticalValveStemHeight)
        .fill('#000')
        .move(stemX, stemY);

    const extra = (config.verticalValveTopExtent - config.verticalValveStemHeight) / 2;
    const knob = group.path(`
        M ${stemX} ${stemY}
        L ${stemX - config.verticalValveTrapezoidWidth} ${stemY - extra}
        L ${stemX - config.verticalValveTrapezoidWidth} ${stemY + config.verticalValveStemHeight + extra}
        L ${stemX} ${stemY + config.verticalValveStemHeight}
        Z
    `)
        .fill('#000') // Start closed (black)
        .stroke({ color: '#444', width: 1 });

    // Store the knob reference in the valve state
    state.valveStates[valveId].knob = knob; // Direct access okay here during creation

    // Add click handler to toggle valve state
    group.on('click', function() {
        const currentValveState = state.getValveState(valveId);
        const isOpen = !currentValveState.isOpen;
        state.updateValveOpenState(valveId, isOpen); // Update state & visual

        if (isOpen) {
            // Handle different valve types opening
            if (valveId.startsWith('tankValve')) {
                const tankNum = valveId.replace('tankValve', '');
                const color = tankNum === '1' ? '#ff0000' : (tankNum === '2' ? '#ff0000' : 'blue');
                const opacity = tankNum === '1' ? 0.9 : 0.5;
                const currentTankSelected = getTankFromMultiValvePosition(state.getCurrentMultiValvePosition());

                // Animate segments sequentially
                animateGasFlow(draw, `tank${tankNum}_seg2`, color, opacity, () => {
                    animateGasFlow(draw, `tank${tankNum}_seg3`, color, opacity, () => {
                        const pressureValveId = `pressureValve${tankNum}`;
                        if (state.getValveState(pressureValveId)?.isOpen) {
                            animateGasFlow(draw, `tank${tankNum}_seg4`, color, opacity);
                        }
                        // Start MFC flow if this tank is selected
                        if (currentTankSelected === tankNum) {
                            checkAndStartMFCFlow(draw);
                        }
                    });
                });
            } else if (valveId.startsWith('pressureValve')) {
                const tankNum = valveId.replace('pressureValve', '');
                const tankValveId = `tankValve${tankNum}`;
                const currentTankSelected = getTankFromMultiValvePosition(state.getCurrentMultiValvePosition());

                // Only animate seg4 if corresponding tank valve is also open
                if (state.getValveState(tankValveId)?.isOpen) {
                    const color = tankNum === '1' ? '#ff0000' : (tankNum === '2' ? '#ff0000' : 'blue');
                    const opacity = tankNum === '1' ? 0.9 : 0.5;
                    animateGasFlow(draw, `tank${tankNum}_seg4`, color, opacity);
                }
                 // Start MFC flow if this tank is selected
                 if (currentTankSelected === tankNum) {
                    checkAndStartMFCFlow(draw);
                }
            }
        } else {
            // Handle different valve types closing
             if (valveId.startsWith('tankValve')) {
                const tankNum = valveId.replace('tankValve', '');
                // Remove flow paths for segments 2, 3, and 4
                ['seg2', 'seg3', 'seg4'].forEach(seg => {
                    state.removeFlowPath(`tank${tankNum}_${seg}`);
                });
                // Stop MFC flow if this tank was selected
                const currentTankSelected = getTankFromMultiValvePosition(state.getCurrentMultiValvePosition());
                if (currentTankSelected === tankNum) {
                    checkAndStartMFCFlow(draw); // Will stop MFC flow if conditions aren't met
                }
            } else if (valveId.startsWith('pressureValve')) {
                const tankNum = valveId.replace('pressureValve', '');
                state.removeFlowPath(`tank${tankNum}_seg4`);
                // Stop MFC flow if this tank was selected
                 const currentTankSelected = getTankFromMultiValvePosition(state.getCurrentMultiValvePosition());
                if (currentTankSelected === tankNum) {
                    checkAndStartMFCFlow(draw); // Will stop MFC flow if conditions aren't met
                }
            }
        }
    });

    return group;
}

export function createInteractiveValve(draw, x, y, controller = true, isThreeValve = false) {
    const group = draw.group();
    const radius = config.interactiveValveRadius;

    // Define initial entry positions (in degrees)
    // Tank positions: 1 at 180°, 2 at 90°, 3 at 0°, Outlet at 270°
    const entryAngles = [270, 0, 90, 180];
    const rotationSequence = isThreeValve ? [270, 0, 180] : [270, 0, 90, 180]; // Angles pointer stops at

    // Draw markers for each entry.
    entryAngles.forEach(angle => {
        const rad = angle * Math.PI / 180;
        const markerDistance = radius + config.interactiveValveMarkerOffset;
        const markerX = x + markerDistance * Math.cos(rad);
        const markerY = y + markerDistance * Math.sin(rad);
        if (angle === 90) {
          if (!isThreeValve) {
            group.rect(20, 10).fill('black').center(markerX, markerY);
          }
        } else if (angle === 270) {
          group.rect(20, 10).fill('gray').center(markerX, markerY);
        } else {
          group.rect(10, 20).fill('black').center(markerX, markerY);
        }
      });

    // Draw valve circle (outer and inner)
    group.circle(radius * 2)
        .fill('#b4b4ff')
        .stroke({ color: '#444', width: 2 })
        .center(x, y);
    group.circle(radius)
        .fill('white')
        .stroke({ color: '#444', width: 2 })
        .center(x, y);

    if (controller) {
        // Create pointer group
        const pointerGroup = group.group();
        const pointerLength = radius - config.interactiveValvePointerOffset;
        pointerGroup.polygon(`${pointerLength},0 0,-5 0,5`) // Arrow shape
            .fill('green')
            .stroke({ color: '#444', width: 1 });
        pointerGroup.center(x, y); // Position pivot point at valve center

        let currentAngleIndex = 0;
          pointerGroup.rotate(270, x, y); // Initialize to 270 degrees
          
          const entryAngles1 = [90, 90, 90, 90]; // Initialize to current state or default

        group.on('click', function() {
            currentAngleIndex = (currentAngleIndex + 1) % entryAngles.length;
            const targetAngle = entryAngles[currentAngleIndex];
            state.setCurrentMultiValvePosition(targetAngle); // Update global state

            // Animate the pointer rotation
            // The rotation amount is the difference, but rotate() sets absolute angle
            pointerGroup.animate(300).rotate(entryAngles1[currentAngleIndex], x, y);

            // Check if we should start/stop MFC flow for the new position
             checkAndStartMFCFlow(draw);
        });
         // Store reference if this is the main controllable valve
         state.setInteractiveValveKnobElement(group);
    }

    return group;
}


export function createTValveFromImage(draw, x, y) {
    const scale = 0.6;
    const group = draw.group(); // Work in group-local coordinates

    // --- Scaled Dimensions ---
    const sideKnobWidth = 20 * scale;
    const bodyX = sideKnobWidth; // Start body after the left knob space
    const bodyY = 20 * scale; // Offset down to allow for top knob/port
    const bodyWidth = 80 * scale;
    const bodyHeight = 30 * scale;

    // --- Red Gradient for the Body ---
    const redGradient = draw.gradient('linear', function(add) {
        add.stop(0, '#dd5555');
        add.stop(1, '#bb2222');
    });
    redGradient.from(0, 0).to(0, 1);

    // --- Main Horizontal Body ---
    group.rect(bodyWidth, bodyHeight)
        .fill(redGradient)
        .stroke({ color: '#444', width: 1 })
        .radius(15 * scale) // Use scaled radius
        .move(bodyX, bodyY); // Position relative to group origin (0,0)

    // Optional: Center logo circle on the main body
    const centerCircleDiameter = 10 * scale;
    group.circle(centerCircleDiameter)
        .fill('none')
        .stroke({ color: '#444', width: 1 })
        .center(bodyX + bodyWidth / 2, bodyY + bodyHeight / 2);

    // --- Top Port (Red Stub) ---
    const topPortWidth = 14 * scale;
    const topPortHeight = 15 * scale;
    group.rect(topPortWidth, topPortHeight)
        .fill(redGradient)
        .stroke({ color: '#444', width: 1 })
        .radius(topPortWidth / 2) // Make it rounded
        .move(bodyX + (bodyWidth - topPortWidth) / 2, bodyY - topPortHeight); // Position above body

    // --- Top Black Knob ---
    const knobWidth = 12 * scale;
    const knobHeight = 20 * scale; // Make knob taller than wide
    // Optional: Threaded rod under the knob
    const threadedRodWidth = 6 * scale;
    const threadedRodHeight = 8 * scale;
    group.rect(threadedRodWidth, threadedRodHeight)
         .fill('#aaa') // Lighter color for rod
         .move(bodyX + (bodyWidth - threadedRodWidth) / 2, bodyY - topPortHeight); // Position it first
    group.rect(knobWidth, knobHeight)
        .fill('#000')
        .stroke({ color: '#444', width: 1 })
        .radius(3 * scale) // Slightly rounded corners
        .move(bodyX + (bodyWidth - knobWidth) / 2, bodyY - topPortHeight - knobHeight); // Position above rod


    // --- Left Side Port and Knob ---
    const sidePortWidth = 10 * scale;
    const sidePortHeight = 20 * scale; // Tall port stub
    // Left port stub (Red) - position attached to body
    group.rect(sidePortWidth, sidePortHeight)
        .fill(redGradient)
        .stroke({ color: '#444', width: 1 })
        .radius(5 * scale) // Rounded stub end
        .move(bodyX - sidePortWidth, bodyY + (bodyHeight - sidePortHeight) / 2); // Attach to left of body
    // Left black knob attached to the port
    group.rect(sideKnobWidth, sideKnobWidth) // Square knob
        .fill('#000')
        .stroke({ color: '#444', width: 1 })
        .radius(5 * scale) // Rounded knob
         .move(bodyX - sidePortWidth - sideKnobWidth, bodyY + (bodyHeight - sideKnobWidth) / 2); // Attach to left of port


    // --- Right Side Port and Knob ---
    // Right port stub (Red)
    group.rect(sidePortWidth, sidePortHeight)
        .fill(redGradient)
        .stroke({ color: '#444', width: 1 })
        .radius(5 * scale)
        .move(bodyX + bodyWidth, bodyY + (bodyHeight - sidePortHeight) / 2); // Attach to right of body
    // Right black knob
     group.rect(sideKnobWidth, sideKnobWidth)
        .fill('#000')
        .stroke({ color: '#444', width: 1 })
        .radius(5 * scale)
         .move(bodyX + bodyWidth + sidePortWidth, bodyY + (bodyHeight - sideKnobWidth) / 2); // Attach to right of port


    // --- Label for Back Pressure Regulator ---
    group.text("Back Pressure\nRegulator") // Use \n for line break
         .font({ family: 'Arial', size: 10, anchor: 'middle' }) // Smaller font
         .fill('#000')
         .leading(1.2) // Adjust line spacing
         .center(bodyX + bodyWidth / 2, bodyY + bodyHeight + 12); // Position below body

    // --- Finally, position the entire group at the desired absolute (x, y) ---
    group.move(x, y);
    return group;
}
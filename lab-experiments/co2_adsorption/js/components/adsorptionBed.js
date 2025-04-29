// js/components/adsorptionBed.js
import * as config from '../config.js';
import * as state from '../state.js'; // May need later if state affects appearance

export function createVerticalAdsorptionBedView(draw, x, y) {
    const group = draw.group();

    // Define vertical bed dimensions
    const bedWidth = 104;
    const bedHeight = 200;

    // Draw the main bed rectangle
    group.rect(bedWidth, bedHeight)
        .fill('#d0e7f9')
        .stroke({ color: '#444', width: 2 })
        .move(x, y);

    // Create heating elements on both sides
    const heaterWidth = 20;
    const heaterHeight = bedHeight;

    // Default gradient (Blue - Cold)
    const defaultGradient = draw.gradient('linear', function(add) {
        add.stop(0, '#0000ff');
        add.stop(0.5, '#6666ff');
        add.stop(1, '#0000ff');
    });
    defaultGradient.from(0, 0).to(0, 1);

    // Left heater
    group.rect(heaterWidth, heaterHeight)
        .fill(defaultGradient) // Start with default
        .stroke({ color: '#444', width: 2 })
        .move(x - heaterWidth - 5, y)
        .addClass('heater'); // Add class for easy selection

    // Right heater
    group.rect(heaterWidth, heaterHeight)
        .fill(defaultGradient) // Start with default
        .stroke({ color: '#444', width: 2 })
        .move(x + bedWidth + 5, y)
        .addClass('heater'); // Add class for easy selection

    // Create a pattern of small circles to mimic granular adsorbent
    const patternGroup = draw.group();
    const circleRadius = 3;
    const gap = 15;
    for (let cx = x + gap / 2; cx < x + bedWidth; cx += gap) { // Use < to avoid edge overlap
        for (let cy = y + gap / 2; cy < y + bedHeight; cy += gap) { // Use <
            patternGroup.circle(circleRadius * 2)
                .fill('#89b3d1')
                .stroke({ color: '#567', width: 0.5 })
                .center(cx, cy);
        }
    }
    group.add(patternGroup); // Add pattern after heaters so it's visually behind

    // Add centered labels for the adsorption bed
    group.text("Adsorption")
        .font({ family: 'Arial', size: 18, anchor: 'middle', weight: 'bold' })
        .fill('#000')
        .center(x + bedWidth / 2, y + bedHeight / 2 - 10); // Adjust vertical position

    group.text("Bed")
        .font({ family: 'Arial', size: 18, anchor: 'middle', weight: 'bold' })
        .fill('#000')
        .center(x + bedWidth / 2, y + bedHeight / 2 + 10); // Adjust vertical position

    return group;
}
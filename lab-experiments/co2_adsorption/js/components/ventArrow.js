// js/components/ventArrow.js

export function createVentArrow(draw, x, y, angle, length) {
    // --- Debugging: Log Inputs ---
    console.log('--- createVentArrow Called ---');
    console.log('Inputs:', { x, y, angle, length });
    console.log('Input Types:', { x: typeof x, y: typeof y, angle: typeof angle, length: typeof length });

    // --- Debugging: Check for NaN or invalid inputs ---
    if (typeof x !== 'number' || isNaN(x) ||
        typeof y !== 'number' || isNaN(y) ||
        typeof angle !== 'number' || isNaN(angle) ||
        typeof length !== 'number' || isNaN(length)) {
        console.error('***** Invalid input detected in createVentArrow! *****', { x, y, angle, length });
        // Return an empty group to prevent further errors down the line
        // You might see fewer errors, but the arrow won't be drawn.
        // This helps confirm if the inputs are the problem.
        return draw.group();
    }
    // --- End Debugging Checks ---

    const rad = angle * Math.PI / 180;

    // Arrow head parameters
    const arrowHeadLength = 10;
    const arrowHeadWidth = 8;

    // Calculate points relative to origin (0,0) before moving the group
    const shaftLength = length - arrowHeadLength;
    const shaftEndX = shaftLength * Math.cos(rad);
    const shaftEndY = shaftLength * Math.sin(rad);

    const tipX = length * Math.cos(rad);
    const tipY = length * Math.sin(rad);

    // Base of the arrowhead (same as shaft end)
    const baseX = shaftEndX;
    const baseY = shaftEndY;

    // Perpendicular vector for arrowhead wings
    const perpX = -Math.sin(rad);
    const perpY = Math.cos(rad);
    const halfWidth = arrowHeadWidth / 2;

    // Wing points
    const leftX = baseX + halfWidth * perpX;
    const leftY = baseY + halfWidth * perpY;
    const rightX = baseX - halfWidth * perpX;
    const rightY = baseY - halfWidth * perpY;

    const group = draw.group();

    // Arrow Shaft
    // --- Debugging: Check shaft coordinates ---
    if (isNaN(shaftEndX) || isNaN(shaftEndY)) {
        console.error("NaN detected in shaft calculation!", { shaftEndX, shaftEndY, rad, shaftLength });
    }
    // --- End Debugging ---
    group.line(0, 0, shaftEndX, shaftEndY)
        .stroke({ color: 'black', width: 2, linecap: 'round' });

    // Arrowhead
    // --- Debugging: Log calculated points and the final string ---
    const pointsString = `${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`;
    console.log('Calculated Arrowhead Coords:', { tipX, tipY, leftX, leftY, rightX, rightY });
    console.log('Polygon Points String:', pointsString);

    // Check for NaN or non-numbers in calculated arrowhead values
    if (isNaN(tipX) || isNaN(tipY) || isNaN(leftX) || isNaN(leftY) || isNaN(rightX) || isNaN(rightY)) {
         console.error('***** NaN detected in calculated arrowhead coordinates! *****');
    }
    if (typeof tipX !== 'number' || typeof tipY !== 'number' ||
        typeof leftX !== 'number' || typeof leftY !== 'number' ||
        typeof rightX !== 'number' || typeof rightY !== 'number') {
        console.error('***** Non-numeric coordinate detected! *****', { tipX, tipY, leftX, leftY, rightX, rightY });
    }
    // --- End Debugging ---

    try { // Add try...catch specifically around the polygon creation
        group.polygon(pointsString)
            .fill('black')
            .on('error', (e) => console.error("SVG.js polygon creation error:", e)); // Add specific error handler
    } catch (polygonError) {
        console.error("JavaScript error during polygon creation:", polygonError);
        console.error("Points string was:", pointsString); // Log the string again on error
    }


    // "vent" Text beyond the arrow tip
    const textOffset = 12; // Distance from tip
    // Calculate text position relative to origin (0,0)
    const textXRelative = tipX + textOffset * Math.cos(rad);
    const textYRelative = tipY + textOffset * Math.sin(rad);

    // --- Debugging: Check text coordinates ---
     if (isNaN(textXRelative) || isNaN(textYRelative)) {
        console.error("NaN detected in text position calculation!", { textXRelative, textYRelative, tipX, tipY, rad });
    }
    // --- End Debugging ---

    group.text("vent")
        .font({ family: 'Arial', size: 14, anchor: 'middle' })
        .move(textXRelative, textYRelative);


    // Move the entire group to the final (x, y) position
    group.move(x, y);

    return group;
}
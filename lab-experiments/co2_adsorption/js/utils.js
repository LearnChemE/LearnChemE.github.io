// js/utils.js

export function getTankFromMultiValvePosition(position) {
    switch (position) {
        case 180: return '1'; // Tank 1 at 180 degrees
        case 90: return '2';  // Tank 2 at 90 degrees
        case 0: return '3';   // Tank 3 at 0 degrees
        case 270: return 'outlet'; // Or null, depending on how you treat the outlet position
        default: return null; // No specific tank selected
    }
}
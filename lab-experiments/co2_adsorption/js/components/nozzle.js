// js/components/nozzle.js
import * as config from '../config.js';

export function createNozzle(draw, group, x, y) {
    // First rectangle
    group.rect(config.nozzleRect1Width, config.nozzleRect1Height)
        .fill('#ebebeb')
        .stroke({ color: '#444', width: 1 })
        .move(x, y);
    // Second rectangle
    const secondRectX = x + (config.nozzleRect1Width - config.nozzleRect2Width) / 2;
    group.rect(config.nozzleRect2Width, config.nozzleRect2Height)
        .fill('#c69c6d')
        .stroke({ color: '#444', width: 1 })
        .move(secondRectX, y - config.nozzleRect2Height);
    // Third rectangle with rounded corners
    group.rect(config.nozzleRect3Width, config.nozzleRect3Height)
        .fill('#ebebeb')
        .radius(4)
        .stroke({ color: '#444', width: 1 })
        .move(x, y - config.nozzleRect2Height - config.nozzleRect3Height);
}
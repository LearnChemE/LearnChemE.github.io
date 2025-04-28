// js/components/gasCylinder.js
import * as config from '../config.js';
import { createNozzle } from './nozzle.js';

export function createGasCylinder(draw, x, y, label) {
    const group = draw.group();

    // Create gradient for cylinder body
    const cylinderGradient = draw.gradient('linear', function(add) {
        add.stop(0, '#a3a3a3');
        add.stop(0.5, '#666666');
        add.stop(1, '#a3a3a3');
    });
    cylinderGradient.from(0, 0).to(1, 0);

    group.path(`
        M ${x} ${y + 20}
        L ${x} ${y + config.mainCylHeight - 20}
        Q ${x} ${y + config.mainCylHeight} ${x + 20} ${y + config.mainCylHeight}
        L ${x + config.mainCylWidth - 20} ${y + config.mainCylHeight}
        Q ${x + config.mainCylWidth} ${y + config.mainCylHeight} ${x + config.mainCylWidth} ${y + config.mainCylHeight - 20}
        L ${x + config.mainCylWidth} ${y + 20}
        Q ${x + config.mainCylWidth} ${y} ${x + config.mainCylWidth - 20} ${y}
        L ${x + 20} ${y}
        Q ${x} ${y} ${x} ${y + 20}
        Z
    `)
        .fill(cylinderGradient)
        .stroke({ color: '#444', width: 1 });

    // Add nozzle (centered horizontally)
    const nozzleX = x + (config.mainCylWidth - config.nozzleRect3Width) / 2;
    createNozzle(draw, group, nozzleX, y - 12); // Pass draw and group

    // Add vertical label on cylinder
    group.text(function(add) {
        add.tspan(label).dx(x + config.mainCylWidth / 2).dy(y + config.mainCylHeight / 2);
    })
        .font({
            family: 'Arial',
            size: 20,
            anchor: 'middle',
            weight: 'bold'
        })
        .fill('white')
        .transform({ rotate: -90, cx: x + config.mainCylWidth / 2, cy: y + config.mainCylHeight / 2 });

    return group;
}
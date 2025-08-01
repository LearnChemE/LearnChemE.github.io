    import {
        off
    } from '@svgdotjs/svg.js';
    import * as config from './config.js';
    import {
        computePressure
    } from './flowSolver.js';

    const canvasHeight = config.canvasHeight;
    const canvasWidth = config.canvasWidth;
    let startX = canvasWidth / 2;
    let startY = canvasHeight - 190;
    let pipe = null;
    let angle = 0;
    const pipeLength = (3 / 12) * canvasWidth;
    let pipeGroup;
    let draw = null;
    let switchControl = null;
    let pressure = null;
    let pressure1 = null;
    let isRotated = false;
    let dropInterval = null;
    let tank = null;
    let waterGroup = null;
    let currentLiquidHeight = 0; // in mL
    let fillInterval = null;

    const SYRINGE_TOTAL_VOLUME = 200; // mL
    const SYRINGE_STROKE_PX = 72;
    // Manual syringe animation state
    let syringeInterval = null;
    let syringeProgress = 0;
    const SYRINGE_INITIAL_WIDTH = 100 - 25;
    const SYRINGE_ANIM_INTERVAL = 16; // ms per tick
    const RATE_MAP = {
        high: 1, // ml/s
        medium: 0.6, // ml/s
        low: 0.3 // ml/s
    };

    const maxVolume = 200; // mL, as used in drawBracket

    // const radios = document.querySelectorAll('input[name="flowRateOptions"]');

    let flowRate = RATE_MAP["high"];

    // // Update flowRate when the user selects a different option
    // radios.forEach(radio => {
    //   radio.addEventListener('change', e => {
    //     flowRate = RATE_MAP[e.target.id];
    //     console.log('Flow rate set to', flowRate, 'mL/s');
    //   });
    // });

    // Tank drawing and scaling constants
    const TANK_X = 850;
    const TANK_Y = canvasHeight;
    const TANK_WIDTH = 100;
    const TANK_HEIGHT_PX = 125;
    const TANK_SURFACE = 10;
    const TANK_HOLDER = 20;
    const TANK_MAX_ML = 200;
    let syringe = null;
    let prevAngle = 0;
    let syringeCenter = null;
    let flowController = null;
    // let rectangle = null;

    // Save the SVG.js context so other functions can reuse it
    export function drawFigure(svg) {
        draw = svg;
        waterGroup = draw.group();
        addSVGImage(
            draw,
            'assets/GFRDeviceDisplay1.svg',
            900, 60,
            150, 150
        ).hide();
        tank = drawBracket(svg, TANK_X, TANK_Y, TANK_WIDTH, TANK_HEIGHT_PX, TANK_SURFACE, TANK_HOLDER, TANK_MAX_ML);
        flowController = drawCutoffValve(draw, 700, 410, 40);
        const angleRad = (angle * Math.PI) / 180;
        syringe = drawSyringe(draw, 0, 0);
  
        pressure = draw.text('0.00 KPa')
            .font({
                family: 'Arial',
                size: 20
            })
            .center(975, 140)
            .fill('#000');
        pressure.hide();
        drawPipe(draw);
        drawDashedHorizontalLine(draw, canvasWidth / 2 - 150 - 30, canvasHeight - 100, 200);
        switchControl = drawSwitch(draw, -80, 120, 80, 40);

        draw.text('Pressure is in kPa')
            .font({
                family: 'Arial',
                size: 15
            })
            .center(1030, 60)
            .fill('#000');
    }

    function drawPipe(draw) {
        pipeGroup = draw.group();

        pipe = `
        M ${startX - pipeLength * Math.cos((angle * Math.PI) / 180)} ${startY - pipeLength * Math.sin((angle * Math.PI) / 180)} 
        L ${startX} ${startY}
        L ${startX + pipeLength} ${startY}
      `;
        drawPipeWithCurves(pipeGroup, pipe, (2.5 / 30 * pipeLength), '#B4B4FF');

        // Animate continuous water flow horizontally from pipe outlet
        const margin = 30;
        drawDimensionLine(pipeGroup, {
            x: startX - pipeLength * Math.cos((angle * Math.PI) / 180) - margin * Math.sin((angle * Math.PI) / 180),
            y: startY - pipeLength * Math.sin((angle * Math.PI) / 180) + margin * Math.cos((angle * Math.PI) / 180)
        }, {
            x: startX - margin * Math.sin((angle * Math.PI) / 180),
            y: startY + margin * Math.cos((angle * Math.PI) / 180)
        }, 10, "30 cm");
        drawDimensionLine(pipeGroup, {
            x: startX,
            y: startY + margin
        }, {
            x: startX + pipeLength,
            y: startY + margin
        }, 10, "30 cm");
        const margin1 = 100
        drawAngleArc(pipeGroup, {
                x: startX - margin * Math.sin((angle * Math.PI) / 180),
                y: startY + margin * Math.cos((angle * Math.PI) / 180)
            }, {
                x: startX - margin1 * Math.sin((angle * Math.PI) / 180),
                y: canvasHeight - 100
            },
            angle, {
                color: '#000',
                width: 2,
                arrowLen: 8
            });
        const margin2 = 100
        // Compute image position with a perpendicular offset
        const angleRad = (angle * Math.PI) / 180;
        const imageOffset = 85; // adjust this value as needed
        const imgX = startX - (pipeLength) * Math.cos(angleRad) + imageOffset * Math.sin(angleRad);
        const imgY = startY - pipeLength * Math.sin(angleRad) - imageOffset * Math.cos(angleRad);
        addSVGImage(
            pipeGroup,
            'assets/gasFlowRateDevice1.svg',
            imgX - 45, imgY,
            120 * 1.25, 90 * 1.25
        ).rotate(
            angle,
            imgX,
            imgY
        );

        const syringeX = startX - (pipeLength + 90) * Math.cos(angleRad);
        const syringeY = startY - (pipeLength + 90) * Math.sin(angleRad);

        syringeCenter = {
            x: syringe.bbox().cx,
            y: syringe.bbox().cy
        };
        // Apply transformations
        syringe.transform({
            rotate: angle, // Absolute rotation
            around: [syringeCenter.x, syringeCenter.y], // Use initial center
            position: [syringeX, syringeY] // Set position
        });

        syringe.front();
        flowController.front();

        const newP = (isRotated && currentLiquidHeight < maxVolume) ? computePressure(flowRate, angle) : 0;

        const lineXX = startX - (pipeLength + 160) * Math.cos(angleRad);
        const lineYY = startY - (pipeLength + 160) * Math.sin(angleRad);

        // Compute control point halfway and offset for curvature
        const ctrlX = lineXX / 2;
        const ctrlY = (140 + lineYY) / 2 - 50; // adjust -50 to tweak curve height
        pipeGroup.path(`M0,140 Q${ctrlX},${ctrlY} ${lineXX},${lineYY}`)
            .stroke({
                color: 'gray',
                width: 2
            })
            .fill('none');
        // Always update and show pressure, even if zero
        // pressure.show();
        pressure.text(`${newP.toFixed(2)} kPa`).center(975, 140);

        const p = (isRotated && currentLiquidHeight < maxVolume) ? computePressure(flowRate, angle) : 0;
        pressure1 = pipeGroup.text( ' Pa')
            .font({
                family: 'Arial',
                size: 16
            })
            .center(imgX + 30, imgY + 35)
            .fill('#000')
            .rotate(angle, imgX, imgY);

        // pipeGroup.text( 'KPa')
        //     .font({
        //         family: 'Arial',
        //         size: 15
        //     })
        //     .center(imgX + 15, imgY + 15)
        //     .fill('#000')
        //     .rotate(angle, imgX, imgY);

        // pressure1.show();
        pressure1.text(`${p.toFixed(2)}`).center(imgX + 30, imgY + 35);
    }

    function drawPipeWithCurves(draw, pathString, pipeWidth = 15, strokeColor = '#f7f7f7', outlineColor = '#d5d5d5') {
        pipeGroup.clear();
        pipeGroup = draw.group();
        let outline = draw.path(pathString)
            .fill('none')
            .stroke({
                color: outlineColor,
                width: pipeWidth + 4,
                linejoin: 'round'
            });
        pipeGroup.add(outline);
        let pipe = draw.path(pathString)
            .fill('none')
            .stroke({
                color: strokeColor,
                width: pipeWidth,
                linejoin: 'round'
            });
        pipeGroup.add(pipe);
        return pipe;
    }

    /* ─── UI bindings for the angle slider + numeric input ─────────────── */
    const angleSlider = document.getElementById('angleSlider');
    const angleValue = document.getElementById('angleValue');


    // keep <span> and numeric box in‑sync with the slider
    function updateUI(val) {
        angleValue.textContent = val;
    }

    // slider → numeric box
angleSlider.addEventListener('input', e => {
    updateUI(e.target.value);
    angle = parseFloat(e.target.value);
    if (draw) {
        pipeGroup.clear();
        drawPipe(draw);
        // Reapply plunger and handle positions after rotation
        updatePlungerPosition();
    }
});

    function drawBracket(draw, startX, startY, width, height, surfaceWidth, holderLength, maxVolume, liquidColor = '#c1c1ff', liquidColorOpacity = 0.7) {
        const group = draw.group();
        const d = holderLength / Math.sqrt(2);

        const P0 = {
            x: startX,
            y: startY
        };
        const P1 = {
            x: startX - width / 2,
            y: startY
        };
        const P2 = {
            x: P1.x,
            y: startY - height
        };
        const P3 = {
            x: P2.x - d,
            y: P2.y - d
        };
        const P4 = {
            x: P3.x + surfaceWidth,
            y: P3.y - surfaceWidth
        };
        const P5 = {
            x: P4.x + d,
            y: P4.y + d
        };
        const P6 = {
            x: P5.x,
            y: startY - surfaceWidth
        };
        const P7 = {
            x: startX,
            y: P6.y
        };

        const Q1 = {
            x: startX + width / 2,
            y: startY
        };
        const Q2 = {
            x: Q1.x,
            y: startY - height
        };
        const Q3 = {
            x: Q2.x + d,
            y: Q2.y - d
        };
        const Q4 = {
            x: Q3.x - surfaceWidth,
            y: Q3.y - surfaceWidth
        };
        const Q5 = {
            x: Q4.x - d,
            y: Q4.y + d
        };
        const Q6 = {
            x: Q5.x,
            y: startY - surfaceWidth
        };
        const Q7 = {
            x: startX,
            y: Q6.y
        };

        const points = [P0, P1, P2, P3, P4, P5, P6, P7, Q6, Q5, Q4, Q3, Q2, Q1, P0];
        const pointString = points.map(pt => `${pt.x},${pt.y}`).join(" ");

        let bracket = group.polyline(pointString)
            .fill('#e6e6e6')
            .stroke({
                color: '#898989',
                width: 2
            });

        let tickInterval = 10;
        let index = 250;
        if (maxVolume === 1000) {
            index = 250;
            tickInterval = 20;
        } else if (maxVolume === 300) {
            index = 100;
            tickInterval = 10;
        } else if (maxVolume === 500) {
            index = 250;
            tickInterval = 10;
        } else if (maxVolume === 2000) {
            index = 1000;
            tickInterval = 40;
        } else if (maxVolume === 5000) {
            index = 100;
            tickInterval = 100;
        } else if (maxVolume === 200) {
            index = 5;
            tickInterval = 5;
        }
        const numTicks = maxVolume / tickInterval;
        const liquidMaxHeight = height;
        const bottomY = startY - surfaceWidth;
        const leftX = startX - (width - 2 * surfaceWidth) / 2;

        for (let i = 0; i <= numTicks; i++) {
            const tickVolume = i * tickInterval;
            const tickLength = (tickVolume % 12.5 === 0) ? 20 : 10;
            const tickY = bottomY - (tickVolume / maxVolume) * liquidMaxHeight;
            let tick = group.line(leftX, tickY, leftX + tickLength, tickY)
                .stroke({
                    color: '#000',
                    width: 1
                });

            if (tickVolume % 25 === 0 && tickVolume !== 0) {
                const textLabel = group.text(tickVolume.toString() + " mL")
                    .font({
                        family: 'Arial',
                        size: 10
                    })
                    .move(leftX + tickLength + 2, tickY - 5);
                textLabel.attr({
                    'text-anchor': 'start'
                });
            }
        }

        return group;
    }

    function drawLiquidRectangle(startX, startY, width, surfaceWidth, liquidHeight, fillColor = '#c1c1ff', fillOpacity = 0.7) {
        const rectWidth = width - 2 * surfaceWidth;
        const rectX = startX - rectWidth / 2;
        const rectY = startY - surfaceWidth;

        const pathString = `
        M ${rectX} ${rectY}
        L ${rectX + rectWidth} ${rectY}
        L ${rectX + rectWidth} ${rectY - liquidHeight}
        L ${rectX} ${rectY - liquidHeight}
        Z
      `;

        let liquid = draw.path(pathString)
            .fill({
                color: fillColor,
                opacity: fillOpacity
            });
        waterGroup.add(liquid);
        return liquid;
    }

    export function drawDimensionLine(draw, start, end, arrowLen, textContent) {
        // Calculate basic geometry
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const angle = Math.atan2(dy, dx);
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;
        const arrowAngle = Math.PI / 6; // 30 degrees

        // Draw dashed main line
        draw.line(start.x, start.y, end.x, end.y)
            .stroke({
                color: '#000',
                width: 2,
                dasharray: '5,5'
            });

        // Draw arrowhead at start
        const startLeft = {
            x: start.x + arrowLen * Math.cos(angle - arrowAngle),
            y: start.y + arrowLen * Math.sin(angle - arrowAngle)
        };
        const startRight = {
            x: start.x + arrowLen * Math.cos(angle + arrowAngle),
            y: start.y + arrowLen * Math.sin(angle + arrowAngle)
        };
        draw.polygon([start.x, start.y,
                startLeft.x, startLeft.y,
                startRight.x, startRight.y
            ])
            .fill('#000');

        // Draw arrowhead at end
        const endLeft = {
            x: end.x + arrowLen * Math.cos(angle + Math.PI - arrowAngle),
            y: end.y + arrowLen * Math.sin(angle + Math.PI - arrowAngle)
        };
        const endRight = {
            x: end.x + arrowLen * Math.cos(angle + Math.PI + arrowAngle),
            y: end.y + arrowLen * Math.sin(angle + Math.PI + arrowAngle)
        };
        draw.polygon([end.x, end.y,
                endLeft.x, endLeft.y,
                endRight.x, endRight.y
            ])
            .fill('#000');

        // Draw text and background
        const textElem = draw.text(textContent)
            .font({
                family: 'Arial',
                size: 15
            })
            .center(midX, midY)
            .rotate(angle * 180 / Math.PI)
            .fill('#000');
        // Measure and draw white background behind text
        const bbox = textElem.bbox();
        draw.rect(bbox.width + 2, bbox.height + 4)
            .fill('#fff')
            .move(bbox.x - 1, bbox.y - 2)
            .rotate(angle * 180 / Math.PI)
            .insertBefore(textElem);
    }

    function drawDashedHorizontalLine(draw, startX, startY, length, color = 'black', width = 1, dashArray = '5,5') {
        const group = draw.group();
        group.line(startX, startY, startX + length, startY)
            .stroke({
                color: color,
                width: width,
                dasharray: dashArray
            });
        return group;
    }

    export function drawAngleArc(draw, p1, p2, angleDeg, opts = {}) {
        // If angle is zero, draw a straight line instead
        if (Math.abs(angleDeg) < 1e-6) {
            // Draw straight line
            draw.line(p1.x, p1.y, p2.x, p2.y)
                .stroke({
                    color: opts.color || '#000',
                    width: opts.width || 2
                })
                .fill('none');
            // Place "0°" text at midpoint, rotated along the line
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            const lineAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            draw.text('0°')
                .font({
                    family: 'Arial',
                    size: 15
                })
                .center(midX - 10, midY)
            return;
        }
        const {
            color = '#000', width = 2, sweep = true
        } = opts;
        const angle = angleDeg * Math.PI / 180;
        // Chord vector and length
        const dx = p2.x - p1.x,
            dy = p2.y - p1.y;
        const chord = Math.hypot(dx, dy);
        // Compute radius from chord and central angle
        const r = chord / (2 * Math.sin(angle / 2));
        // Midpoint of chord
        const mx = (p1.x + p2.x) / 2,
            my = (p1.y + p2.y) / 2;
        // Distance from midpoint to circle center
        const h = Math.sqrt(Math.max(0, r * r - (chord / 2) ** 2));
        // Unit normal to chord
        const ux = -dy / chord,
            uy = dx / chord;
        // Determine center side based on sweep direction
        const cx = mx + (sweep ? ux * h : -ux * h);
        const cy = my + (sweep ? uy * h : -uy * h);
        // Arc flags
        const largeArcFlag = Math.abs(angle) > Math.PI ? 1 : 0;
        const sweepFlag = sweep ? 0 : 1;
        // Draw SVG arc path
        draw
            .path(`M${p1.x},${p1.y} A${r},${r} 0 ${largeArcFlag} ${sweepFlag} ${p2.x},${p2.y}`)
            .stroke({
                color,
                width
            })
            .fill('none');

        // Draw angle text at midpoint of arc
        const a1 = Math.atan2(p1.y - cy, p1.x - cx);
        const a2 = a1 + (sweep ? angle : -angle);
        const midAngle = (a1 + a2) / 2;
        const textRadius = r + 10;
        const textX = cx + textRadius * Math.cos(midAngle);
        const textY = cy + textRadius * Math.sin(midAngle);
        draw.text(`${Math.round(angleDeg)}°`)
            .font({
                family: 'Arial',
                size: 15
            })
            .center(textX, textY);
    }

    function addSVGImage(draw, url, x = 0, y = 0, width, height) {
        const img = draw.image(url)
            .size(width, height) // force the element to the given dimensions
            .move(x, y)
            .attr({
                preserveAspectRatio: 'none'
            }); // stretch to fill exactly
        return img;
    }

    // let syringeProgress = 0; // in mL
    let plungerGroup = null; // group for moving parts
    let handleGroup = null; // group for handle parts
    let handleGroup1 = null; // group for handle parts
    let handleGroup2 = null; // group for handle parts
    // Modified drawSyringe function
    export function drawSyringe(draw, x, y, scale, flowRate = maxVolume, totalVolume = maxVolume) {
        const syringeGroup = draw.group();
        const width = (2.5 / 30 * pipeLength);

        // Body group (FIXED parts - syringe barrel)
        const bodyGroup = syringeGroup.group();
        plungerGroup = syringeGroup.group();
        handleGroup = syringeGroup.group();
        handleGroup1 = syringeGroup.group();
        handleGroup2 = syringeGroup.group();

handleGroup2.rect(125 + 50, 2)
    .fill('grey')
    .stroke({
        color: 'grey',
        width: 2
    })
    .move(x + 21 + 87 - 45 - 50, y + 2 * width / 2);
handleGroup2.back();

        const liquidRect = plungerGroup.rect(100 - 25, 2 * width)
            .fill('#B4B4FF')
            .move(x + 27 + 87, y);

            liquidRect.front();

        bodyGroup.rect(100, 2 * width)
            .fill('none')
            .stroke({
                color: '#d5d5d5',
                width: 4
            })
            .move(x + 87, y);

            bodyGroup.back();

        bodyGroup.rect(5, 2 * width)
            .fill('#d5d5d5')
            .stroke({
                color: '#d5d5d5',
                width: 4
            })
            .move(x + 100 + 87, y);

        


        // MOVING holder (should move with plunger)
        // handleGroup2.rect(80, 2)
        //     .fill('grey')
        //     .stroke({
        //         color: 'grey',
        //         width: 2
        //     })
        //     .move(x + (80 - 45 + 26), y + width / 2);

        // MOVING support (should move with plunger)
        handleGroup1.rect(5, 2 * width)
            .fill('grey')
            .stroke({
                color: 'grey',
                width: 2
            })
            .move(x + 21 + 87, y);
        
  

        // MOVING liquid (should move with plunger)

        // Store references
        syringeGroup.liquid = liquidRect;
        syringeGroup.initialWidth = 100 - 25;

        return syringeGroup;
    }

    // Update function - ONLY move plunger group
    function updatePlungerPosition() {
        if (!syringe || !plungerGroup || !handleGroup1 || !handleGroup2) return;

        const progressPx = (syringeProgress * SYRINGE_STROKE_PX) / SYRINGE_TOTAL_VOLUME;
        plungerGroup.transform({
            translateX: progressPx
        });
        handleGroup1.transform({ translateX: progressPx });
        // handleGroup2.transform({ translateX: progressPx });
        // rectangle.transform({
        //     translateX: progressPx
        // });

        const remainingWidth = Math.max(0, syringe.initialWidth - progressPx);
        syringe.liquid.attr({
            width: remainingWidth
        });
    }

    function drawSwitch(draw, x, y, width, height, opacity = 1) {
        const switchGroup = draw.group();
        switchGroup.isOn = false;
        const handleWidth = 5;
        const handleHeight = height * 0.8;
        const handle = switchGroup.rect(handleWidth, handleHeight)
            .fill({
                color: '#aaa',
                opacity: opacity
            })
            .move(x + (width - handleWidth) / 2, y - height / 2);
        switchGroup.handle = handle;

        switchGroup.rect(width, height)
            .fill({
                color: '#555',
                opacity: opacity
            })
            .radius(height / 5)
            .move(x, y);
        switchGroup.text('OFF')
            .font({
                size: 12,
                anchor: 'middle',
                fill: '#fff'
            })
            .center(x + width * 0.25, y + height / 2);
        switchGroup.text('ON')
            .font({
                size: 12,
                anchor: 'middle',
                fill: '#fff'
            })
            .center(x + width * 0.75, y + height / 2);
        let isOn = false;
        handle.rotate(-20, x + width / 2, y + height / 2);
        switchGroup.click(() => {
            isOn = !isOn;
            switchGroup.isOn = isOn;
            if (isOn) {
                // pressure.show();
                handle.animate(200).rotate(40, x + width / 2, y + height / 2);
            } else {
                // pressure.hide();
                handle.animate(200).rotate(-40, x + width / 2, y + height / 2);
            }

            // Control syringe animation based on switch state
            if (switchGroup.isOn) {
                // Start filling the tank and animate syringe plunger in lockstep
                const intervalMs = 100; // update every 100ms
                const maxVolume = TANK_MAX_ML; // mL, as used in drawBracket
                const bracketHeightPx = TANK_HEIGHT_PX; // px, height passed to drawBracket
                const mlToPx = bracketHeightPx / maxVolume;

                // Clear any existing fill interval
                clearInterval(fillInterval);
                fillInterval = setInterval(() => {
                    // Increment current volume
                    currentLiquidHeight = Math.min(maxVolume, currentLiquidHeight + flowRate * (intervalMs / 1000));
                    // Convert to px
                    const liquidPx = currentLiquidHeight * mlToPx;
                    // Clear previous liquid and draw new level
                    waterGroup.clear();
                    drawLiquidRectangle(TANK_X, TANK_Y, TANK_WIDTH, TANK_SURFACE, liquidPx);
                    // Sync syringe plunger with tank fill
                    syringeProgress = Math.min(SYRINGE_TOTAL_VOLUME, syringeProgress + flowRate * (intervalMs / 1000));
                    updatePlungerPosition();
                    if (currentLiquidHeight >= maxVolume) {
                        // Stop filling and drops
                        clearInterval(fillInterval);
                        clearInterval(dropInterval);
                        // Auto-turn off switch
                        // handle.animate(200).rotate(-40, x + width / 2, y + height / 2);
                        isOn = false;
                        switchGroup.isOn = false;
                        reset();
                    }
                }, intervalMs);

                const pipeDiameter = (2.5 / 30) * pipeLength - 10;
                const flowY = startY - 5;
                // Small droplet parameters
                const dropletSizes = { high: 4, medium: 3, low: 2 };
                const dropletSize = Math.max(dropletSizes[flowController.flowRate], pipeDiameter * 0.2);
                // Determine number of streams to fill the pipe diameter
                const streams = Math.max(5, Math.floor(pipeDiameter / (dropletSize * 2)));
                // Start droplet emission, clearing any previous interval
                clearInterval(dropInterval);
                dropInterval = setInterval(() => {
                    // Only emit flow when valve is open
                    if (!isRotated || currentLiquidHeight >= maxVolume) return;
                    for (let i = 0; i < streams; i++) {
                        const yOffset = i * (pipeDiameter / (streams - 2)) - (pipeDiameter / 2);
                        const droplet = draw.circle(dropletSize)
                            .fill('#B4B4FF')
                            .move(startX + pipeLength - dropletSize / 2, flowY + yOffset)
                            .front();
                        {
                            const duration = 2000;
                            const startX0 = startX + pipeLength - dropletSize / 2;
                            const startY0 = flowY + yOffset;
                            const endX = canvasWidth + dropletSize;
                            const vX = (endX - startX0) / (duration / 1000); // pixels per second
                            const g = 400;

                            // Manual parabolic motion using interval
                            const startTime = Date.now();
                            const intervalId = setInterval(() => {
                                const t = (Date.now() - startTime) / 1000;
                                const xPos = startX0 + vX * flowRate * t;
                                const yPos = startY0 + 0.5 * g * t * t;
                                droplet.move(xPos, yPos);
                                if (yPos > canvasHeight - 15) {
                                    clearInterval(intervalId);
                                    droplet.remove();
                                }
                            }, 16); // roughly 60fps
                        }
                    }
                }, 10); // emit every 10ms
            } else {
                // Stop continuous drops
                clearInterval(dropInterval);
                // Stop filling the tank
                clearInterval(fillInterval);
            }

            isRotated = !isRotated;

            // Update pressure display
            const newP = (isRotated && currentLiquidHeight < maxVolume) ? computePressure(flowRate, angle) : 0;
            pressure.text(`${newP.toFixed(2)} KPa`).center(975, 140);
            const angleRad = (angle * Math.PI) / 180;
            const imageOffset = 85;
            const imgX = startX - (pipeLength) * Math.cos(angleRad) + imageOffset * Math.sin(angleRad);
        const imgY = startY - pipeLength * Math.sin(angleRad) - imageOffset * Math.cos(angleRad);
            pressure1.text(`${newP.toFixed(2)}`).center(imgX + 30, imgY + 35);
        });
        // Remember pivot for reset
        switchGroup.pivot = {
            x,
            y,
            width,
            height
        };
        return switchGroup;
    }

    export function drawCutoffValve(draw, x, y, size = 40) {
        const half = size / 2;
        const group = draw.group().center(x, y);

        group.flowRate = group.flowRate || "high";
        // Display current flow rate
        let rateText = group.text("flow rate: " + String(group.flowRate))
            .font({
                family: 'Arial',
                size: 14,
                anchor: 'start'
            })
            .fill('#000')
            .move(x - size / 2 - 30, y - 40);

        // Outer circle for valve body
        group.circle(size)
            .fill('#eee')
            .stroke({
                color: '#444',
                width: 2
            })
            .center(x, y);

        // Diagonal bar across circle (closed position)
        group.line(-half * 0.7, -half * 0.7, half * 0.7, half * 0.7)
            .stroke({
                color: '#a00',
                width: 2,
                linecap: 'round'
            })
            .center(x, y);

        // Valve handle perpendicular to diagonal
        group.line(-half * 0.7, half * 0.7, half * 0.7, -half * 0.7)
            .stroke({
                color: '#a00',
                width: 2,
                linecap: 'round'
            })
            .center(x, y);

        group.line(0, half, 0, -half)
            .stroke({
                color: '#444',
                width: 2,
                linecap: 'round'
            })
            .center(x, y);

        group.line(half, 0, -half, 0)
            .stroke({
                color: '#444',
                width: 2,
                linecap: 'round'
            })
            .center(x, y);

        group.circle(size * 0.6)
            .fill('#ccc')
            .stroke({
                color: '#444',
                width: 1
            })
            .center(x, y);


        group.circle(size * 0.1)
            .fill('black')
            .stroke({
                color: '#444',
                width: 2
            })
            .center(x, y);

        // Interactive flow-rate selector on click
        group.on('click', function(event) {
            event.preventDefault();
            event.stopPropagation();

            // Remove existing control box
            const prev = document.getElementById('cutoff-valve-controls');
            if (prev) prev.remove();

            // Create control container
            const container = document.createElement('div');
            container.id = 'cutoff-valve-controls';
            Object.assign(container.style, {
                position: 'absolute',
                background: 'white',
                border: '1px solid #444',
                padding: '8px',
                'border-radius': '4px',
                'box-shadow': '0 2px 6px rgba(0,0,0,0.2)',
                'z-index': '1000',
                display: 'flex',
                'align-items': 'center'
            });

            // Build dropdown
            const select = document.createElement('select');
            ["high", "medium", "low"].forEach(val => {
                const opt = document.createElement('option');
                opt.value = val;
                opt.text = val;
                select.appendChild(opt);
            });
            container.appendChild(select);
            if (group.flowRate !== undefined) {
                select.value = group.flowRate;
            }

            // Build set button
            const button = document.createElement('button');
            button.textContent = 'Set';
            button.style.marginLeft = '8px';
            container.appendChild(button);

            // Append to body before positioning to measure size
            document.body.appendChild(container);

            // Position container to the left of the valve icon
            const rect = this.node.getBoundingClientRect();
            const cw = container.offsetWidth;
            const ch = container.offsetHeight;
            container.style.left = (rect.left - cw - 10) + 'px';
            container.style.top = (rect.top + rect.height / 2 - ch / 2) + 'px';

            // Handle Set button
            button.addEventListener('click', () => {
                flowRate = RATE_MAP[select.value];
                group.flowRate = select.value;
                rateText.text("flow rate: " + String(group.flowRate))
                container.remove();

                if (tank) {
                    const offsets = { high: 0, medium: -25, low: -50 };
                    // Reset any previous translation and apply new offset
                    tank.transform({ translateX: offsets[select.value], translateY: 0 });
                    waterGroup.transform({ translateX: offsets[select.value], translateY: 0 });
                } else {
                    console.warn('Tank element not initialized yet.');
                }
            });

            // Close dropdown when clicking outside
            setTimeout(() => {
                function onDocClick(e) {
                    if (!container.contains(e.target) && e.target !== this.node) {
                        container.remove();
                        document.removeEventListener('click', onDocClick);
                    }
                }
                document.addEventListener('click', onDocClick);
            }, 0);
        });


        return group;
    }

    export function reset() {
        // Stop all running animations and fills
        clearInterval(fillInterval);
        clearInterval(dropInterval);
        clearInterval(syringeInterval);

        // Reset model state
        currentLiquidHeight = 0;
        syringeProgress = 0;

        // Clear any drawn water and redraw an empty tank
        if (waterGroup) waterGroup.clear();

        // Reset syringe plunger and liquid
        updatePlungerPosition();
        if (syringe && syringe.initialWidth !== undefined) {
            syringe.liquid.attr({
                width: syringe.initialWidth
            });
        }
        // Reset switch handle and state
        if (switchControl) {
            switchControl.clear();
            switchControl = drawSwitch(draw, -80, 120, 80, 40);
        }
        isRotated = false;
        // pressure.hide();
        pressure.text('0.00 kPa').center(975, 140);
        const angleRad = (angle * Math.PI) / 180;
        const imageOffset = 85;
        const imgX = startX - (pipeLength) * Math.cos(angleRad) + imageOffset * Math.sin(angleRad);
        const imgY = startY - pipeLength * Math.sin(angleRad) - imageOffset * Math.cos(angleRad);
        pressure1.text(`0.00`).center(imgX + 30, imgY + 35);
    }
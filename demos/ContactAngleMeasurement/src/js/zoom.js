import * as config from './config.js';
import * as state from './state.js';

export function addOptionToDragAndZoom(draw) {
    // draw.text("zoom with the scroll wheel")
    // .move(config.canvasWidth / 2 - 100, 0)
    // .font({ size: 16, anchor: 'left' })

    // draw.text("After zooming, drag mouse to move image")
    // .move(config.canvasWidth / 2 - 150, 15)
    // .font({ size: 16, anchor: 'left' })
    // const defaultViewbox = { x: 0, y: 0, width: config.canvasWidth, height: config.canvasHeight };
    // draw.viewbox(defaultViewbox.x, defaultViewbox.y, defaultViewbox.width, defaultViewbox.height);
    
    // const background = draw.rect(config.canvasWidth, config.canvasHeight)
    // .fill({ color: '#fff', opacity: 0 })
    // .attr({ 'pointer-events': 'all' });
    // background.back();
    
    // draw.on('mousedown', function(event) {
    //     const vb = draw.viewbox();
    //     if (vb.width >= defaultViewbox.width) return;
    //     state.setIsPanning(true);
    //     state.setPanStart({ x: event.clientX, y: event.clientY });
    // });
    
    // draw.on('mousemove', function(event) {
    //     if (!state.isPanning) return;
    //     event.preventDefault();
    //     const dx = event.clientX - state.panStart.x;
    //     const dy = event.clientY - state.panStart.y;
    //     const vb = draw.viewbox();
    //     if (vb.width < defaultViewbox.width) {
    //         draw.viewbox(vb.x - dx, vb.y - dy, vb.width, vb.height);
    //     }
    //     state.setPanStart({ x: event.clientX, y: event.clientY });
    // });
    
    // draw.on('mouseup', function() {
    //     state.setIsPanning(false);
    // });
    
    // document.addEventListener('mouseup', () => {
    //     state.setIsPanning(false);
    // });
    
    // draw.on('wheel', function(event) {
    //     event.preventDefault();
    //     const zoomStep = 0.02;
    //     const zoomFactor = event.deltaY < 0 ? (1 - zoomStep) : (1 + zoomStep);
    //     const vb = draw.viewbox();
    //     let newWidth = vb.width * zoomFactor;
    //     let newHeight = vb.height * zoomFactor;
    //     if (newWidth >= defaultViewbox.width) {
    //         draw.viewbox(defaultViewbox.x, defaultViewbox.y, defaultViewbox.width, defaultViewbox.height);
    //         return;
    //     }
    //     const pt = draw.node.createSVGPoint();
    //     pt.x = event.clientX;
    //     pt.y = event.clientY;
    //     const cursor = pt.matrixTransform(draw.node.getScreenCTM().inverse());
    //     let newX = cursor.x - (cursor.x - vb.x) * zoomFactor;
    //     let newY = cursor.y - (cursor.y - vb.y) * zoomFactor;
    //     newX = Math.max(0, Math.min(newX, config.canvasWidth - newWidth));
    //     newY = Math.max(0, Math.min(newY, config.canvasHeight - newHeight));
    //     draw.viewbox(newX, newY, newWidth, newHeight);
    // });
}
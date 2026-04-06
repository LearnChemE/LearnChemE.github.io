import * as config from './config.js';
import * as state from './state.js';

export function addOptionToDragAndZoom(draw) {
    // draw.text("zoom with the scroll wheel")
    // .move(config.canvasWidth / 2 - 100, 0)
    // .font({ size: 16, anchor: 'left' })

    // draw.text("After zooming, drag mouse to move image")
    // .move(config.canvasWidth / 2 - 150, 15)
    // .font({ size: 16, anchor: 'left' })
    const defaultViewbox = { x: 0, y: 0, width: config.canvasWidth, height: config.canvasHeight };
    draw.viewbox(defaultViewbox.x, defaultViewbox.y, defaultViewbox.width, defaultViewbox.height);
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    
    const background = draw.rect(config.canvasWidth, config.canvasHeight)
    .fill({ color: '#fff', opacity: 0 });
    background.back();

    const canPan = () => draw.viewbox().width < defaultViewbox.width;
    const startPan = (event) => {
        if (event.button !== 0) return;
        if (!canPan()) return;
        if (event.target && typeof event.target.closest === 'function' && event.target.closest('[data-no-pan]')) return;
        state.setIsPanning(true);
        state.setPanStart({ x: event.clientX, y: event.clientY });
    };
    const panMove = (event) => {
        if (!state.getIsPanning()) return;
        event.preventDefault();
        const start = state.getPanStart();
        const vb = draw.viewbox();
        const bounds = draw.node.getBoundingClientRect();
        const scaleX = bounds.width ? vb.width / bounds.width : 1;
        const scaleY = bounds.height ? vb.height / bounds.height : 1;
        const dx = (event.clientX - start.x) * scaleX;
        const dy = (event.clientY - start.y) * scaleY;
        const maxX = Math.max(config.canvasWidth - vb.width, 0);
        const maxY = Math.max(config.canvasHeight - vb.height, 0);
        const nextX = clamp(vb.x - dx, 0, maxX);
        const nextY = clamp(vb.y - dy, 0, maxY);
        draw.viewbox(nextX, nextY, vb.width, vb.height);
        state.setPanStart({ x: event.clientX, y: event.clientY });
    };
    const endPan = () => {
        state.setIsPanning(false);
    };

    draw.on('mousedown', startPan);
    draw.on('mousemove', panMove);
    draw.on('mouseup', endPan);
    draw.on('mouseleave', endPan);
    document.addEventListener('mouseup', endPan);
    
    draw.on('wheel', function(event) {
        event.preventDefault();
        const zoomStep = 0.02;
        const zoomFactor = event.deltaY < 0 ? (1 - zoomStep) : (1 + zoomStep);
        const vb = draw.viewbox();
        let newWidth = vb.width * zoomFactor;
        let newHeight = vb.height * zoomFactor;
        if (newWidth >= defaultViewbox.width) {
            draw.viewbox(defaultViewbox.x, defaultViewbox.y, defaultViewbox.width, defaultViewbox.height);
            return;
        }
        const pt = draw.node.createSVGPoint();
        pt.x = event.clientX;
        pt.y = event.clientY;
        const cursor = pt.matrixTransform(draw.node.getScreenCTM().inverse());
        let newX = cursor.x - (cursor.x - vb.x) * zoomFactor;
        let newY = cursor.y - (cursor.y - vb.y) * zoomFactor;
        newX = Math.max(0, Math.min(newX, config.canvasWidth - newWidth));
        newY = Math.max(0, Math.min(newY, config.canvasHeight - newHeight));
        draw.viewbox(newX, newY, newWidth, newHeight);
    });
}

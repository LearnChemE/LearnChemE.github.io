export class ZoomView {
    zoom = 1;
    zoomX = 0;
    zoomY = 0;
    isDragging = false;
    lastMouseX = 0;
    lastMouseY = 0;

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.zoomX = width / 2;
        this.zoomY = height / 2;
    }

    apply = () => {
        const s = this.zoom;
        const zx = -this.zoomX * (s - 1);
        const zy = -this.zoomY * (s - 1);
        applyMatrix(s, 0, 0, s, zx, zy);
    }

    handleMouseWheel = (event) => {
        const zoomSpeed = 0.1;
        const zoomSign = event.deltaY > 0 ? -1 : 1;
        this.zoom += zoomSign * zoomSpeed;
        this.zoom = constrain(this.zoom, 1, 5);
        this.zoomX = lerp(this.zoomX, mouseX, zoomSign * zoomSpeed / this.zoom);
        this.zoomY = lerp(this.zoomY, mouseY, zoomSign * zoomSpeed / this.zoom);
        this.zoomX = constrain(this.zoomX, 0, this.width);
        this.zoomY = constrain(this.zoomY, 0, this.height);
    }

    handleMousePressed = () => {
        this.isDragging = true;
        this.lastMouseX = mouseX;
        this.lastMouseY = mouseY;
    }

    handleMouseReleased = () => {
        this.isDragging = false;
    }

    handleMouseDragged = () => {
        if (this.isDragging) {
            let dx = (this.lastMouseX - mouseX) * 2 / this.zoom;
            let dy = (this.lastMouseY - mouseY) * 2 / this.zoom;
            this.zoomX = constrain(this.zoomX + dx, 0, this.width);
            this.zoomY = constrain(this.zoomY + dy, 0, this.height);
            this.lastMouseX = mouseX;
            this.lastMouseY = mouseY;
        }
    }

    screenToWorld = (x, y) => {
        const s = this.zoom;
        const worldX = x / s + this.zoomX * (s - 1) / s;
        const worldY = y / s + this.zoomY * (s - 1) / s;
        return [worldX, worldY];
    }
}
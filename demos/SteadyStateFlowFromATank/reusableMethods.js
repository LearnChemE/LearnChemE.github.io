
class ReusableMethods {

    constructor(ctx) {
        if (!ctx) {
            throw new Error('Canvas rendering context (ctx) is required');
        }
        this.ctx = ctx;
    }

    drawDoubleArrowLine(startX, startY, endX, endY, arrowSize = 10) {
        const { ctx } = this;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.fillStyle = 'black'
        ctx.stroke();

        const angle = Math.atan2(endY - startY, endX - startX);

        this.drawArrowhead(startX, startY, angle + Math.PI, arrowSize);

        this.drawArrowhead(endX, endY, angle, arrowSize);
    }

    drawArrowhead(x, y, angle, size) {
        const { ctx } = this;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - size * Math.cos(angle - Math.PI / 6), y - size * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(x - size * Math.cos(angle + Math.PI / 6), y - size * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
    }

    drawText(x, y, text) {
        const { ctx } = this;
        ctx.textAlign = 'center';
        ctx.fillStyle = 'black'
        ctx.fillText(text, x, y);
    }

    drawDashedLine(startX, startY, endX, endY, dashPattern = [5, 5]) {
        const { ctx } = this;
        ctx.setLineDash(dashPattern);
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        ctx.setLineDash([]);
    }


    drawDoubleArrowLineOutward(x1, y1, x2, y2, label = '', arrowSize = 10) {
        const { ctx } = this;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1, y1 + 20);
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2, y2 - 20);
        ctx.stroke();

        this.drawArrowhead(x2, y2, Math.PI / 2, arrowSize);

        this.drawArrowhead(x1, y1, -Math.PI / 2, arrowSize);

        ctx.textAlign = 'center';
        const labelY = (y1 + y2) / 2; 
        ctx.fillText(label, x1 + 20, labelY);
    }

    drawTextWithSubscript(x, y, mainText, subText) {
        const { ctx } = this;
    
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
    
        ctx.fillText(mainText, x, y);
    
        ctx.font = '10px Arial'; 

        ctx.fillText(subText, x + ctx.measureText(mainText).width + 3, y + 5);
    
        ctx.font = '16px Arial';
    }
    
}

export default ReusableMethods;
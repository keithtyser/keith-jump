export class Platform {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    
    draw(ctx, cameraY) {
        // Draw the platform with camera offset
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y - cameraY, this.width, this.height);
    }
} 
class Spaceship {
    private ctx: CanvasRenderingContext2D;
    private x: number;
    private y: number;

    constructor(context: CanvasRenderingContext2D, x: number, y: number) {
        this.ctx = context;
        this.x = x;
        this.y = y;
    }

    draw(): void {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(this.x, this.y + 10, 50, 10);

        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(this.x - 10, this.y + 20, 70, 10);

        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(this.x + 10, this.y - 10, 30, 20);

        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(this.x + 20, this.y - 10, 10, 20);

        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(this.x + 20, this.y - 20, 10, 10);

        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.x + 15, this.y + 30, 5, 10);
        this.ctx.fillRect(this.x + 30, this.y + 30, 5, 10);
        
    }
}

export default Spaceship;

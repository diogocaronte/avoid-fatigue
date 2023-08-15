import Bound from '../geometry/bound';
import Circle from '../geometry/circle';
import Point from '../geometry/point';
import Rectangle from '../geometry/rectangle';
import Spaceship from '../game/spaceship';
import { listenKeyboard } from './keyboard';

export default class Screen {
    public canvas: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement = document.createElement('canvas')) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    resizeToCanvasClientSize() {
        const { width, height, clientWidth, clientHeight } = this.canvas;
        const needResize = clientWidth != width || clientHeight != height;
        if (!needResize) return;

        this.resize(new Point(clientWidth, clientHeight));
    }

    resize(size: Point) {
        this.canvas.width = size.x;
        this.canvas.height = size.y;
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderRect(rectangle: Rectangle, color: string) {
        this.context.fillStyle = color;
        this.context.fillRect(rectangle.position.x, rectangle.position.y, rectangle.size.x, rectangle.size.y);
    }

    renderCircle(circle: Circle, color: string) {
        this.context.beginPath();
        this.context.arc(circle.position.x, circle.position.y, circle.radius, 0, 2 * Math.PI);
        this.context.strokeStyle = color;
        this.context.stroke();
    }

    renderLine(pointA: Point, pointB: Point, color: string) {
        this.context.beginPath();
        this.context.moveTo(pointA.x, pointA.y);
        this.context.lineTo(pointB.x, pointB.y);
        this.context.strokeStyle = color;
        this.context.lineWidth = 1;
        this.context.stroke();
    }

    renderBound(bound: Bound, color: string) {
        if (bound.isEmpty()) return;

        const delta = bound.max.clone().subPoint(bound.min);

        this.context.strokeStyle = color;
        this.context.strokeRect(bound.min.x, bound.min.y, delta.x, delta.y);
    }

    renderGameObject(isStatic?: boolean, sprite?: string) {

        const spaceX = new Spaceship(this.context, 0, 0);

        if(!sprite) {
            spaceX.draw();
        }

        if(!isStatic) {

        }
    }

}



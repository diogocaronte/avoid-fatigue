import Point from './point';

export default class Circle {
    position: Point;
    radius: number;

    constructor(position = new Point(), radius = 1) {
        this.position = position;
        this.radius = radius;
    }
}

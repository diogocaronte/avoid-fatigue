import Point from './point';

export default class Circle implements ICircle {
    position: Point;
    radius: number;

    constructor(position = new Point(), radius = 1) {
        this.position = position;
        this.radius = radius;
    }
}

export interface ICircle {
    position: Point;
    radius: number;
}

import { ICircle } from '../geometry/circle';
import Point from '../geometry/point';

export default class Planet implements ICircle {
    position: Point;
    radius: number;

    constructor(position = new Point(), radius = 1) {
        this.position = position;
        this.radius = radius;
    }
}

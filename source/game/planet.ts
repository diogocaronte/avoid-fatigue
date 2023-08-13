import Point from '../geometry/point';

export default class Planet {
    position: Point;
    radius: number;

    constructor(position = new Point(), radius = 1) {
        this.position = position;
        this.radius = radius;
    }
}

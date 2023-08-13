import Point from './point';

export default class Rectangle {
    position: Point;
    size: Point;

    constructor(position = new Point(0), size = new Point(1)) {
        this.position = position;
        this.size = size;
    }
}

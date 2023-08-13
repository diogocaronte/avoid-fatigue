import Point from './point';
import Range from './range';

export default class Bound {
    min: Point;
    max: Point;
    points: Readonly<Point[]>;

    constructor(min = new Point(Infinity), max = new Point(-Infinity)) {
        this.min = min;
        this.max = max;
        this.points = [min, max];
    }

    toXRange() {
        return new Range(this.min.x, this.max.x);
    }

    toYRange() {
        return new Range(this.min.y, this.max.y);
    }

    getSize() {
        return this.max.clone().subPoint(this.min);
    }

    isPointOutside(point: Point) {
        return point.x < this.min.x || point.x >= this.max.x || point.y < this.min.y || point.y >= this.max.y;
    }

    isEmpty() {
        return this.min.x > this.max.x || this.min.y > this.max.y;
    }

    expandTo(point: Point) {
        Point.min(this.min, point, this.min);
        Point.max(this.max, point, this.max);

        return this;
    }

    expandBy(point: Point) {
        this.min.subPoint(point);
        this.max.addPoint(point);

        return this;
    }

    collapseBy(point: Point) {
        this.min.addPoint(point);
        this.max.subPoint(point);

        return this;
    }

    forEach(callback = (x: number, y: number) => {}) {
        if (this.isEmpty()) return;

        for (let x = Math.floor(this.min.x); x <= this.max.x; x++)
            for (let y = Math.floor(this.min.y); y <= this.max.y; y++) callback(x, y);

        return this;
    }

    clone() {
        return new Bound(this.min.clone(), this.max.clone());
    }
}

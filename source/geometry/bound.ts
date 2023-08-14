import Point from './point';
import Range from './range';

export default class Bound {
    readonly left = null as Bound | null;
    readonly right = null as Bound | null;
    readonly isSubdivided: boolean = false;

    min: Point;
    max: Point;
    points: Readonly<Point[]>;

    constructor(min = new Point(Infinity), max = new Point(-Infinity)) {
        this.min = min;
        this.max = max;
        this.points = [min, max];
    }

    inOrderTraverse(callback = (bound: Bound) => {}) {
        if (!this.isSubdivided) {
            callback(this);
            return;
        }

        (<Bound>this.left).inOrderTraverse(callback);
        callback(this);
        (<Bound>this.right).inOrderTraverse(callback);
    }

    subdivideHorizontally(normalizedPercentage = 0.5) {
        const height = this.max.y - this.min.y;
        const splitY = this.min.y + height * normalizedPercentage;

        (<any>this).left = new Bound(new Point(this.min.x, this.min.y), new Point(this.max.x, splitY));
        (<any>this).right = new Bound(new Point(this.min.x, splitY), new Point(this.max.x, this.max.y));

        (<any>this).isSubdivided = true;
        return this;
    }

    subdivideVertically(normalizedPercentage = 0.5) {
        const width = this.max.x - this.min.x;
        const splitX = this.min.x + width * normalizedPercentage;

        (<any>this).left = new Bound(new Point(this.min.x, this.min.y), new Point(splitX, this.max.y));
        (<any>this).right = new Bound(new Point(splitX, this.min.y), new Point(this.max.x, this.max.y));

        (<any>this).isSubdivided = true;
        return this;
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

export default class Point {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = x) {
        this.x = x;
        this.y = y;
    }

    static min(pointA: Point, pointB: Point, dist = new Point()) {
        dist.x = Math.min(pointA.x, pointB.x);
        dist.y = Math.min(pointA.y, pointB.y);
        return dist;
    }

    static max(pointA: Point, pointB: Point, dist = new Point()) {
        dist.x = Math.max(pointA.x, pointB.x);
        dist.y = Math.max(pointA.y, pointB.y);
        return dist;
    }

    static floor(pointA: Point, dist = new Point()) {
        dist.x = Math.floor(pointA.x);
        dist.y = Math.floor(pointA.y);
        return dist;
    }

    dot(point: Point) {
        return this.x * point.x + this.y * point.y;
    }

    rotate(radians: number) {
        const cosAngle = Math.cos(radians);
        const sinAngle = Math.sin(radians);

        const rotatedX = this.x * cosAngle - this.y * sinAngle;
        const rotatedY = this.x * sinAngle + this.y * cosAngle;

        this.x = rotatedX;
        this.y = rotatedY;

        return this;
    }

    negate() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    set(x = 0, y = x) {
        this.x = x;
        this.y = y;
        return this;
    }

    add(x = 0, y = x) {
        this.x += x;
        this.y += y;
        return this;
    }

    sub(x = 0, y = x) {
        this.x -= x;
        this.y -= y;
        return this;
    }

    mul(x = 0, y = x) {
        this.x *= x;
        this.y *= y;
        return this;
    }

    div(x = 0, y = x) {
        this.x /= x;
        this.y /= y;
        return this;
    }

    clone() {
        return new Point(this.x, this.y);
    }

    copy(point: Point) {
        this.x = point.x;
        this.y = point.y;
        return this;
    }

    addPoint(point: Point) {
        this.x += point.x;
        this.y += point.y;
        return this;
    }

    subPoint(point: Point) {
        this.x -= point.x;
        this.y -= point.y;
        return this;
    }

    mulPoint(point: Point) {
        this.x *= point.x;
        this.y *= point.y;
        return this;
    }

    divPoint(point: Point) {
        this.x /= point.x;
        this.y /= point.y;
        return this;
    }
}

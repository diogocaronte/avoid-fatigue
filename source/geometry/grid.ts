import Point from './point';

export default class Grid<T> {
    private map: Map<string, T>;

    constructor() {
        this.map = new Map<string, T>();
    }

    private pointToKey(point: Point) {
        return `${point.x},${point.y}`;
    }

    private keyToPoint(key: string) {
        const [x, y] = key.split(',').map(Number);
        return new Point(x, y);
    }

    set(point: Point, value: T) {
        const key = this.pointToKey(point);
        return this.map.set(key, value);
    }

    get(point: Point) {
        const key = this.pointToKey(point);
        return this.map.get(key);
    }

    has(point: Point) {
        const key = this.pointToKey(point);
        return this.map.has(key);
    }

    delete(point: Point) {
        const key = this.pointToKey(point);
        return this.map.delete(key);
    }

    clear() {
        this.map.clear();
    }

    size() {
        return this.map.size;
    }

    keys() {
        return Array.from(this.map.keys()).map(this.keyToPoint);
    }

    values() {
        return Array.from(this.map.values());
    }

    entries() {
        return Array.from(this.map.entries()).map(([key, value]) => {
            return [this.keyToPoint(key), value] as [Point, T];
        });
    }
}

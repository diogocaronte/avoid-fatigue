import merge from 'ts-deepmerge';
import Bound from '../geometry/bound';
import Point from '../geometry/point';
import Cache from '../utils/cache';
import Screen from './screen';

const DEFAULT_OPTIONS = {
    screen: new Screen(),
    position: new Point(),
    zoom: 1,
    cache: new Cache<Bound>(),
} as const;

export type CameraOptions = typeof DEFAULT_OPTIONS;

export default class Camera {
    zoom: number;

    readonly position: Point;
    readonly cache: Cache<any>;

    readonly boundaryCache = Symbol('boundary');
    readonly screen: Screen;

    constructor(options: Partial<CameraOptions> = {}) {
        const mergedOptions = merge({}, DEFAULT_OPTIONS, options) as CameraOptions;

        this.position = mergedOptions.position;
        this.zoom = mergedOptions.zoom;
        this.cache = mergedOptions.cache;

        this.screen = mergedOptions.screen;
    }

    getBoundary(): Bound {
        const cached = this.cache.get(this.boundaryCache);
        if (cached) return cached.value;

        const boundary = new Bound();
        const point = new Point();
        const size = new Point(this.screen.canvas.width, this.screen.canvas.height);

        boundary.expandTo(this.screenToWorld(point.set(0, 0)));
        boundary.expandTo(this.screenToWorld(point.set(0, size.y)));
        boundary.expandTo(this.screenToWorld(point.set(size.x, 0)));
        boundary.expandTo(this.screenToWorld(point.set(size.x, size.y)));

        this.cache.set(this.boundaryCache, boundary);
        return boundary;
    }

    screenToWorld(point: Point) {
        return point
            .clone()
            .sub(this.screen.canvas.width / 2, this.screen.canvas.height / 2)
            .div(this.zoom, this.zoom)
            .addPoint(this.position);
    }

    worldToScreen(point: Point) {
        return point
            .clone()
            .subPoint(this.position)
            .mul(this.zoom, this.zoom)
            .add(this.screen.canvas.width / 2, this.screen.canvas.height / 2);
    }

    run(callback = (screen: Screen) => {}) {
        const context = this.screen.context;

        context.save();
        context.translate(this.screen.canvas.width / 2, this.screen.canvas.height / 2);
        context.scale(this.zoom, this.zoom);
        context.translate(-this.position.x, -this.position.y);
        callback(this.screen);
        context.restore();
    }
}

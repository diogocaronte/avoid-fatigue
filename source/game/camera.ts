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
    position: Point;
    zoom: number;
    cache: Cache<any>;

    private boundaryCache = Symbol('boundary');

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    constructor(options: Partial<CameraOptions> = {}) {
        const mergedOptions = merge({}, DEFAULT_OPTIONS, options) as CameraOptions;

        this.canvas = mergedOptions.screen.canvas;
        this.context = mergedOptions.screen.context;

        this.position = mergedOptions.position;
        this.zoom = mergedOptions.zoom;
        this.cache = mergedOptions.cache;
    }

    getBoundary(): Bound {
        const cached = this.cache.get(this.boundaryCache);
        if (cached) return cached.value;

        const boundary = new Bound();
        const point = new Point();

        boundary.expandTo(this.screenToWorld(point.set(0, 0)));
        boundary.expandTo(this.screenToWorld(point.set(0, this.canvas.height)));
        boundary.expandTo(this.screenToWorld(point.set(this.canvas.width, 0)));
        boundary.expandTo(this.screenToWorld(point.set(this.canvas.width, this.canvas.height)));

        this.cache.set(this.boundaryCache, boundary);
        return boundary;
    }

    screenToWorld(point: Point) {
        return point
            .clone()
            .sub(this.canvas.width / 2, this.canvas.height / 2)
            .div(this.zoom, this.zoom)
            .addPoint(this.position);
    }

    worldToScreen(point: Point) {
        return point
            .clone()
            .subPoint(this.position)
            .mul(this.zoom, this.zoom)
            .add(this.canvas.width / 2, this.canvas.height / 2);
    }

    run(callback = (context: CanvasRenderingContext2D) => {}) {
        this.context.save();
        this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.context.scale(this.zoom, this.zoom);
        this.context.translate(-this.position.x, -this.position.y);
        callback(this.context);
        this.context.restore();
    }
}

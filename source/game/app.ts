import merge from 'ts-deepmerge';
import Point from '../geometry/point';
import Rectangle from '../geometry/rectangle';
import { ListenMouseReturn, clientPointToCanvas, listenMouse } from '../utils';
import Cache from '../utils/cache';
import Camera from './camera';
import Screen from './screen';
import Sector from './sector';
import Timer, { interval } from './timer';
import Universe from './universe';

export const DEFAULT_OPTIONS = {};
export const SECTOR_VERSION = Symbol('sector Version');

export default class App {
    events = {
        destroy: new Set<CallableFunction>(),
    };

    universe: Universe;
    camera: Camera;
    screen: Screen;
    mouseRectangle: Rectangle;
    cache: Cache<any>;

    mouseProjectedCache = Symbol('mouseProjected');
    classifiedSectorCache = Symbol('classified sector');

    private mouse: ListenMouseReturn | null = null;
    private initialized: boolean = false;
    private destroyed: boolean = false;
    private requestID: number = -1;

    private options: AppOptions;
    private timer: Timer;
    private rememberCamera: Point | null = null;

    constructor(options: Partial<AppOptions> = {}) {
        this.options = merge({}, DEFAULT_OPTIONS, options) as AppOptions;

        this.cache = new Cache();
        this.screen = new Screen();

        this.camera = new Camera({
            cache: this.cache,
            screen: this.screen,
        });

        this.universe = new Universe({
            cache: this.cache,
            camera: this.camera,
        });

        this.timer = new Timer();

        this.mouseRectangle = new Rectangle(new Point(0, 0), new Point(10, 10));
    }

    private getMouseProjected(): MouseProjected {
        const cached = this.cache.get(this.mouseProjectedCache);
        if (cached) return cached.value;

        const mouse = this.mouse as ListenMouseReturn;

        const inCanvas = clientPointToCanvas(mouse.now, this.screen.canvas);
        const inWorld = this.camera.screenToWorld(inCanvas);
        const projected = { inCanvas, inWorld };

        this.cache.set(this.mouseProjectedCache, projected);
        return projected;
    }

    private getClassifiedSectors(): ClassifiedSectors {
        const cached = this.cache.get(this.classifiedSectorCache);
        if (cached) return cached.value;

        const insideView = this.universe.getSectorsOrCreateInBoundary();
        const version = this.cache.version;
        insideView.forEach((sectorEntry) => ((<any>sectorEntry[1])[SECTOR_VERSION] = version));

        const allSectors = this.universe.sectors.entries();
        const outsideView = allSectors.filter((sectorEntry) => (<any>sectorEntry[1])[SECTOR_VERSION] != version);

        const classified = { insideView, outsideView };

        this.cache.set(this.classifiedSectorCache, classified);
        return classified;
    }

    private render() {
        this.screen.clear();

        this.camera.run((context) => {
            this.universe.getSectorsOrCreateInBoundary().forEach(([_, sector]) => {
                this.screen.renderBound(sector.bound, sector.color);
            });

            this.screen.renderRect(this.mouseRectangle, 'red');
        });
    }

    private update() {
        this.cache.invalidate();

        const canvas = this.screen.canvas;
        const { clientWidth, clientHeight } = canvas;

        if (clientWidth != canvas.width || clientHeight != canvas.height) this.screen.resize(new Point(clientWidth, clientHeight));

        const projectedMouse = this.getMouseProjected();
        this.mouseRectangle.position.copy(projectedMouse.inWorld);

        const mouse = this.mouse as ListenMouseReturn;
        if (mouse.isDown()) {
            if (this.rememberCamera == null) this.rememberCamera = this.camera.position.clone();

            const rotated = mouse.delta.clone().negate();
            this.camera.position.copy(this.rememberCamera).addPoint(rotated);
        } else {
            this.rememberCamera = null;
        }

        const classified = this.getClassifiedSectors();
        classified.outsideView.forEach((sectorEntry) => this.universe.sectors.delete(sectorEntry[0]));
    }

    public initialize() {
        if (this.initialized) return;

        this.initialized = true;

        this.mouse = listenMouse(this.screen.canvas);

        const frame_rate = 1000 / 120;
        const { execute } = interval(this.timer, this.update.bind(this), frame_rate);
        this.timer.schedule(execute, 0);

        const loop = () => {
            this.render();
            this.requestID = requestAnimationFrame(loop);
        };

        this.timer.schedule(loop, 0);

        this.timer.play();
    }

    public destroy() {
        if (!this.initialized) return;

        this.destroyed = true;

        const mouse = this.mouse as ListenMouseReturn;
        mouse.unlisten();

        cancelAnimationFrame(this.requestID);
    }
}

export type MouseProjected = {
    inCanvas: Point;
    inWorld: Point;
};

export type ClassifiedSectors = {
    insideView: [Point, Sector][];
    outsideView: [Point, Sector][];
};

export type AppOptions = typeof DEFAULT_OPTIONS;
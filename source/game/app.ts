import merge from 'ts-deepmerge';
import Point from '../geometry/point';
import { ListenMouseReturn, clientPointToCanvas, listenMouse } from '../utils';
import Cache from '../utils/cache';
import BlankScene from './blank-scene';
import Camera from './camera';
import Screen from './screen';
import Timer, { interval } from './timer';

export interface IScene {
    readonly application: App;

    initialize: () => void;
    destroy: () => void;
    update: () => void;
    render: () => void;
}

export default class App {
    readonly scene: IScene;
    readonly mouse: ListenMouseReturn;
    readonly cache: Cache<any>;
    readonly screen: Screen;
    readonly options: Readonly<AppOptions>;
    readonly timer: Timer;

    private requestID: number = -1;

    constructor(options: Partial<AppOptions> = {}) {
        this.options = merge({}, App.defaultOptions(), options) as AppOptions;
        this.timer = new Timer();
        this.scene = new BlankScene(this);
        this.cache = new Cache();
        this.screen = new Screen();
        this.mouse = listenMouse(this.screen.canvas);

        const loop = () => {
            this.render();
            this.requestID = requestAnimationFrame(loop);
        };

        this.timer.schedule(loop, 0);

        const { execute } = interval(this.timer, this.update.bind(this), this.options.frameRate);
        this.timer.schedule(execute, 0);

        this.timer.play();
    }

    static defaultOptions() {
        return {
            frameRate: 1000 / 60,
        };
    }

    changeScene(scene: IScene) {
        this.scene.destroy();
        //@ts-ignore
        this.scene = scene;
        scene.initialize();
    }

    public getMouseProjected(camera: Camera): MouseProjected {
        const cached = this.cache.get(camera);
        if (cached) return cached.value;

        const mouse = this.mouse as ListenMouseReturn;

        const inCanvas = clientPointToCanvas(mouse.now, this.screen.canvas);
        const inWorld = camera.screenToWorld(inCanvas);
        const projected = { inCanvas, inWorld };

        this.cache.set(camera, projected);
        return projected;
    }

    public render() {
        const canvas = this.screen.canvas;
        const { clientWidth, clientHeight } = canvas;

        if (clientWidth != canvas.width || clientHeight != canvas.height) this.screen.resize(new Point(clientWidth, clientHeight));

        this.scene.render();
    }

    public update() {
        this.cache.invalidate();
        this.scene.update();
    }

    public destroy() {
        this.mouse.unlisten();
        this.timer.stop();
        cancelAnimationFrame(this.requestID);
    }
}

export type MouseProjected = {
    inCanvas: Point;
    inWorld: Point;
};

export type AppOptions = ReturnType<typeof App.defaultOptions>;

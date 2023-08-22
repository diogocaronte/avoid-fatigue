import Point from '../geometry/point';
import Rectangle from '../geometry/rectangle';
import App, { IScene } from './app';
import Camera from './camera';
import Universe from './universe';

export default class DevScene implements IScene {
    readonly application: App;
    readonly camera: Camera;
    readonly universe: Universe;

    private rememberCamera: Point | null = null;
    private mouseRectangle: Rectangle;

    constructor(application: App) {
        this.application = application;
        this.camera = new Camera({
            cache: this.application.cache,
            screen: this.application.screen,
        });
        this.universe = new Universe({
            cache: this.application.cache,
        });
        this.mouseRectangle = new Rectangle(new Point(0, 0), new Point(10, 10));
    }

    initialize() {}

    destroy() {}

    update() {
        const cameraBoundary = this.camera.getBoundary();
        const mouse = this.application.mouse;

        if (mouse.isDown()) {
            if (this.rememberCamera == null) this.rememberCamera = this.camera.position.clone();

            const rotated = mouse.delta.clone().negate();
            this.camera.position.copy(this.rememberCamera).addPoint(rotated);
        } else {
            this.rememberCamera = null;
        }

        const projectedMouse = this.application.getMouseProjected(this.camera);
        this.mouseRectangle.position.copy(projectedMouse.inWorld);

        const classified = this.universe.getClassifiedSectors(cameraBoundary);
        classified.outside.forEach((sectorEntry) => this.universe.sectors.delete(sectorEntry[0]));
    }

    render() {
        this.application.screen.clear();

        const cameraBoundary = this.camera.getBoundary();
        const classified = this.universe.getClassifiedSectors(cameraBoundary);

        this.camera.run((screen) => {
            classified.inside.forEach(([_, sector]) => {
                screen.renderBound(sector.bound, sector.color);
            });

            screen.renderRect(this.mouseRectangle, 'red');
        });
    }
}

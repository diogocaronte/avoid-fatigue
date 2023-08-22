import App, { IScene } from './app';

export default class BlankScene implements IScene {
    readonly application: App;

    constructor(application: App) {
        this.application = application;
    }

    initialize() {}

    destroy() {}

    update() {}

    render() {}
}

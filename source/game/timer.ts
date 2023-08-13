import FlatQueue from 'flatqueue';
import merge from 'ts-deepmerge';

export const TIMEOUT_UPDATE_RATE = 16;

const DEFAULT_OPTIONS = {};

export type TimerOptions = typeof DEFAULT_OPTIONS;

export default class Timer {
    private playing: boolean = false;
    private lastTime: number = 0;
    private executionTime: number = 0;
    private frameTime: number = 0;
    private timeoutID: number = -1;
    private speed: number = 1;

    private options: TimerOptions;
    private queue: FlatQueue<CallableFunction> = new FlatQueue();

    constructor(options: Partial<TimerOptions> = {}) {
        this.options = merge({}, DEFAULT_OPTIONS, options) as TimerOptions;
    }

    get now() {
        return this.executionTime;
    }

    schedule(callback: CallableFunction, ms = 1000) {
        this.queue.push(callback, this.executionTime + ms);
    }

    private update(now = performance.now()) {
        const delta = now - this.lastTime;

        this.frameTime += delta * this.speed;
        this.lastTime = now;

        do {
            const priority = this.queue.peekValue() ?? 0;
            if (priority > this.frameTime) break;

            this.executionTime = priority;
            (<CallableFunction>this.queue.pop())();
        } while (true);

        if (this.playing) this.executionTime = this.frameTime;
    }

    play(speed = 1) {
        if (this.playing) return;
        if (speed < 0) speed = 0;

        this.playing = true;
        this.speed = speed;
        this.lastTime = performance.now();

        const loop = () => {
            this.update();
            this.timeoutID = setTimeout(loop, TIMEOUT_UPDATE_RATE);
        };

        this.timeoutID = setTimeout(loop, TIMEOUT_UPDATE_RATE);
    }

    stop() {
        if (!this.playing) return;

        this.playing = false;
        clearTimeout(this.timeoutID);
        this.update(this.executionTime);
    }
}

export function cancelable(callback: CallableFunction) {
    let canceled = false;
    const cancel = () => (canceled = true);

    const execute = () => {
        if (canceled) return;
        callback();
    };

    return { cancel, execute };
}

export function interval(timer: Timer, callback: CallableFunction, delay: number = 1000) {
    let canceled = false;
    const cancel = () => (canceled = true);

    const execute = () => {
        if (canceled) return;

        timer.schedule(execute, delay);
        callback();
    };

    return { cancel, execute };
}

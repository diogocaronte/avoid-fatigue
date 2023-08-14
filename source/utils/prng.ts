export default class PRNG {
    private seed: number;
    private a: number;
    private c: number;
    private m: number;

    constructor(seed: number) {
        this.seed = seed;
        this.a = 1664525;
        this.c = 1013904223;
        this.m = Math.pow(2, 32);
    }

    next(size: number = 1) {
        this.seed = (this.a * this.seed + this.c) % this.m;

        return (this.seed / this.m) * size;
    }

    nextBetween(start: number, end: number) {
        this.seed = (this.a * this.seed + this.c) % this.m;

        return start + (this.seed / this.m) * (end - start);
    }
}

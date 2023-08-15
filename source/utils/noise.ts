import Point from '../geometry/point';
import PRNG from './prng';

const PERMUTATION = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6,
    148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171,
    168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46,
    245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86,
    164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47,
    16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39,
    253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162,
    241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
    138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
];

const GRADIENT = [new Point(-1, 1), new Point(1, 1), new Point(-1, -1), new Point(1, -1)];

function fade(t: number) {
    return 6 * t * t * t * t * t - 15 * t * t * t * t + 10 * t * t * t;
}

function mix(t: number, a: number, b: number) {
    return (1.0 - t) * a + t * b;
}

export default class Noise {
    PRNG: PRNG;
    permutation: number[];

    constructor(seed: number) {
        this.PRNG = new PRNG(seed);
        this.permutation = new Array(512);

        let i = 256;
        while (i--) this.permutation[i] = this.permutation[i + 256] = PERMUTATION[this.PRNG.next(256) | 0];
    }

    noise(x: number, y: number) {
        let X = Math.floor(x);
        let Y = Math.floor(y);

        x -= X;
        y -= Y;

        X &= 0b11111111;
        Y &= 0b11111111;

        let u = fade(x);
        let v = fade(y);

        let grad = GRADIENT;
        let perm = this.permutation;

        let grad00 = grad[perm[X + perm[Y]] & 0b11];
        let grad01 = grad[perm[X + perm[Y + 1]] & 0b11];
        let grad10 = grad[perm[X + 1 + perm[Y]] & 0b11];
        let grad11 = grad[perm[X + 1 + perm[Y + 1]] & 0b11];

        const point = new Point();
        let n00 = grad00.dot(point.set(x, y));
        let n01 = grad01.dot(point.set(x, y - 1));
        let n10 = grad10.dot(point.set(x - 1, y));
        let n11 = grad11.dot(point.set(x - 1, y - 1));

        return mix(v, mix(u, n00, n10), mix(u, n01, n11));
    }
}

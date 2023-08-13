export function random(size: number) {
    return Math.random() * size;
}

export function randomInt(size: number) {
    return Math.floor(Math.random() * size);
}

export function randomBetween(start: number, end: number) {
    return start + random(end - start);
}

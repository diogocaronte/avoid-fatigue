export default class Range {
    start: number;
    end: number;

    constructor(start = Infinity, end = -Infinity) {
        this.start = start;
        this.end = end;
    }

    getSize() {
        return this.end - this.start;
    }

    clone() {
        return new Range(this.start, this.end);
    }

    isEmpty() {
        return this.start > this.end;
    }

    expandTo(value = 0) {
        this.start = Math.min(this.start, value);
        this.end = Math.max(this.start, value);

        return this;
    }

    expandBy(value = 0) {
        this.start -= value;
        this.end += value;

        return this;
    }

    collapseBy(value = 0) {
        this.start += value;
        this.end -= value;

        return this;
    }

    each(callback = (value = 0) => {}) {
        if (this.isEmpty()) return;
        for (let i = this.start | 0; i <= this.end; i++) callback(i);
    }
}

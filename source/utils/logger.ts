import merge from 'ts-deepmerge';

const DEFAULT_OPTIONS = {
    maxLines: 20,
    formatter: ($container: HTMLLIElement, text: string) => ($container.innerText = text),
};

export type HTMLLoggerOptions = typeof DEFAULT_OPTIONS;

export default class HTMLLogger {
    $container: HTMLUListElement;

    private options: HTMLLoggerOptions;

    lines: [string, HTMLLIElement | null][];

    constructor(options: Partial<HTMLLoggerOptions>) {
        this.options = merge({}, DEFAULT_OPTIONS, options) as HTMLLoggerOptions;

        this.options.maxLines = Math.max(this.options.maxLines, 1);

        this.$container = document.createElement('ul');

        this.lines = [];
    }

    log(text: string, update = true) {
        this.lines.push([text, null]);

        if (!update) return;
        this.render();
    }

    private renderLine(line: [string, any]) {
        const $container = document.createElement('li');
        this.options.formatter($container, line[0]);
        line[1] = $container;
        return $container;
    }

    render() {
        const lastIndex = this.lines.length - 1;
        const last = this.lines[lastIndex];
        if (last[1]) return;

        const initialIndex = Math.max(0, lastIndex - (this.options.maxLines - 1));

        for (let i = 0; i < initialIndex; i++) {
            if (!this.lines[i][1]) continue;

            //@ts-ignore
            this.lines[i][1].remove();
        }

        const remain = this.lines.slice(initialIndex);
        const toRender = remain.filter((line) => !line[1]);
        this.lines = remain;

        this.$container.append(...toRender.map((line) => this.renderLine(line)));
    }
}

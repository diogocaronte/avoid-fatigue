import Point from '../geometry/point';

export function clientPointToCanvas(point: Point, canvas: HTMLCanvasElement, dist = new Point()) {
    const canvasRect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / canvasRect.width;
    const scaleY = canvas.height / canvasRect.height;

    dist.x = (point.x - canvasRect.left) * scaleX;
    dist.y = (point.y - canvasRect.top) * scaleY;

    return dist;
}

export interface ListenMouseReturn {
    isDown: () => boolean;
    start: Readonly<Point>;
    now: Readonly<Point>;
    end: Readonly<Point>;
    delta: Readonly<Point>;
    unlisten: () => void;
}

export function listenMouse(element: HTMLElement): ListenMouseReturn {
    let state = false;
    let start = new Point();
    let now = new Point();
    let end = new Point();
    let delta = new Point();

    function isDown() {
        return state;
    }

    function down(e: MouseEvent) {
        start.set(e.clientX, e.clientY);
        now.set(e.clientX, e.clientY);
        end.set(e.clientX, e.clientY);

        delta.set(0, 0);
        state = true;
    }

    function move(e: MouseEvent) {
        now.set(e.clientX, e.clientY);
        delta.copy(now).subPoint(start);
    }

    function up(e: MouseEvent) {
        end.set(e.clientX, e.clientY);
        delta.copy(end).subPoint(start);
        state = false;
    }

    element.addEventListener('mousedown', down);
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);

    function unlisten() {
        element.removeEventListener('mousedown', down);
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
    }

    return {
        isDown,
        start: start as Readonly<Point>,
        now: now as Readonly<Point>,
        end: end as Readonly<Point>,
        delta: delta as Readonly<Point>,
        unlisten,
    };
}

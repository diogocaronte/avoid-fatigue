export function listenKeyboard(element = document.body) {
    const down = new Map<string, boolean>();
    const down_callbacks = new Map<string, Set<CallableFunction>>();
    const up_callbacks = new Map<string, Set<CallableFunction>>();

    function keydown(e: KeyboardEvent) {
        const { key } = e;
        if (!down.get(key)) return;

        down.set(key, true);

        const set = down_callbacks.get(key);
        if (!set) return;

        for (const callback of set.values()) callback();
    }

    function keyup(e: KeyboardEvent) {
        const { key } = e;
        if (down.get(key)) return;

        down.set(key, false);

        const set = up_callbacks.get(key);
        if (!set) return;

        for (const callback of set.values()) callback();
    }

    element.addEventListener('keydown', keydown);
    element.addEventListener('keyup', keyup);

    function unlisten() {
        element.removeEventListener('keydown', keydown);
        element.removeEventListener('keyup', keyup);
    }

    function onDown(key: string, callback: () => void) {
        let set = down_callbacks.get(key);
        if (!set) {
            set = new Set();
            down_callbacks.set(key, set);
        }

        set.add(callback);

        return set.delete.bind(set, callback);
    }

    function onUp(key: string, callback: () => void) {
        let set = up_callbacks.get(key);
        if (!set) {
            set = new Set();
            up_callbacks.set(key, set);
        }

        set.add(callback);

        return set.delete.bind(set, callback);
    }

    function isDown(key: string) {
        return Boolean(down.get(key));
    }

    return { unlisten, onDown, onUp, isDown };
}
export type CacheNode<T> = {
    version: number;
    value: T;
};

export default class Cache<T> {
    readonly version: number;
    private map: WeakMap<any, CacheNode<T>>;

    constructor(version = 0) {
        this.map = new WeakMap();
        this.version = version;
    }

    get(key: any) {
        const data = this.map.get(key);

        if (!data || data.version != this.version) return undefined;

        return data;
    }

    set(key: any, value: T) {
        const data = {
            version: this.version,
            value: value,
        };

        this.map.set(key, data);
    }

    invalidate() {
        (<any>this).version++;
    }
}

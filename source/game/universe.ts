import merge from 'ts-deepmerge';
import Bound from '../geometry/bound';
import Grid from '../geometry/grid';
import Point from '../geometry/point';
import Cache from '../utils/cache';
import Sector from './sector';

export default class Universe {
    readonly sectors: Grid<Sector>;
    readonly cache: Cache<any>;

    private SECTOR_VERSION = Symbol('sector Version');
    private options: UniverseOptions;

    constructor(options: Partial<UniverseOptions> = {}) {
        this.options = merge({}, Universe.defaultOptions(), options) as UniverseOptions;
        this.cache = this.options.cache;
        this.sectors = new Grid<Sector>();
    }

    static defaultOptions() {
        return {
            sectorSize: 100,
            cache: new Cache<any>(),
        };
    }

    public getClassifiedSectors(bound: Bound): ClassifiedSectors {
        const cached = this.cache.get(bound);
        if (cached) return cached.value;

        const projectedInSector = this.getWorldToSectorBound(bound);
        const inside = this.getSectorsOrCreateInBoundary(projectedInSector);

        const version = this.cache.version;
        inside.forEach((sectorEntry) => ((<any>sectorEntry[1])[this.SECTOR_VERSION] = version));

        const allSectors = this.sectors.entries();
        const outside = allSectors.filter((sectorEntry) => (<any>sectorEntry[1])[this.SECTOR_VERSION] != version);

        const classified = { inside, outside };

        this.cache.set(bound, classified);
        return classified;
    }

    public getSectorsOrCreateInBoundary(boundary: Bound): [Point, Sector][] {
        const cached = this.options.cache.get(boundary);
        if (cached) return cached.value;

        const list: [Point, Sector][] = [];

        boundary.forEach((x, y) => {
            const sectorPos = new Point(x, y);
            const sector = this.getSectorOrCreate(sectorPos);
            list.push([sectorPos, sector]);
        });

        this.options.cache.set(boundary, list);
        return list;
    }

    public getWorldToSectorBound(boundary: Bound): Bound {
        const cached = this.options.cache.get(boundary);
        if (cached) return cached.value;

        const sectorBoundary = boundary.clone();
        sectorBoundary.points.forEach((point) => point.div(this.options.sectorSize));

        this.options.cache.set(boundary, sectorBoundary);
        return sectorBoundary;
    }

    public getSectorOrCreate(point: Point) {
        let sector = this.sectors.get(point);
        if (sector) return sector;

        const sector_min = point.clone().mul(this.options.sectorSize);
        const sector_max = sector_min.clone().add(this.options.sectorSize);
        const sector_bound = new Bound(sector_min, sector_max);

        sector = new Sector(sector_bound, (point.x + point.y) % 2 == 0 ? 'blue' : 'red');
        this.sectors.set(point, sector);

        return sector;
    }
}

export type UniverseOptions = ReturnType<typeof Universe.defaultOptions>;

export type ClassifiedSectors = {
    inside: [Point, Sector][];
    outside: [Point, Sector][];
};

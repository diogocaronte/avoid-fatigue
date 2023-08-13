import merge from 'ts-deepmerge';
import Bound from '../geometry/bound';
import Grid from '../geometry/grid';
import Point from '../geometry/point';
import Cache from '../utils/cache';
import Camera from './camera';
import Sector from './sector';

const DEFAULT_OPTIONS = {
    sectorSize: 100,
    cache: new Cache<any>(),
    camera: new Camera(),
} as const;

export type UniverseOptions = typeof DEFAULT_OPTIONS;

export default class Universe {
    readonly sectors: Grid<Sector>;

    private options: UniverseOptions;
    private boundaryCache = Symbol('boundary');

    constructor(options: Partial<UniverseOptions> = {}) {
        this.options = merge({}, DEFAULT_OPTIONS, options) as UniverseOptions;
        this.sectors = new Grid<Sector>();
    }

    public getSectorsOrCreateInBoundary(boundary = this.getViewSectorBound()): [Point, Sector][] {
        const cached = this.options.cache.get(boundary);
        if (cached) return cached.value;

        const list: [Point, Sector][] = [];

        this.getViewSectorBound().forEach((x, y) => {
            const sectorPos = new Point(x, y);
            const sector = this.getSectorOrCreate(sectorPos);
            list.push([sectorPos, sector]);
        });

        this.options.cache.set(boundary, list);
        return list;
    }

    public getViewSectorBound(): Bound {
        const cached = this.options.cache.get(this.boundaryCache);
        if (cached) return cached.value;

        const cameraBoundary = this.options.camera.getBoundary();
        const sectorBoundary = cameraBoundary.clone();
        sectorBoundary.points.forEach((point) => point.div(this.options.sectorSize));

        this.options.cache.set(this.boundaryCache, sectorBoundary);
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

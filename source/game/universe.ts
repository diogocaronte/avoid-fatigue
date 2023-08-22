import merge from 'ts-deepmerge';
import Bound from '../geometry/bound';
import Grid from '../geometry/grid';
import Point from '../geometry/point';
import Cache from '../utils/cache';
import Noise from '../utils/noise';
import Sector from './sector';
import UniverseDevStrategy, { UniverseGenerationStrategy } from './universe-dev-strategy';

export default class Universe {
    readonly sectors: Grid<Sector>;
    readonly cache: Cache<any>;
    readonly options: Readonly<UniverseOptions>;
    readonly random: Noise;

    private SECTOR_VERSION = Symbol('sector Version');
    private strategy: UniverseGenerationStrategy;

    constructor(options: Partial<UniverseOptions> = {}) {
        this.options = merge({}, Universe.defaultOptions(), options) as UniverseOptions;
        this.cache = this.options.cache;
        this.sectors = new Grid<Sector>();
        this.strategy = this.options.strategy;
        this.random = new Noise(this.options.seed);
    }

    static defaultOptions() {
        return {
            sectorSize: 100,
            cache: new Cache<any>(),
            seed: Math.random() * Math.pow(2, 32),
            strategy: new UniverseDevStrategy() as UniverseGenerationStrategy,
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

        sector = this.strategy.createSector(this, point);
        this.sectors.set(point, sector);

        return sector;
    }
}

export type UniverseOptions = ReturnType<typeof Universe.defaultOptions>;

export type ClassifiedSectors = {
    inside: [Point, Sector][];
    outside: [Point, Sector][];
};

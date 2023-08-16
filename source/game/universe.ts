import merge from 'ts-deepmerge';
import Bound from '../geometry/bound';
import Grid from '../geometry/grid';
import Point from '../geometry/point';
import Cache from '../utils/cache';
import Noise from '../utils/noise';
import Sector from './sector';
import UniverseDevStrategy, { UniverseGenerationStrategy } from './universe-dev-strategy';

const DEFAULT_OPTIONS = {
    sectorSize: 100,
    cache: new Cache<any>(),
    seed: 1,
    strategy: new UniverseDevStrategy() as UniverseGenerationStrategy,
} as const;

export type UniverseOptions = typeof DEFAULT_OPTIONS;

export default class Universe {
    readonly sectors: Grid<Sector>;
    readonly options: Readonly<UniverseOptions>;
    readonly random: Noise;

    private strategy: UniverseGenerationStrategy;

    constructor(options: Partial<UniverseOptions> = {}) {
        this.options = merge({}, DEFAULT_OPTIONS, options) as UniverseOptions;
        this.sectors = new Grid<Sector>();
        this.strategy = this.options.strategy;
        this.random = new Noise(this.options.seed);
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

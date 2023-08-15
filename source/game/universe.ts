import merge from 'ts-deepmerge';
import Bound from '../geometry/bound';
import Grid from '../geometry/grid';
import Point from '../geometry/point';
import Cache from '../utils/cache';
import Noise from '../utils/noise';
import Camera from './camera';
import Sector from './sector';
import UniverseDevStrategy, { UniverseGenerationStrategy } from './universe-dev-strategy';

const DEFAULT_OPTIONS = {
    sectorSize: 100,
    cache: new Cache<any>(),
    camera: new Camera(),
    seed: 1,
    strategy: new UniverseDevStrategy() as UniverseGenerationStrategy,
} as const;

export type UniverseOptions = typeof DEFAULT_OPTIONS;

export default class Universe {
    readonly sectors: Grid<Sector>;
    readonly options: Readonly<UniverseOptions>;
    readonly random: Noise;

    private boundaryCache = Symbol('boundary');
    private strategy: UniverseGenerationStrategy;

    constructor(options: Partial<UniverseOptions> = {}) {
        this.options = merge({}, DEFAULT_OPTIONS, options) as UniverseOptions;
        this.sectors = new Grid<Sector>();
        this.strategy = this.options.strategy;
        this.random = new Noise(this.options.seed);
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

        sector = this.strategy.createSector(this, point);
        this.sectors.set(point, sector);

        return sector;
    }
}

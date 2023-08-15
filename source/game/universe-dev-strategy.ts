import Bound from '../geometry/bound';
import Point from '../geometry/point';
import PRNG from '../utils/prng';
import Asteroid from './asteroid';
import Planet from './planet';
import Sector from './sector';
import Universe from './universe';

export interface UniverseGenerationStrategy {
    createSector(universe: Universe, point: Point): Sector;
}

export default class UniverseDevStrategy implements UniverseGenerationStrategy {
    constructor() {}

    private randomPos(random: PRNG, bound: Bound, padding = 10) {
        const safeXRange = bound.toXRange().collapseBy(padding);
        const safeYRange = bound.toYRange().collapseBy(padding);

        return new Point(random.nextBetween(safeXRange.start, safeXRange.end), random.nextBetween(safeYRange.start, safeYRange.end));
    }

    private generateAsteroids(random: PRNG, sector: Sector) {
        const amount = random.nextBetween(3, 10);
        for (let i = 0; i < amount; i++) {
            const asteroid = new Asteroid(this.randomPos(random, sector.bound), random.nextBetween(0, 5));
            sector.asteroids.push(asteroid);
        }
    }

    private generatePlanet(random: PRNG, sector: Sector) {
        const size = random.nextBetween(10, 30);

        const safeBound = sector.bound.clone();
        safeBound.collapseBy(new Point(size));

        const planet = new Planet(this.randomPos(random, safeBound), size);

        sector.planets.push(planet);
    }

    createSector(universe: Universe, point: Point) {
        const min = point.clone().mul(universe.options.sectorSize);
        const max = min.clone().add(universe.options.sectorSize);
        const bound = new Bound(min, max);

        const seed = 1 + universe.random.noise(point.x * 0.27537, point.y * 0.83732);
        const random = new PRNG(seed * Math.pow(2, 32));

        const sector = new Sector(bound);

        random.next();

        if (random.next() < 0.2) {
            this.generatePlanet(random, sector);
        }

        if (random.next() < 0.8) {
            this.generateAsteroids(random, sector);
        }

        return sector;
    }
}

import Bound from '../geometry/bound';
import Asteroid from './asteroid';
import Planet from './planet';

export default class Sector {
    bound: Bound;
    planets: Planet[];
    asteroids: Asteroid[];

    constructor(bound = new Bound(), color = 'red') {
        this.bound = bound;
        this.planets = [];
        this.asteroids = [];
    }
}

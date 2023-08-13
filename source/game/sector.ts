import Bound from '../geometry/bound';
import Planet from './planet';

export default class Sector {
    bound: Bound;
    color: string;
    planets: Planet[];

    constructor(bound = new Bound(), color = 'red') {
        this.bound = bound;
        this.color = color;
        this.planets = [];
    }
}

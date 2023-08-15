import Planet from '../../source/game/planet';
import Screen from '../../source/game/screen';
import Sector from '../../source/game/sector';
import Timer, { interval } from '../../source/game/timer';
import Circle from '../../source/geometry/circle';
import Point from '../../source/geometry/point';
import { randomBetween } from '../../source/utils/number';
import './index.css';

const UPDATE_RATE = 1000 / 60;

const screen = new Screen();
const timer = new Timer();
const { sector, safeBound } = createSector();

const $app = document.getElementById('app') as HTMLDivElement;
$app.appendChild(screen.canvas);

const { execute } = interval(timer, loop, UPDATE_RATE);

timer.schedule(execute, 0);
timer.play();

function loop() {
    screen.clear();
    screen.resizeToCanvasClientSize();

    screen.renderBound(sector.bound, 'red');
    screen.renderBound(safeBound, 'green');
    sector.planets.forEach((planet) => screen.renderCircle(planet as Circle, 'blue'));
}

function createSector() {
    const sector = new Sector();
    const sectorSize = 300;
    const sectorPadding = 30;

    const planetSize = 30;
    const planetSize2 = planetSize / 2;
    const planetAmount = 10;

    sector.bound.expandTo(new Point(0, 0));
    sector.bound.expandTo(new Point(sectorSize, sectorSize));

    const safeBound = sector.bound.clone();
    safeBound.collapseBy(new Point(sectorPadding));

    for (let i = 0; i < planetAmount; i++) {
        const safeXRange = safeBound.toXRange().collapseBy(planetSize2);
        const safeYRange = safeBound.toYRange().collapseBy(planetSize2);

        const planetPosition = new Point(randomBetween(safeXRange.start, safeXRange.end), randomBetween(safeYRange.start, safeYRange.end));
        const planet = new Planet(planetPosition, planetSize2);

        sector.planets.push(planet);
    }

    return { sector, safeBound };
}
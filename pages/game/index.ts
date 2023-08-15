import App from '../../source/game/app';
import { interval } from '../../source/game/timer';
import HTMLLogger from '../../source/utils/logger';
import './index.css';

const app = new App();
const logger = new HTMLLogger({ maxLines: 1 });

const $app = document.getElementById('app') as HTMLDivElement;
$app.appendChild(app.screen.canvas);

app.events.update.add(() => {
    logger.log(JSON.stringify(app.getMouseProjected()), false);
});

const logInterval = interval(app.timer, () => logger.render(), 1000);

app.timer.schedule(logInterval.execute);
app.initialize();

(<any>window).app = app;
(<any>window).logger = logger;

$app.append((<any>window).logger.$container);

import App from '../../source/game/app';
import './index.css';

const app = new App();

const $app = document.getElementById('app') as HTMLDivElement;
$app.appendChild(app.screen.canvas);

app.initialize();

(<any>window).app = app;

import App from '../../source/game/app';
import DevScene from '../../source/game/dev-scene';
import './index.css';

const app = new App();

const $app = document.getElementById('app') as HTMLDivElement;
$app.appendChild(app.screen.canvas);

app.changeScene(new DevScene(app));

(<any>window).app = app;

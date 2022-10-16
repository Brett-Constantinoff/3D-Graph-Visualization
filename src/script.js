// Import our custom CSS
import './scss/styles.scss'
import $ from 'jQuery'
// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

import App from "./App";
/*
Main Animation Loop
*/
const app = new App();
app.onStart();

let time = (new Date() * 0.001);
function animate()
{
    const currentTime = (new Date()) * 0.001;
    const deltaTime = currentTime - time;
    time = currentTime;

    app.onUpdate(deltaTime);
    app.onRender();
    requestAnimationFrame(animate);
}
animate();

import App from "./App";

/*
Main Render Loop
*/
const app = new App();
app.onStart();
function render()
{
    app.onUpdate();
    app.onRender();
    requestAnimationFrame(render);
}
render();
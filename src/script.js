import App from "./App";

/*
Main Animation Loop
*/
const app = new App();
app.onStart();
const clock = new THREE.Clock();
function animate()

{
    app.onUpdate();
    app.onRender();
    requestAnimationFrame(animate);
}
animate();

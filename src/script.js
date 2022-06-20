/*
A basic Three.js app reuires 4 main things:
    * Scene - holds all objects, lights, camera etc
    * Objects - geometry
    * Camera - how we see the scene
    * Renderer - how everything is rendered
*/
import './style.css'
import * as THREE from 'three';
import { OrbitContols, OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import Stats from 'stats.js';

//setup stats
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const scene = new THREE.Scene();

//create our red cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const materialProps = {
    color: 'red',
    wireframe: false
};
const material = new THREE.MeshPhongMaterial(materialProps);
const mesh = new THREE.Mesh(geometry, material);
mesh.translateX(-1.5);
scene.add(mesh);

//add a point light with a white color
const light = new THREE.PointLight( 0x404040, 5, 100);
light.position.set(0, 10, 10);
scene.add(light);

//setup our camera and move it back a bit
const sizes = {
    width: 800,
    height: 600
};
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height);
scene.add(camera);

//get our canvas for the renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer(
    {
        canvas: canvas,
        antialias: true
    }
);
renderer.setSize(sizes.width, sizes.height);
renderer.setClearColor('grey');

//setup debgug GUI
const gui = new dat.GUI();
const cubeFolder = gui.addFolder("Cube(s)");

cubeFolder.add(materialProps, 'wireframe') 
    .onChange((value) => material.wireframe = value);

const colors = {
    cubeColor : material.color
};
cubeFolder.addColor(colors, 'cubeColor')
    .onChange((value) => 
        {
            material.color.r = value.r / 255;
            material.color.g = value.g / 255;
            material.color.b = value.g / 255;
        }
    );

const sizeFolder = cubeFolder.addFolder("Size");

const size = {
    x: mesh.scale.x,
    y: mesh.scale.y, 
    z: mesh.scale.z
};
sizeFolder.add(size, 'x', 1.0, 15.0)
    .onChange((value) => mesh.scale.x = value);

sizeFolder.add(size, 'y', 1.0, 15.0)
    .onChange((value) => mesh.scale.y = value);

sizeFolder.add(size, 'z', 1.0, 15.0)
    .onChange((value) => mesh.scale.z = value);

//clone makes an exact copy and saves all the changes
const mesh2 = mesh.clone();
mesh2.translateX(3.0);

const addSecondCube = {
    add: false
};
gui.add(addSecondCube, 'add').name("Add Cube")
    .onChange((value) => 
        {
            if(value)
            {
                scene.add(mesh2);
            }
            else
            {
                scene.remove(mesh2);
            }
        }
    );

const controls = new OrbitControls(camera, renderer.domElement);
camera.translateZ(5.0);
controls.update();

/*
Main Render Loop
*/
const clock = new THREE.Clock();
function render()
{
    stats.begin();

    const dt = clock.getDelta();

    /*
    mesh.rotation.y += dt * 0.5;
    mesh.rotation.x += dt * -0.5;
    mesh.rotation.z += dt * 0.5;

    if(addSecondCube.add)
    {
        mesh.rotation.y += dt * 0.5;
        mesh2.rotation.x += dt * -0.5;
        mesh2.rotation.z += dt * 0.5;
    }
    */

    renderer.render(scene, camera);

    stats.end();
    requestAnimationFrame(render);
}

render();
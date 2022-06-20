/*
A basic Three.js app reuires 4 main things:
    * Scene - holds all objects, lights, camera etc
    * Objects - geometry
    * Camera - how we see the scene
    * Renderer - how everything is rendered
*/
import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import Stats from 'stats.js';

class App
{
    constructor()
    {

    }

    onStart()
    {
        //setup stats
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);

        this.scene = new THREE.Scene();

        //create our red cube
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const materialProps = {
            color: 'red',
            wireframe: false
        };
        const material = new THREE.MeshPhongMaterial(materialProps);
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.translateX(-1.5);
        this.scene.add(this.mesh);

        //add a point light with a white color
        const light = new THREE.PointLight( 0x404040, 5, 100);
        light.position.set(0, 10, 10);
        this.scene.add(light);

        //setup our camera and move it back a bit
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.scene.add(this.camera);

        //get our canvas for the renderer
        const canvas = document.querySelector('.webgl');

        this.renderer = new THREE.WebGLRenderer(
            {
                canvas: canvas,
                antialias: true
            }
        );
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor('grey');

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
            x: this.mesh.scale.x,
            y: this.mesh.scale.y, 
            z: this.mesh.scale.z
        };
        sizeFolder.add(size, 'x', 1.0, 15.0)
            .onChange((value) => this.mesh.scale.x = value);

        sizeFolder.add(size, 'y', 1.0, 15.0)
            .onChange((value) => this.mesh.scale.y = value);

        sizeFolder.add(size, 'z', 1.0, 15.0)
            .onChange((value) => this.mesh.scale.z = value);

        //clone makes an exact copy and saves all the changes
        const mesh2 = this.mesh.clone();
        mesh2.translateX(3.0);

        const addSecondCube = {
            add: false
        };
        gui.add(addSecondCube, 'add').name("Add Cube")
            .onChange((value) => 
                {
                    if(value)
                    {
                        this.scene.add(mesh2);
                    }
                    else
                    {
                        this.scene.remove(mesh2);
                    }
                }
            );

        //setup camera controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.camera.translateZ(5.0);
        this.controls.update();

        //set a background image
        const image = document.getElementById('back.jpg');
        const texture = new THREE.TextureLoader().load(
            image.src
        );

        this.scene.background = texture;
    }

    onUpdate(dt)
    {
        this.stats.begin();
    }

    onRender()
    {

        this.stats.end();
        this.renderer.render(this.scene, this.camera);
    }
}

/*
Main Render Loop
*/
const app = new App();
app.onStart();

const clock = new THREE.Clock();
function render()
{
    const dt = clock.getDelta();
    app.onUpdate(dt);


    app.onRender();
    requestAnimationFrame(render);
}

render();
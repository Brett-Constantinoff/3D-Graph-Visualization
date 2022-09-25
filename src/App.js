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
import Maze from './Objects/Maze';

export default class App
{
    constructor()
    {
        this.stats = new Stats();

        this.gui = new dat.GUI(
            {
                name: "Controls",
                width: 500
            }
        );

        this.canvas = document.querySelector('.webgl');
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        this.renderer = new THREE.WebGLRenderer(
            {
                canvas: this.canvas,
                antialias: true
            }
        );

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.controls = new OrbitControls(this.camera, this.canvas);

        this.scene = new THREE.Scene();
    }

    onStart()
    {
        this.setupListeners();
        this.setupScene();
        this.setupGui();

        // initially update camera controlls
        this.controls.update()
    }

    onUpdate(dt)
    {   
        //needs to come at the beginning of onUpdate
        this.stats.begin();
        // update controlls every frame
        this.controls.update();
    }

    onRender()
    {
        // render scene
        this.renderer.render(this.scene, this.camera);

        //needs to come at the end of onRender
        this.stats.end();
    }

    setupListeners()
    {
        // add window resize event
        window.addEventListener('resize', () => 
        {
            this.sizes.width = window.innerWidth;
            this.sizes.height = window.innerHeight;

            this.camera.updateProjectionMatrix();

            this.renderer.setSize(this.sizes.width, this.sizes.height);
            this.renderer.setPixelRatio(window.devicePixelRatio);
        });
    }

    setupScene()
    {
        // setup stats
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
        
        // initial camera position
        this.camera.position.set(19.64, 11.55, 18.97);
        this.scene.add(this.camera);

        // disable camera panning and enable damping
        this.controls.enablePan = false;
        this.controls.enableDamping = true;

        // initial render settings
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setClearColor(0x525393);

        // add a couple scene lights
        let firstLight = new THREE.DirectionalLight({
            color: 0xffffff,
            intensity: 1
        });
        firstLight.position.set(-1, 2, 4);
        this.scene.add(firstLight);
        let secondLight = new THREE.DirectionalLight({
            color: 0xffffff,
            intensity: 1
        });
        secondLight.position.set(1, -1, -2);
        this.scene.add(secondLight)

        //create maze
        this.initialSize = 11;
        this.maxSize = 25;
        this.maze = new Maze(0xFFFFFF, this.initialSize);
        this.scene.add(this.maze.getMesh())

        // add nodes to scene
        this.scene.add(this.maze.getNodes())
    }

    setupGui()
    {
        // create maze folder
        let mazeFolder = this.gui.addFolder("Maze");

        // create folder for maze size
        let mazeSizeFolder = mazeFolder.addFolder("Size");
        // create maze size controller
        let mazeSize = {
            x: this.initialSize,
            y: this.initialSize,
            z: this.initialSize
        };
        // x slider
        mazeSizeFolder.add(mazeSize, 'x', this.initialSize, this.maxSize, 1).onChange((value) => {
            // map a value in the range 10 - 50 to 1 - 2
            let scale = 1 + ((2 - 1) / (this.maxSize - this.initialSize)) * (value - this.initialSize);
            this.maze.scale(scale, 'x');
        });
        // y slider
        mazeSizeFolder.add(mazeSize, 'y', this.initialSize, this.maxSize, 1).onChange((value) => {
            // map a value in the range 10 - 50 to 1 - 2
            let scale = 1 + ((2 - 1) / (this.maxSize - this.initialSize)) * (value - this.initialSize);
            this.maze.scale(scale, 'y');
        });
        // z slider
        mazeSizeFolder.add(mazeSize, 'z', this.initialSize, this.maxSize, 1).onChange((value) => {
            // map a value in the range 10 - 50 to 1 - 2
            let scale = 1 + ((2 - 1) / (this.maxSize - this.initialSize)) * (value - this.initialSize);
            this.maze.scale(scale, 'z');
        });

        // create maze generation checkbox
        let generateMaze = {
            Generate: false
        }
        mazeFolder.add(generateMaze, 'Generate').onChange((value) => {
            if(value)
            {
                this.maze.generate();
            }
            else
            {
                this.maze.clear();
            }
        });
    }
}
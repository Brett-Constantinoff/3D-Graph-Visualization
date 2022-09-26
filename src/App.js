import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import Stats from 'stats.js';
import Maze from './Objects/Maze';

export default class App
{
    /**
     * Creates main application objects
     */
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
                antialias: true,
            }
        );

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.controls = new OrbitControls(this.camera, this.canvas);

        this.scene = new THREE.Scene();
    }

    /**
     * Runs once on startup, sets up initial scene
     */
    onStart()
    {
        this.setupListeners();
        this.setupScene();
        this.setupGui();

        // initially update camera controlls
        this.controls.update()
    }

    /**
     * Runs once every frame to updat scene
     *
     * @param {float} dt tick speed
     */
    onUpdate(dt)
    {   
        //needs to come at the beginning of onUpdate
        this.stats.begin();

        // update controlls every frame
        this.controls.update();
    }

    /**
     * Renders the scene after updating
     */
    onRender()
    {
        // render scene
        this.renderer.render(this.scene, this.camera);

        //needs to come at the end of onRender
        this.stats.end();
    }

    /**
     * Sets up any listeners for the scene
     */
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

    /**
     * Sets up scene settings and adds initial objects
     * to scene
     */
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

        // create maze with a border
        this.initialSize = 5;
        this.maze = new Maze(0xFFFFFF, true, this.initialSize, 0.0, new THREE.Vector3(0, 0, 0));

        // only add maze wireframe
        this.scene.add(this.maze.getWireFrame());
        // add all maze nodes
        this.scene.add(this.maze.getNodes());

        // debug
        this.scene.add(new THREE.AxesHelper(10));
    }

    /**
     * Creates the scene GUI, also determines what happens 
     * when GUI is interacted with
     */
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
        this.maxSize = 10;
        // x slider
        mazeSizeFolder.add(mazeSize, 'x', this.initialSize, this.maxSize, 1).onChange((value) => {
           this.maze.scale(value, 'x');
        });
        // y slider
        mazeSizeFolder.add(mazeSize, 'y', this.initialSize, this.maxSize, 1).onChange((value) => {
            this.maze.scale(value, 'y');
        });
        // z slider
        mazeSizeFolder.add(mazeSize, 'z', this.initialSize, this.maxSize, 1).onChange((value) => {
            this.maze.scale(value, 'z');
        });

        // create maze generation checkbox
        let generateMaze = {
            Generate: false
        }
        mazeFolder.add(generateMaze, 'Generate').onChange((value) => {
           if (value)
           {
                this.maze.generate()
           }
           else
           {
                this.maze.clear();
           }
        });
    }
}
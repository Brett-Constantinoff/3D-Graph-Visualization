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
        // add some listensers for window resize
        window.addEventListener('resize', () => 
        {
            this.sizes.width = window.innerWidth;
            this.sizes.height = window.innerHeight;

            this.camera.updateProjectionMatrix();

            this.renderer.setSize(this.sizes.width, this.sizes.height);
            this.renderer.setPixelRatio(window.devicePixelRatio);
        });

        // setup scene
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
        
        // initial camera position
        this.camera.position.z = 18.97;
        this.camera.position.y = 11.55;
        this.camera.position.x = 19.64;
        this.scene.add(this.camera);

        // disable camera panning
        this.controls.enablePan = false;

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setClearColor(0x525393);
        
        // gui and cube frame
        let frameFolder = this.gui.addFolder("Maze");
        let initialSize = 10;
        let maxSize = 50;
        this.Maze = new Maze(0xFFFFFF, initialSize);
        this.scene.add(this.Maze.getMesh())
        let frameSize = {
            size: initialSize
        };
        // controller for maze size
        frameFolder.add(frameSize, 'size', initialSize, maxSize).onChange((value) => {
            // map a value in the range 10 - 50 to 1 - 2
            let scale = 1 + ((2 - 1) / (maxSize - initialSize)) * (value - initialSize);
            this.Maze.scale(scale);
        });
        // button for generating maze
        let generateMaze = {
            generate:function()
            {
                // TODO: Geneate maze using DFS
                console.log("Generating maze");
            }
        };
        frameFolder.add(generateMaze, 'generate');
        this.controls.update()
    }

    onUpdate(dt)
    {   
        //needs to come at the beginning of onUpdate
        this.stats.begin();
    }

    onRender()
    {
        this.renderer.render(this.scene, this.camera);

        //needs to come at the end of onRender
        this.stats.end();
    }
}
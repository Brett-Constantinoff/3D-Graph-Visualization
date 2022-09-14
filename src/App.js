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
import Vertex from './Graph/Vertex';
import Edge from './Graph/Edge';


export default class App
{
    constructor()
    {
        this.stats = new Stats();

        this.gui = new dat.GUI();

        this.canvas = document.querySelector('.webgl');
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.controls = new OrbitControls(this.camera, this.canvas);

        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer(
            {
                canvas: this.canvas,
                antialias: true
            }
        );
    }

    onStart()
    {
        /*
        event listeners
        */
        window.addEventListener('resize', () => 
        {
            this.sizes.width = window.innerWidth;
            this.sizes.height = window.innerHeight;

            this.camera.updateProjectionMatrix();

            this.renderer.setSize(this.sizes.width, this.sizes.height);
            this.renderer.setPixelRatio(window.devicePixelRatio);
        });

        /*
        initial setup
        */
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
        
        this.camera.position.z = 10;
        this.scene.add(this.camera);

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setClearColor("Grey", 1.0);

        // white light
        this.sceneLight = new THREE.DirectionalLight(0xFFFFFF);
        this.sceneLight.position.x = 0;
        this.sceneLight.position.y = 1;
        this.sceneLight.position.z = 1;
        this.scene.add(this.sceneLight);

        const a = new Vertex(0.5, new THREE.Vector3(-5.0, 0.0, 0.0));
        const b = new Vertex(0.5, new THREE.Vector3(5.0, 0.0, 0.0));
        const edge = new Edge(a, b);
        this.scene.add(a.getMesh());
        this.scene.add(b.getMesh());
        this.scene.add(edge.getMesh());

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
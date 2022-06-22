/*
A basic Three.js app reuires 4 main things:
    * Scene - holds all objects, lights, camera etc
    * Objects - geometry
    * Camera - how we see the scene
    * Renderer - how everything is rendered
*/
import './style.css'
import * as THREE from 'three';
import * as dat from 'dat.gui';
import Stats from 'stats.js';

export default class App
{
    constructor()
    {
        this.stats = new Stats();
        this.gui = new dat.GUI();

        this.canvas = document.querySelector('.webgl');
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
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
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
        
        this.scene.add(this.camera);

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor('grey');

        //this needs to come at the end of onStart
        this.clock = new THREE.Clock();
    }

    onUpdate()
    {   
        //needs to come at the beginning of onUpdate
        this.stats.begin();
        this.dt = this.clock.getDelta();
    }

    onRender()
    {
        this.renderer.render(this.scene, this.camera);

        //needs to come at the end of onRender
        this.stats.end();
    }
}
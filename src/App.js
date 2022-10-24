import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'stats.js';
import Maze from './Objects/Maze';
import { depthFirstSearch } from './Algorithms/depthFirst';
import { breadthFirstSearch } from './Algorithms/breadthFirst';

export default class App
{
    /**
     * Creates main application objects
     */
    constructor()
    {
        this.algorithms = {
            BFS : ["Breadth First Search",5], // name of algorithm, number of lines in psuedocode
            Dyjkstra : ["Dyjkstra", 5]
        };
        
        this.currentAlgorithm = "BFS";
        this.code = []; // psuedocode lines stored here
        this.currentLine = 0; // current line of code being highlighted
        this.numIterations = 0; // number of iterations of the algorithm
        this.numSteps = 0; // number of steps in the algorithm
        
        //set up GUI elements
        this.stepsGui = document.getElementById("steps"); // gui element for steps
        this.iterationsGui = document.getElementById("iterations"); // gui element for iterations
        

        

        
    

        this.stats = new Stats();
        this.canvas = document.querySelector('.webgl');
        if(window.innerHeight <= 900)
        {
            this.sizes = {
                width: window.innerWidth/2.5,
                height: window.innerHeight/2.5,
            };
        }
        if(window.innerHeight > 900 && window.innerHeight <= 1200)
        {
            this.sizes = {
                width: window.innerWidth/2,
                height: window.innerHeight/2,
            };
        }
        if(window.innerHeight > 1200)
        {
            this.sizes = {
                width: window.innerWidth/1.45,
                height: window.innerHeight/1.45,
            };
        }
        

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
        this.setupPsuedocode(this.algorithms[this.currentAlgorithm][1]);

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

        // visualize bfs
        if (this.maze.algVis.bfs.visualize)
        {
            // add to timer
            this.maze.algVis.timer += dt;

            // reach end of visualization
            if (this.maze.algVis.bfs.index === this.maze.algVis.bfs.order.length - 1)
            {
                this.maze.algVis.bfs.visualize = false;
                this.maze.algVis.bfs.seeShortestPath = true;
            }

            // visualize the path each 1/10 second
            if (this.maze.algVis.timer >= this.maze.algVis.speed)
            {
                this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].material.opacity = 1.0;
                this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].material.color.set(this.maze.algVis.color);
                this.maze.algVis.bfs.index++;
                this.maze.algVis.timer = 0.0;
            }
        }

        // visualize bfs shortest path
        if (this.maze.algVis.bfs.seeShortestPath)
        {
            // add to timer
            this.maze.algVis.timer += dt;

            // make yellow paths transparent
            if (this.maze.algVis.bfs.pathCleared)
            {
                this.maze.algVis.bfs.order.forEach((path) => {
                    path.material.opacity = 0.15;
                });
                this.maze.algVis.bfs.pathCleared = false;
            }

            // reach end of visualization
            if (this.maze.algVis.bfs.shortestPathIndex === this.maze.algVis.bfs.shortestPath.length)
            {
                this.maze.algVis.bfs.seeShortestPath = false;
            }

            // visualize the path each 1/10 second
            if (this.maze.algVis.timer >= this.maze.algVis.speed)
            {
                this.maze.algVis.bfs.shortestPath[this.maze.algVis.bfs.shortestPathIndex].material.opacity = 1.0;
                this.maze.algVis.bfs.shortestPath[this.maze.algVis.bfs.shortestPathIndex].material.color.set(this.maze.algVis.shortestPathColor);
                this.maze.algVis.bfs.shortestPathIndex++;
                this.maze.algVis.timer = 0.0;
            }
        }

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
        // window.addEventListener('resize', () => 
        // {
        //     this.sizes.width = window.innerWidth;
        //     this.sizes.height = window.innerHeight;

        //     this.camera.updateProjectionMatrix();

        //     this.renderer.setSize(this.sizes.width, this.sizes.height);
        //     this.renderer.setPixelRatio(window.devicePixelRatio);
        // });

        //add step button event for BFS
        document.getElementById("stepBtn").addEventListener("click", () =>
        {
            this.stepPsudocode();
            console.log("step");
        });

        //add back button event for BFS
        document.getElementById("backBtn").addEventListener("click", () =>
        {
            this.backstepPsudocode();
            console.log("back");
        });


        //add generate button event
        document.getElementById("generateBtn").addEventListener("click", () =>
        {
            this.maze.fill();
            depthFirstSearch(this.maze.start, this.maze);
            console.log("generate");
            //disable and hide the button
            document.getElementById("generateBtn").style.display = "none";
            //show the solve button
            document.getElementById("solveBtn").style.display = "block";
            //disable range sliders
            document.getElementsByClassName("slider")[0].style.visibility = "hidden";
        });

        //add solve button event
        document.getElementById("solveBtn").addEventListener("click", () =>
        {
            breadthFirstSearch(this.maze);
            this.maze.algVis.bfs.visualize = true;
            console.log(this.maze.algVis.bfs.order);
            console.log("solve");
            //disable and hide the button
            document.getElementById("solveBtn").style.display = "none";
            //show the reset button
            document.getElementById("resetBtn").style.display = "block";
        });

        //add reset button event
        document.getElementById("resetBtn").addEventListener("click", () =>
        {
            this.maze.clear();
            console.log("reset");
            //show the generate button
            document.getElementById("generateBtn").style.display = "block";
            //hide the reset button
            document.getElementById("resetBtn").style.display = "none";
            //hide the solve button
            document.getElementById("solveBtn").style.display = "none";
            //enable range sliders
            document.getElementsByClassName("slider")[0].style.visibility = "visible";
        });

        //add slider events
        document.getElementById("mazeSizeX").addEventListener("input", () =>
        {
            let value = document.getElementById("mazeSizeX").value;
            this.maze.scale(value / 2, 'x');
            document.getElementById("valueX").innerHTML = value;
        });
        
        document.getElementById("mazeSizeY").addEventListener("input", () =>
        {
            let value = document.getElementById("mazeSizeY").value;
            this.maze.scale(value / 2, 'y');
            document.getElementById("valueY").innerHTML = value;
        });

        document.getElementById("mazeSizeZ").addEventListener("input", () =>
        {
            let value = document.getElementById("mazeSizeZ").value;
            this.maze.scale(value / 2, 'z');
            document.getElementById("valueZ").innerHTML = value;
        });

        document.getElementById("speed").addEventListener("input", () =>
        {
            let value = document.getElementById("speed").value;
            this.maze.algVis.speed = value;
            document.getElementById("valueSpeed").innerHTML = value;
        });



        //set up on change listener for the drop down menu.
        $("#Algorithm").on("change", (item) => {
            let oldAlgo = this.currentAlgorithm;
            //change the algorithm
            //change psudocode header
            document.getElementById("codeHeader").innerText = this.algorithms[item.target.value][0];
            //change the psuedocode
            document.getElementById(oldAlgo).style = "display: none";
            document.getElementById(item.target.value).style = "display: block";
            this.currentAlgorithm = item.target.value;
            this.setupPsuedocode(this.algorithms[item.target.value][1]);
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
        this.renderer.setClearColor(0x2c2c2c);

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
        this.initialSize = 6;
        this.maze = new Maze(0xFFFFFF, true, this.initialSize, 0.0, new THREE.Vector3(0, 0, 0));

        // only add maze wireframe
        this.scene.add(this.maze.getWireFrame());
        // add all maze nodes
        this.scene.add(this.maze.getNodeMeshes());

        // debug
        // z is blue,  y is green, x is red
        //this.scene.add(new THREE.AxesHelper(10));
    }

    /**
     * Sets up psuedocode for algorithm
     * 
     * */
    setupPsuedocode(numLines)
    {
        this.currentLine = 0; //reset current line
        this.numIterations = 0; //reset number of iterations
        this.numSteps = 0; //reset number of steps
        this.updateStepsGUI();
        this.code = []; //reset code array

        //push all the code from the current algorithm into the code array
        for (let i = 1; i < numLines+1; i++)
            this.code.push(document.getElementById(`${this.currentAlgorithm}`+"Line" + i));
        
        //unhighlight all the code in case it was highlighted from a previous algorithm
        for (let i = 0; i < this.code.length; i++)
            this.code[i].style.backgroundColor = "transparent";
            
        // set first line to be highlighted
        this.code[0].style.backgroundColor = "rgba(255, 255, 0, 0.2)";
    }

    

    /**
     * unhilight the current line of code and hilight the previous line 
     * only if number of steps is greater than 0
     * */
    backstepPsudocode()
    {
        if(this.numSteps > 0)
        {
            this.code[this.currentLine].style.backgroundColor = "transparent";
            this.currentLine--;
            if(this.currentLine < 0)
            {
                this.currentLine = this.algorithms[this.currentAlgorithm][1]-1;
                this.numIterations--;
            }
            this.code[this.currentLine].style.backgroundColor = "rgba(255, 255, 0, 0.2)";
            this.numSteps--;
            this.updateStepsGUI();
        }
    }


    /**
     * unhilight the current line of code and hilight the next line then wrap back to the start
     * */
    stepPsudocode()
    {
        this.code[this.currentLine].style.backgroundColor = "transparent";
        this.currentLine++;
        if (this.currentLine >= this.algorithms[this.currentAlgorithm][1])
        {
            this.currentLine = 0;
            this.numIterations++;
        }
            
        this.code[this.currentLine].style.backgroundColor = "rgba(255, 255, 0, 0.2)";  
        this.numSteps++;
        this.updateStepsGUI();
        
    }

    /**
     * updates the number of steps & iterations taken in the GUI
     * */
    updateStepsGUI()
    {
        this.stepsGui.innerText = this.numSteps;
        this.iterationsGui.innerText = this.numIterations;
    }

    /**
     * switches what algorithm is being visualized
     * */
    switchAlgorithm()
    {

    }

}
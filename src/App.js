import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'stats.js';
import Maze from './Objects/Maze';
import { depthFirstSearch } from './Algorithms/depthFirst';
import { breadthFirstSearch } from './Algorithms/breadthFirst';
import { dijkstra } from './Algorithms/dijkstra';
import { Astar } from './Algorithms/Astar';

export default class App
{
    /**
     * Creates main application objects
     */
    constructor()
    {
        this.algorithms = {
            BFS : ["Breadth First Search",6], // name of algorithm, number of lines in psuedocode
            Dijkstra : ["Dijkstra", 9],
            Astar: ["Astar", 9]
        };
        
        this.currentAlgorithm = "BFS";
        this.code = []; // psuedocode lines stored here
        this.currentLine = 0; // current line of code being highlighted
        this.numIterations = 0; // number of iterations of the algorithm
        this.numSteps = 0; // number of steps in the algorithm
        this.paused = true; // is the algorithm paused? start paused if psudocode is on. (true = paused, false = running)
        this.executed = false;
        
        //set up GUI elements
        this.stepsGui = document.getElementById("steps"); // gui element for steps
        this.iterationsGui = document.getElementById("iterations"); // gui element for iterations
        this.steps = 0;
        this.nodeWeights = document.getElementById("nodeWeights"); // gui element for node weights

        this.weightColors = {
            1 : 0xfcfda4,
            2 : 0xf2f27d, 
            3 : 0xf6d543,  
            4 : 0xf8850f, 
            5 : 0xe75d2d, 
            6 : 0xcb4149, 
            7 : 0x972666, 
            8 : 0x68156e, 
            9 : 0x380f63,  
            10 : 0x00010d, 
        };

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
                width: window.innerWidth/2.3 + 150,
                height: window.innerHeight/2.3 + 200,
            };
        }
        if(window.innerHeight > 1200)
        {
            this.sizes = {
                width: window.innerWidth/2,
                height: 907.5,
            };
        }
        if(window.innerHeight > 1500 )
        {
            this.sizes = {
                width: window.innerWidth/1.4,
                height: window.innerHeight/1.4,
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

        if(!this.paused)
        {
            switch (this.currentAlgorithm)
            {
                case "BFS":
                    this.visualizeBfs(dt);
                    break;
                case "Dijkstra":
                    this.visualizeDijkstra(dt);
                    break;
                case "Astar":
                    this.visualizeAstar(dt);
                    break;
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
        //add step button event for BFS
        document.getElementById("stepBtn").addEventListener("click", () =>
        {
            switch (this.currentAlgorithm)
            {
                case "BFS":
                    if(document.getElementById("codeSwitch").checked)
                    {
                        this.visualizeStepBfs();
                    }
                    else
                    {
                        this.visualizeStepBfsNoCode();
                    }
                    
                    break;
                case "Dijkstra":
                    if(document.getElementById("codeSwitch").checked)
                    {
                        this.visualizeStepDijkstra();
                    }
                    else
                    {
                        this.visualizeStepDijkstraNoCode();
                    }
                    break;
                case "Astar":
                    if(document.getElementById("codeSwitch").checked)
                    {
                        this.visualizeStepAstar();
                    }
                    else
                    {
                        this.visualizeStepAstarNoCode();
                    }
                    break;
            }
            console.log("step");
        });

        //add back button event for BFS
        document.getElementById("backBtn").addEventListener("click", () =>
        {
            switch (this.currentAlgorithm)
            {
                case "BFS":
                    this.visualizeBackBfsNoCode();
                    break;
                case "Dijkstra":
                    this.visualizeBackDijkstraNoCode();
                    break;
                case "Astar":
                    this.visualizeBackAstarNoCode();
                    break;
            }
            console.log("back");
        });


        //add generate button event
        document.getElementById("generateBtn").addEventListener("click", () =>
        {
            this.maze.fill();
            depthFirstSearch(this.maze.start, this.maze);
            this.maze.cleanAdjList();
            console.log("generate");
           
            //disable and hide the button
            document.getElementById("generateBtn").style.display = "none";
            //hide the reset button
            document.getElementById("resetBtn").style.display = "block";
            
            //disable range sliders
            document.getElementById("sliders").style.display = "none";
            //hide the psuedocode checkbox
            document.getElementById("codeCheckbox").style.display = "block";
            //show the algorithm select
            document.getElementById("algoPicker").style.display = "block";
            //show speed slider
            document.getElementById("speedSlider").style.display = "block";
            //show the solve button
            document.getElementById("solveBtn").style.display = "block";
            let item = document.getElementById("Algorithm").value;
            if(item != "BFS")
            {
                document.getElementById("nodeWeights").style.display = "block";
            }
            else
            {
                document.getElementById("nodeWeights").style.display = "none";
            }
            
        });

        document.getElementById("solveBtn").addEventListener("click", () =>
        {
           
            document.getElementById("algoPicker").style.display = "none";
            //hide the reset button
            document.getElementById("resetBtn").style.display = "none";
            //hide psuedocode checkbox
            document.getElementById("codeCheckbox").style.display = "none";
            //hide the solve button
            document.getElementById("solveBtn").style.display = "none";
            //show the playPause button
            document.getElementById("playPauseBtn").style.display = "block";
            //if psudocode show only step button. else show all buttons
            if(document.getElementById("codeSwitch").checked)
            {
                document.getElementById("stepBtn").style.display = "block";
            }
            else
            {
                document.getElementById("stepBtn").style.display = "block";
                document.getElementById("backBtn").style.display = "block";
            }
            this.currentAlgorithm = document.getElementById("Algorithm").value;
            console.log(this.currentAlgorithm);
            switch (this.currentAlgorithm)
            {
                case "BFS":
                    breadthFirstSearch(this.maze);
                    this.maze.algVis.bfs.visualize = true;
                    console.log("BFS solve");
                    break;
                case "Dijkstra":
                    dijkstra(this.maze);
                    this.maze.algVis.dijkstra.visualize = true;
                    console.log("Dijkstra solve");
                    break;
                case "Astar":
                    Astar(this.maze);
                    this.maze.algVis.aStar.visualize = true;
                    console.log("Astar solve");
                    break;
            }
            console.log(this.currentAlgorithm + " algorithm loaded and ready to go!");
            this.paused = false;
        });

        //add reset button event
        document.getElementById("resetBtn").addEventListener("click", () =>
        {
            //this.setupPsuedocode(this.algorithms[this.currentAlgorithm][1]);
            this.maze.reset();
            //this.maze.resetNodes();
            console.log("reset");
            //show the generate button
            document.getElementById("generateBtn").style.display = "block";
            //show the reset button
            document.getElementById("resetBtn").style.display = "none";
            //hide playPause button
            document.getElementById("playPauseBtn").style.display = "none";
            //enable range sliders
            document.getElementById("sliders").style.display = "block";
            //show algorithm select
            document.getElementById("algoPicker").style.display = "none";
            //hide speed slider
            document.getElementById("speedSlider").style.display = "none";
            //show the psuedocode checkbox
            document.getElementById("codeCheckbox").style.display = "block";
            this.paused = true;
            document.getElementById("playPauseBtn").innerText = "Pause";
            //hide all buttons
            document.getElementById("stepBtn").style.display = "none";
            document.getElementById("backBtn").style.display = "none";
            //set algopicker to BFS
            document.getElementById("Algorithm").value = "BFS";
            //hide node weights
            document.getElementById("nodeWeights").style.display = "none";
            //hide psuedocode checkbox
            document.getElementById("codeCheckbox").style.display = "none";

            //resize the canvas to width 100%
            document.getElementById("canvas").style.width = "100%";
            this.camera.aspect = window.innerWidth / this.sizes.height;
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(window.innerWidth, this.sizes.height);
            //uncheck the code checkbox
            document.getElementById("codeSwitch").checked = false;
            document.getElementById("codeCheckbox").style.display = "none";
            document.getElementById("codeBlock").style.display = "none";
            //hide solve button
            document.getElementById("solveBtn").style.display = "none";
            //hide clear button
            document.getElementById("clearBtn").style.display = "none";
            this.executed = false;

        });
        document.getElementById("clearBtn").addEventListener("click", () =>
        {
            this.maze.clear();
            //hide playPause button
            document.getElementById("playPauseBtn").style.display = "none";
            document.getElementById("playPauseBtn").innerText = "Pause";
            document.getElementById("clearBtn").style.display = "none";
             //disable range sliders
             document.getElementById("sliders").style.display = "none";
             //hide the psuedocode checkbox
             document.getElementById("codeCheckbox").style.display = "block";
             //show the algorithm select
             document.getElementById("algoPicker").style.display = "block";
             //show speed slider
             document.getElementById("speedSlider").style.display = "block";
             //show the solve button
             document.getElementById("solveBtn").style.display = "block";
             
             let item = document.getElementById("Algorithm").value;
             this.setupPsuedocode(this.algorithms[item][1]);
             if(item != "BFS")
             {
                 document.getElementById("nodeWeights").style.display = "block";
             }
             else
             {
                 document.getElementById("nodeWeights").style.display = "none";
             }

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
            let value = Math.abs(document.getElementById("speed").value);
            
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
            //if the algorithm is anything but BFS then show the nodeWeights
            if(item.target.value != "BFS")
            {
                document.getElementById("nodeWeights").style.display = "block";
            }
            else
            {
                document.getElementById("nodeWeights").style.display = "none";
            }
        }); 

        //add playPause button event
        document.getElementById("playPauseBtn").addEventListener("click", () =>
        {
            this.paused = !this.paused; //toggle the paused variable
            //change the button text
            if (this.paused)
            {
                document.getElementById("playPauseBtn").innerText = "Resume";
                console.log("paused");
            }
            else
            {
                document.getElementById("playPauseBtn").innerText = "Pause";
                console.log("Playing");
            }
        });

        //add event listener for psuedocode checkbox
        document.getElementById("codeSwitch").addEventListener("change", () =>
        {
            if (document.getElementById("codeSwitch").checked)
            {
                document.getElementById("codeBlock").style.display = "block";
                document.getElementById("canvas").style.width = this.sizes.width;
                this.camera.aspect = this.sizes.width / this.sizes.height;
                this.camera.updateProjectionMatrix()
                this.renderer.setSize(this.sizes.width, this.sizes.height);
            }
            else
            {
                document.getElementById("codeBlock").style.display = "none";
                //resize the canvas to width 100%
                document.getElementById("canvas").style.width = "100%";
                this.camera.aspect = window.innerWidth / this.sizes.height;
                this.camera.updateProjectionMatrix()
                this.renderer.setSize(window.innerWidth, this.sizes.height);

            }
        });

        //add event listener for helper checkbox
        document.getElementById("helperSwitch").addEventListener("change", () =>
        {
            if (document.getElementById("helperSwitch").checked)
            {
                this.axisHelper = new THREE.AxesHelper(10);
                this.scene.add(this.axisHelper);
                console.log("helper on");
            }
            else
            {

                this.scene.remove(this.axisHelper);
                console.log("helper off");

            }
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
        this.axisHelper = new THREE.AxesHelper(10);
        this.scene.add(this.axisHelper);
        //this.scene.add(new THREE.AxesHelper(10));
        
        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        document.getElementById("codeBlock").style.display = "none";
        //resize the canvas to width 100%
        document.getElementById("canvas").style.width = "100%";
        this.camera.aspect = window.innerWidth / this.sizes.height;
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, this.sizes.height);
        //uncheck the code checkbox
        document.getElementById("codeSwitch").checked = false;
        document.getElementById("codeCheckbox").style.display = "none";
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
    backBFS()
    {
        if(this.numSteps > 0)
        {
            this.code[this.currentLine].style.backgroundColor = "transparent";
            this.currentLine--;
            if(this.currentLine < 2 && this.numIterations > 0)
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
    stepBFS()
    {
        this.code[this.currentLine].style.backgroundColor = "transparent";
        this.currentLine++;
        if (this.currentLine >= this.algorithms[this.currentAlgorithm][1])
        {
            this.currentLine = 2;
            this.numIterations++;
        }
            
        this.code[this.currentLine].style.backgroundColor = "rgba(255, 255, 0, 0.2)";  
        this.numSteps++;
        this.updateStepsGUI();
    }

    stepDyjkstra()
    {
        this.code[this.currentLine].style.backgroundColor = "transparent";
        this.currentLine++;
        if (this.currentLine >= this.algorithms[this.currentAlgorithm][1])
        {
            this.currentLine = 5;
            this.numIterations++;
        }
            
        this.code[this.currentLine].style.backgroundColor = "rgba(255, 255, 0, 0.2)";  
        this.numSteps++;
        this.updateStepsGUI();
    }

    stepAstar()
    {
        this.code[this.currentLine].style.backgroundColor = "transparent";
        this.currentLine++;
        if (this.currentLine >= this.algorithms[this.currentAlgorithm][1])
        {
            this.currentLine = 5;
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

    
    visualizeBackBfsNoCode()
    {
        // visualize bfs
        if (this.maze.algVis.bfs.visualize)
        {            
            if(this.maze.algVis.bfs.index === 0)
            {
                //hide neighbors from previous step
                for (let index = 0; index < this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].neighbours.length; index++) {
                    const neighbor = this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].neighbours[index];
                    neighbor.material.color.set(this.maze.algVis.neighbourColor);
                    neighbor.material.opacity = 0.25;
                }
                return;
            }
            

            if(this.executed === false)
            {
                
                // visualize the path 
                this.maze.algVis.bfs.index--;
                this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].mesh.material.opacity = 0.5;
                this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].mesh.material.color.set(this.maze.algVis.pathColor);
                
                this.maze.algVis.bfs.index++;
                this.executed = true;
            }
            else
            {
                this.maze.algVis.bfs.index--;
                //hide neighbors from previous step
                for (let index = 0; index < this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].neighbours.length; index++) {
                    const neighbor = this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].neighbours[index];
                    neighbor.material.color.set(this.maze.algVis.neighbourColor);
                    neighbor.material.opacity = 0.25;
                }
                this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].mesh.material.opacity = 1;
                this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].mesh.material.color.set(this.maze.algVis.pathColor);
                this.executed = false;

            }
            
        }
    }

    visualizeStepBfsNoCode()
    {
        // visualize bfs
        if (this.maze.algVis.bfs.visualize)
        {            
            // reach end of visualization
            if (this.maze.algVis.bfs.index === this.maze.algVis.bfs.order.length - 1)
            {
                this.maze.algVis.bfs.visualize = false;
                this.maze.algVis.bfs.seeShortestPath = true;
            }

            
            if(this.executed === false)
            {
                //visualize neighbors
                for (let index = 0; index < this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].neighbours.length; index++) {
                    const neighbor = this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].neighbours[index];
                    neighbor.material.color.set(this.maze.algVis.neighbourColor);
                    neighbor.material.opacity = 1.0;
                }
                this.executed = true;
            }
            else
            {
                // visualize the path
                this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].mesh.material.color.set(this.maze.algVis.color);
                this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].mesh.material.opacity = 1.0;
                //hide neighbors from previous step
                for (let index = 0; index < this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].neighbours.length; index++) {
                    const neighbor = this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].neighbours[index];
                    neighbor.material.color.set(this.maze.algVis.neighbourColor);
                    neighbor.material.opacity = 0.25;
                }
                this.maze.algVis.bfs.index++;
                this.executed = false;
            }
            
            
            

            
        }
    }

    visualizeStepBfs()
    {
        // visualize bfs
        if (this.maze.algVis.bfs.visualize)
        {            
            // reach end of visualization
            if (this.maze.algVis.bfs.index === this.maze.algVis.bfs.order.length - 1)
            {
                this.maze.algVis.bfs.visualize = false;
                this.maze.algVis.bfs.seeShortestPath = true;
            }

            if (this.currentLine === 4)
            {
                //visualize neighbors
                for (let index = 0; index < this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].neighbours.length; index++) {
                    const neighbor = this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].neighbours[index];
                    neighbor.material.color.set(this.maze.algVis.neighbourColor);
                    neighbor.material.opacity = 1.0;
                }
                    
            }

             // visualize the path 
             if (this.currentLine === 5)
             {
                this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].mesh.material.opacity = 1.0;
                this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].mesh.material.color.set(this.maze.algVis.color);
                //hide neighbors from previous step
                for (let index = 0; index < this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].neighbours.length; index++) {
                    const neighbor = this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].neighbours[index];
                    neighbor.material.color.set(this.maze.algVis.color);
                    neighbor.material.opacity = 0.5;
                }
                this.maze.algVis.bfs.index++;
                
             }


            //visualize the psudocode            
            this.stepBFS();
            this.steps++;
        }

    }

    visualizeBfs(dt)
    {
         // visualize bfs
         if (this.maze.algVis.bfs.visualize)
         {
            // reach end of visualization
            if (this.maze.algVis.bfs.index === this.maze.algVis.bfs.order.length - 1)
            {
                this.maze.algVis.bfs.visualize = false;
                this.maze.algVis.bfs.seeShortestPath = true;
            }

            // add to timer
            this.maze.psudoVis.timer += dt;
            
            //visualize the psudocode
            if (this.maze.psudoVis.timer >= this.maze.algVis.speed)
            {
                this.stepBFS();
                this.maze.psudoVis.timer = 0.0;
                this.steps++;
                this.executed = false;
            }

            //visualize neighbors
            if (this.currentLine === 4)
            {
                
                for (let index = 0; index < this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].neighbours.length; index++) {
                    const neighbor = this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].neighbours[index];
                    neighbor.material.color.set(this.maze.algVis.neighbourColor);
                    neighbor.material.opacity = 1.0;
                }
                    
            }
            // visualize the path 
            if (this.currentLine === 5 && this.executed == false)
            {
                this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].mesh.material.opacity = 1.0;
                this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].mesh.material.color.set(this.maze.algVis.color);
                //hide neighbors from previous step
                for (let index = 0; index < this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].neighbours.length; index++) {
                    const neighbor = this.maze.algVis.bfs.order[this.maze.algVis.bfs.index].neighbours[index];
                    neighbor.material.color.set(this.maze.algVis.color);
                    neighbor.material.opacity = 0.5;
                }
                this.maze.algVis.bfs.index++;
                this.executed = true;
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
                     path.mesh.material.opacity = 0.15;
                 });
                 this.maze.algVis.bfs.pathCleared = false;
             }
 
             // reach end of visualization
             if (this.maze.algVis.bfs.shortestPathIndex === this.maze.algVis.bfs.shortestPath.length)
             {
                 this.maze.algVis.bfs.seeShortestPath = false;
                 //show the clear and reset buttons
                document.getElementById("clearBtn").style.display = "block";
                document.getElementById("resetBtn").style.display = "block";
                //hide playpause button
                document.getElementById("playPauseBtn").style.display = "none";
                document.getElementById("playPauseBtn").innerHTML = "Start";
                //hide the step and backstep buttons
                document.getElementById("stepBtn").style.display = "none";
                document.getElementById("backBtn").style.display = "none";
                this.paused = true;

             }
             // visualize the path each 1/10 second
             else if (this.maze.algVis.timer >= this.maze.algVis.speed)
             {
                 this.maze.algVis.bfs.shortestPath[this.maze.algVis.bfs.shortestPathIndex].mesh.material.opacity = 1.0;
                 this.maze.algVis.bfs.shortestPath[this.maze.algVis.bfs.shortestPathIndex].mesh.material.color.set(this.maze.algVis.shortestPathColor);
                 this.maze.algVis.bfs.shortestPathIndex++;
                 this.maze.algVis.timer = 0.0;
             }
         } 
    }

    visualizeBackDijkstraNoCode()
    {
        // visualize dijkstra
        if (this.maze.algVis.dijkstra.visualize)
        {            
            
            //if we are at the start of the visualization
            if (this.maze.algVis.dijkstra.index == 0)
            {
                this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index].mesh.material.opacity = 1;
                this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index].mesh.material.color.set(this.maze.algVis.pathColor);
                this.executed = false;
                return;
            }
            if(this.executed)
            {
                this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index].mesh.material.opacity = 0.5;
                //this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index].mesh.material.color.set(this.maze.algVis.pathColor);
                //rehighlight neighbors from previous step
                for (let index = 0; index < this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index - 1].neighbours.length; index++) {
                    const neighbor = this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index - 1].neighbours[index];
                    neighbor.mesh.material.color.set(this.weightColors[neighbor.weight]);
                    neighbor.mesh.material.opacity = 1.0;
                }
                
                //this.maze.algVis.dijkstra.index--;
                this.executed = false;
            }
            else
            {
                this.maze.algVis.dijkstra.index--;
                //hide neighbors from previous step
                for (let index = 0; index < this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index].neighbours.length; index++) {
                    const neighbor = this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index].neighbours[index];
                    neighbor.mesh.material.color.set(this.maze.algVis.pathColor);
                    neighbor.mesh.material.opacity = 0.5;
                }
                
                
                this.executed = true;
            }
        }
    }

    visualizeStepDijkstraNoCode()
    {
         // visualize dijkstra
         if (this.maze.algVis.dijkstra.visualize)
         {            
            // reach end of visualization
            if (this.maze.algVis.dijkstra.index === this.maze.algVis.dijkstra.order.length - 1)
            {
                this.maze.algVis.dijkstra.visualize = false;
                this.maze.algVis.dijkstra.seeShortestPath = true;
            }
    
            // visualize the path 
            if (this.executed == false)
            {
                //if we aren't at the beginning of the visualization
                if (this.maze.algVis.dijkstra.index - 1 >= 0)
                {
                    //hide the neighbors from the previous step
                    for (let index = 0; index < this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index - 1].neighbours.length; index++) {
                        const neighbor = this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index - 1].neighbours[index];
                        neighbor.mesh.material.color.set(this.weightColors[neighbor.weight]);
                        neighbor.mesh.material.opacity = 0.5;
                    }
                }
                this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index].mesh.material.opacity = 1.0;
                //this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index].mesh.material.color.set(this.maze.algVis.color);

                this.executed = true;
            
            }
            else
            {
                //show the neighbors
                for (let index = 0; index < this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index].neighbours.length; index++) {
                    const neighbor = this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index].neighbours[index];
                    neighbor.mesh.material.color.set(this.weightColors[neighbor.weight]);
                    neighbor.mesh.material.opacity = 1;
                }
                this.maze.algVis.dijkstra.index++;
                this.executed = false;
            }
         }

    }
    visualizeStepDijkstra()
    {
        // visualize dijkstra
        if (this.maze.algVis.dijkstra.visualize)
        {            
            // reach end of visualization
            if (this.maze.algVis.dijkstra.index === this.maze.algVis.dijkstra.order.length - 1)
            {
                this.maze.algVis.dijkstra.visualize = false;
                this.maze.algVis.dijkstra.seeShortestPath = true;
            }
    
            // visualize the path 
            if (this.currentLine == 5)
            {
                //if we aren't at the beginning of the visualization
                if (this.maze.algVis.dijkstra.index - 1 >= 0)
                {
                    //hide the neighbors from the previous step
                    for (let index = 0; index < this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index - 1].neighbours.length; index++) {
                        const neighbor = this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index - 1].neighbours[index];
                        neighbor.mesh.material.color.set(this.weightColors[neighbor.weight]);
                        neighbor.mesh.material.opacity = 0.5;
                    }
                }
                this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index].mesh.material.opacity = 1.0;
                //this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index].mesh.material.color.set(this.maze.algVis.color);
               
            }

            // visualize the neighbors
            if (this.currentLine == 6)
            {
                //show the neighbors
                for (let index = 0; index < this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index].neighbours.length; index++) {
                    const neighbor = this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index].neighbours[index];
                    neighbor.mesh.material.color.set(this.weightColors[neighbor.weight]);
                    neighbor.mesh.material.opacity = 1;
                }

                this.maze.algVis.dijkstra.index++;

            }

            //visualize the psudocode            
            this.stepDyjkstra();
            this.steps++;
        }

    }

    visualizeDijkstra(dt)
    {
        // visualize dijkstra
        if (this.maze.algVis.dijkstra.visualize)
        {
            
            // add to timer
            this.maze.psudoVis.timer += dt;
            
            //visualize the psudocode
            if (this.maze.psudoVis.timer >= this.maze.algVis.speed)
            {
                this.stepDyjkstra();
                this.maze.psudoVis.timer = 0.0;
                this.steps++;
                this.executed = false;
            }

            // visualize the path 
            if (this.currentLine == 5 && this.executed == false)
            {

                //if we aren't at the beginning of the visualization
                if(this.maze.algVis.dijkstra.index - 1 >= 0)
                {
                    //hide neighbors from previous step
                    for (let index = 0; index < this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index -1].neighbours.length; index++) {
                        const neighbor = this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index -1].neighbours[index];
                        neighbor.mesh.material.color.set(this.weightColors[neighbor.weight]);
                        neighbor.mesh.material.opacity = 0.5;
                    }
                    
                }

                this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index].mesh.material.opacity = 1.0;
                //this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index].mesh.material.color.set(this.maze.algVis.color);
            }

            //visualize neighbors
            if (this.currentLine == 6 && this.executed == false)
            {
                for (let index = 0; index < this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index].neighbours.length; index++) {
                    const neighbor = this.maze.algVis.dijkstra.order[this.maze.algVis.dijkstra.index].neighbours[index];
                    neighbor.mesh.material.color.set(this.weightColors[neighbor.weight]);
                    neighbor.mesh.material.opacity = 1.0;
                }
                this.executed = true;
                this.maze.algVis.dijkstra.index++;
            }

            if (this.maze.algVis.dijkstra.index >= this.maze.algVis.dijkstra.order.length)
            {
                this.maze.algVis.dijkstra.visualize = false;
                this.maze.algVis.dijkstra.seeShortestPath = true;
            }
        }

        // visualize dijkstra shortest path
        if (this.maze.algVis.dijkstra.seeShortestPath)
        {
            // add to timer
            this.maze.algVis.timer += dt;

            // make yellow paths transparent
            if (this.maze.algVis.dijkstra.pathCleared)
            {
                this.maze.algVis.dijkstra.order.forEach((path) => {
                    path.mesh.material.opacity = 0.15;
                });
                this.maze.algVis.dijkstra.pathCleared = false;
            }

            // reach end of visualization
            if (this.maze.algVis.dijkstra.shortestPathIndex === this.maze.algVis.dijkstra.shortestPath.length)
            {
                this.maze.algVis.dijkstra.seeShortestPath = false;
                //show the clear and reset buttons
                document.getElementById("clearBtn").style.display = "block";
                document.getElementById("resetBtn").style.display = "block";
                //hide playpause button
                document.getElementById("playPauseBtn").style.display = "none";
                document.getElementById("playPauseBtn").innerHTML = "Start";
                //hide the step and backstep buttons
                document.getElementById("stepBtn").style.display = "none";
                document.getElementById("backBtn").style.display = "none";
                this.paused = true;

                
            }
            // visualize the path each 1/10 second
            else if (this.maze.algVis.timer >= this.maze.algVis.speed)
            {
                this.maze.algVis.dijkstra.shortestPath[this.maze.algVis.dijkstra.shortestPathIndex].material.opacity = 1.0;
                this.maze.algVis.dijkstra.shortestPath[this.maze.algVis.dijkstra.shortestPathIndex].material.color.set(this.maze.algVis.shortestPathColor);
                this.maze.algVis.dijkstra.shortestPathIndex++;
                this.maze.algVis.timer = 0.0;
            }
        }
    }

    visualizeBackAstarNoCode()
    {
        // visualize dijkstra
        if (this.maze.algVis.aStar.visualize)
        {            
            
            //if we are at the start of the visualization
            if (this.maze.algVis.aStar.index == 0)
            {
                this.maze.algVis.aStar.order[this.maze.algVis.aStar.index].mesh.material.opacity = 1;
                this.maze.algVis.aStar.order[this.maze.algVis.aStar.index].mesh.material.color.set(this.maze.algVis.pathColor);
                this.executed = false;
                return;
            }
            if(this.executed)
            {
                this.maze.algVis.aStar.order[this.maze.algVis.aStar.index].mesh.material.opacity = 0.5;
                //this.maze.algVis.aStar.order[this.maze.algVis.aStar.index].mesh.material.color.set(this.maze.algVis.pathColor);
                //rehighlight neighbors from previous step
                for (let index = 0; index < this.maze.algVis.aStar.order[this.maze.algVis.aStar.index - 1].neighbours.length; index++) {
                    const neighbor = this.maze.algVis.aStar.order[this.maze.algVis.aStar.index - 1].neighbours[index];
                    neighbor.mesh.material.color.set(this.weightColors[neighbor.weight]);
                    neighbor.mesh.material.opacity = 1.0;
                }
                
                //this.maze.algVis.aStar.index--;
                this.executed = false;
            }
            else
            {
                this.maze.algVis.aStar.index--;
                //hide neighbors from previous step
                for (let index = 0; index < this.maze.algVis.aStar.order[this.maze.algVis.aStar.index].neighbours.length; index++) {
                    const neighbor = this.maze.algVis.aStar.order[this.maze.algVis.aStar.index].neighbours[index];
                    neighbor.mesh.material.color.set(this.maze.algVis.pathColor);
                    neighbor.mesh.material.opacity = 0.5;
                }
                
                
                this.executed = true;
            }
        }
    }
    visualizeStepAstarNoCode()
    {
         // visualize aStar
         if (this.maze.algVis.aStar.visualize)
         {            
            // reach end of visualization
            if (this.maze.algVis.aStar.index === this.maze.algVis.aStar.order.length - 1)
            {
                this.maze.algVis.aStar.visualize = false;
                this.maze.algVis.aStar.seeShortestPath = true;
            }
    
            // visualize the path 
            if (this.executed == false)
            {
                //if we aren't at the beginning of the visualization
                if (this.maze.algVis.aStar.index - 1 >= 0)
                {
                    //hide the neighbors from the previous step
                    for (let index = 0; index < this.maze.algVis.aStar.order[this.maze.algVis.aStar.index - 1].neighbours.length; index++) {
                        const neighbor = this.maze.algVis.aStar.order[this.maze.algVis.aStar.index - 1].neighbours[index];
                        neighbor.mesh.material.color.set(this.weightColors[neighbor.weight]);
                        neighbor.mesh.material.opacity = 0.5;
                    }
                }
                this.maze.algVis.aStar.order[this.maze.algVis.aStar.index].mesh.material.opacity = 1.0;
                //this.maze.algVis.aStar.order[this.maze.algVis.aStar.index].mesh.material.color.set(this.maze.algVis.color);

                this.executed = true;
            
            }
            else
            {
                //show the neighbors
                for (let index = 0; index < this.maze.algVis.aStar.order[this.maze.algVis.aStar.index].neighbours.length; index++) {
                    const neighbor = this.maze.algVis.aStar.order[this.maze.algVis.aStar.index].neighbours[index];
                    neighbor.mesh.material.color.set(this.weightColors[neighbor.weight]);
                    neighbor.mesh.material.opacity = 1;
                }
                this.maze.algVis.aStar.index++;
                this.executed = false;
            }
         }

    }
    visualizeStepAstar()
    {
        // visualize astar
        if (this.maze.algVis.aStar.visualize)
        {            
            // reach end of visualization
            if (this.maze.algVis.aStar.index === this.maze.algVis.aStar.order.length - 1)
            {
                this.maze.algVis.aStar.visualize = false;
                this.maze.algVis.aStar.seeShortestPath = true;
            }
    
            // visualize the path 
            if (this.currentLine == 5)
            {
                //if we aren't at the beginning of the visualization
                if (this.maze.algVis.aStar.index - 1 >= 0)
                {
                    //hide the neighbors from the previous step
                    for (let index = 0; index < this.maze.algVis.aStar.order[this.maze.algVis.aStar.index - 1].neighbours.length; index++) {
                        const neighbor = this.maze.algVis.aStar.order[this.maze.algVis.aStar.index - 1].neighbours[index];
                        neighbor.mesh.material.color.set(this.weightColors[neighbor.weight]);
                        neighbor.mesh.material.opacity = 0.5;
                    }
                }
                this.maze.algVis.aStar.order[this.maze.algVis.aStar.index].mesh.material.opacity = 1.0;
                //this.maze.algVis.aStar.order[this.maze.algVis.aStar.index].mesh.material.color.set(this.maze.algVis.color);
               
            }

            // visualize the neighbors
            if (this.currentLine == 6)
            {
                //show the neighbors
                for (let index = 0; index < this.maze.algVis.aStar.order[this.maze.algVis.aStar.index].neighbours.length; index++) {
                    const neighbor = this.maze.algVis.aStar.order[this.maze.algVis.aStar.index].neighbours[index];
                    neighbor.mesh.material.color.set(this.weightColors[neighbor.weight]);
                    neighbor.mesh.material.opacity = 1;
                }

                this.maze.algVis.aStar.index++;

            }

            //visualize the psudocode            
            this.stepAstar();
            this.steps++;
        }

    }
    visualizeAstar(dt)
    {
         // visualize aStar
         if (this.maze.algVis.aStar.visualize)
         {
            // add to timer
            this.maze.psudoVis.timer += dt;

            //visualize the psudocode
            if (this.maze.psudoVis.timer >= this.maze.algVis.speed)
            {
                this.stepAstar();
                this.maze.psudoVis.timer = 0.0;
                this.steps++;
                this.executed = false;
            }

            // visualize the path 
            if (this.currentLine == 5 && this.executed == false)
            {
                //if we aren't at the beginning of the visualization
                if (this.maze.algVis.aStar.index - 1 >= 0)
                {
                    //hide the neighbors from the previous step
                    for (let index = 0; index < this.maze.algVis.aStar.order[this.maze.algVis.aStar.index - 1].neighbours.length; index++) {
                        const neighbor = this.maze.algVis.aStar.order[this.maze.algVis.aStar.index - 1].neighbours[index];
                        neighbor.mesh.material.color.set(this.weightColors[neighbor.weight]);
                        neighbor.mesh.material.opacity = 0.5;
                    }
                }
                this.maze.algVis.aStar.order[this.maze.algVis.aStar.index].mesh.material.opacity = 1.0;
                //this.maze.algVis.aStar.order[this.maze.algVis.aStar.index].mesh.material.color.set(this.maze.algVis.color);
            }

            // visualize the neighbors
            if (this.currentLine == 6 && this.executed == false)
            {
                //show the neighbors
                for (let index = 0; index < this.maze.algVis.aStar.order[this.maze.algVis.aStar.index].neighbours.length; index++) {
                    const neighbor = this.maze.algVis.aStar.order[this.maze.algVis.aStar.index].neighbours[index];
                    neighbor.mesh.material.color.set(this.weightColors[neighbor.weight]);
                    neighbor.mesh.material.opacity = 1;
                }
                this.executed = true;
                this.maze.algVis.aStar.index++;
            }

            // reach end of visualization
            if (this.maze.algVis.aStar.index === this.maze.algVis.aStar.order.length - 1)
            {
                this.maze.algVis.aStar.visualize = false;
                this.maze.algVis.aStar.seeShortestPath = true;
                
            }
         }
 
         // visualize aStar shortest path
         if (this.maze.algVis.aStar.seeShortestPath)
         {
             // add to timer
             this.maze.algVis.timer += dt;
 
             // make yellow paths transparent
             if (this.maze.algVis.aStar.pathCleared)
             {
                 this.maze.algVis.aStar.order.forEach((path) => {
                     path.mesh.material.opacity = 0.15;
                 });
                 this.maze.algVis.aStar.pathCleared = false;
             }
 
             // reach end of visualization
             if (this.maze.algVis.aStar.shortestPathIndex === this.maze.algVis.aStar.shortestPath.length)
             {
                 this.maze.algVis.aStar.seeShortestPath = false;
                 //show the clear and reset buttons
                document.getElementById("clearBtn").style.display = "block";
                document.getElementById("resetBtn").style.display = "block";
                //hide playpause button
                document.getElementById("playPauseBtn").style.display = "none";
                document.getElementById("playPauseBtn").innerHTML = "Start";
                //hide the step and backstep buttons
                document.getElementById("stepBtn").style.display = "none";
                document.getElementById("backBtn").style.display = "none";
                this.paused = true;

             }
             // visualize the path each 1/10 second
             else if (this.maze.algVis.timer >= this.maze.algVis.speed)
             {
                 this.maze.algVis.aStar.shortestPath[this.maze.algVis.aStar.shortestPathIndex].mesh.material.opacity = 1.0;
                 this.maze.algVis.aStar.shortestPath[this.maze.algVis.aStar.shortestPathIndex].mesh.material.color.set(this.maze.algVis.shortestPathColor);
                 this.maze.algVis.aStar.shortestPathIndex++;
                 this.maze.algVis.timer = 0.0;
             }
         } 
    }

    
}
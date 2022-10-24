import * as THREE from 'three';
import Node from './Node';
import Cube from './Cube'
import { Vector3 } from 'three';

export default class Maze extends Cube{
    /**
     * Constructor of Maze
     *
     * @param {hex} color color of the cube in hex
     * @param {bool} border determines if cube should have a border
     * @param {positive integer} initialSize initial scale of cube
     * @param {float} transparency alpha value of cube
     * @param {Vec3} postiion position of cube in world space
     */
    constructor(color, border, initialSize, transparency, position)
    {
       super(color, border, initialSize, transparency, position);
       // THREE needs meshes to render
       this.nodeMeshes = new THREE.Group();
       // holds our actual node objects
       this.nodes = [];
       this.nodeSize = 0.5;
       this.wireFrame.scale.set(this.size.x, this.size.y, this.size.z);
       this.adjList = new Map();
       // order of nodes visited for bfs
       this.algVis = {
            timer : 0,
            // maybe hook this up to the front end
            speed : 0.10,
            color : 0xFFFF00,
            shortestPathColor: 0xFF007F,
            bfs : {
                order: [],
                shortestPath: [],
                visualize: false,
                seeShortestPath: false,
                pathCleared: true,
                index : 0,
                shortestPathIndex: 0,
            }
       }
    }

    /**
     * Scales the cube by a certain value 
     * on a given axis
     *
     * @param {positive integer} value value to scale by
     * @param {string} axis axis of scale
     */
     scale(value, axis)
     {
         if (axis.toLowerCase() === 'x')
         {
             this.wireFrame.scale.x = value;
             this.size.x = value;
         }
         else if (axis.toLowerCase() == 'y')
         {
             this.wireFrame.scale.y = value;
             this.size.y = value;
         }
         else
         {
             this.wireFrame.scale.z = value;
             this.size.z = value;
         }
     }
     
     /**
     * creates all nodes in maze
     */
    fill()
    {
        this.adjustmentX = this.mesh.position.x - (this.size.x / 2) + (this.nodeSize / 2);
        this.adjustmentY = this.mesh.position.y - (this.size.y / 2) + (this.nodeSize / 2);
        this.adjustmentZ = this.mesh.position.z - (this.size.z / 2) + (this.nodeSize / 2);
        let position = new THREE.Vector3(this.adjustmentX, this.adjustmentY, this.adjustmentZ);

        let mazeSize = {
            x: this.size.x * 2,
            y: this.size.y * 2,
            z: this.size.z * 2,
        };
        let volumn = mazeSize.x * mazeSize.y * mazeSize.z;

        for (let i = 0; i < volumn; i++)
        {  
            if (i % (mazeSize.y) === 0 && i != 0)
            {
                position.y = this.adjustmentY;
                position.z += this.nodeSize;
            }
            if (i % (mazeSize.y * mazeSize.z) === 0 && i != 0)
            {
                position.x += this.nodeSize;
                position.y = this.adjustmentY;
                position.z = this.adjustmentZ;
            }
            let node;
            // start node 
            if (position.equals(new Vector3(this.adjustmentX, this.adjustmentY, this.adjustmentZ)))
            {
                node = new Node(0x48A14D, false, this.nodeSize, 1.0, position, "start");
                this.startNode = node;
                this.start = new Vector3(position.x, position.y, position.z);
            }
            // end node
            else if (position.equals(new Vector3(-this.adjustmentX, -this.adjustmentY, -this.adjustmentZ)))
            {
                this.endNode = node;
                node = new Node(0x781f19, false, this.nodeSize, 1.0, position, "end");
            }
            // wall
            else 
            {
                node = new Node(0x6577B3, false, this.nodeSize, 0.15, position, "wall");
            }
            this.nodeMeshes.add(node.getMesh());
            this.nodes.push(node);
            this.findNeighbours(position);
            position.y += this.nodeSize;
        }
    }

    /**
     * Finds the neighbours for a given
     * node position
     *
     * @param {Vector3} pos position of node
     */
    findNeighbours(pos)
    {
        //find all neighbours of a node given its position
        let neighbours = [];

        let x = pos.x;
        let y = pos.y;
        let z = pos.z;

        let xPlus = new THREE.Vector3(x + this.nodeSize, y, z); // right
        let xMinus = new THREE.Vector3(x - this.nodeSize, y, z); // left
        let yPlus = new THREE.Vector3(x, y + this.nodeSize, z); // up
        let yMinus = new THREE.Vector3(x, y - this.nodeSize, z); // down
        let zPlus = new THREE.Vector3(x, y, z + this.nodeSize); // forward
        let zMinus = new THREE.Vector3(x, y, z - this.nodeSize); // back

        //check if the neighbour is going to be still in the maze otherwise ignore it it's not a neighbour.
        if (xPlus.x <= -this.adjustmentX)
        {
            let weight = Math.floor(Math.random() * 10) + 1;
            let neighbour = xPlus;
            neighbours.push( {neighbour, weight} );
        }
        if (xMinus.x >= this.adjustmentX)
        {
            let weight = Math.floor(Math.random() * 10) + 1;
            let neighbour = xMinus;
            neighbours.push( {neighbour, weight} );
        }
        if (yPlus.y <= -this.adjustmentY)
        {
            let weight = Math.floor(Math.random() * 10) + 1;
            let neighbour = yPlus;
            neighbours.push( {neighbour, weight} );
        }
        if (yMinus.y >= this.adjustmentY)
        {
            let weight = Math.floor(Math.random() * 10) + 1;
            let neighbour = yMinus;
            neighbours.push( {neighbour, weight} );
        }
        if (zPlus.z <= -this.adjustmentZ)
        {
            let weight = Math.floor(Math.random() * 10) + 1;
            let neighbour = zPlus;
            neighbours.push( {neighbour, weight} );
        }
        if (zMinus.z >= this.adjustmentZ)
        {
            let weight = Math.floor(Math.random() * 10) + 1;
            let neighbour = zMinus;
            neighbours.push( {neighbour, weight} );
        }
        this.adjList.set(new Vector3(pos.x, pos.y, pos.z), neighbours);
    }

    /**
     * Debug adj list function, 
     * if a nodes neighbor is not found it will
     * remain transparent and blue otherwise
     * it will be white and opaque
     */
    degbugAdj()
    {
        this.adjList.forEach((value, key) => {
            value.forEach((n) => {
                let nodes = this.nodes.children;
                for (let i = 0; i < nodes.length; i++) 
                {
                    let node = nodes[i];
                    node.scale.set(0.25, 0.25, 0.25);
                    if (n.equals(node.position)) 
                    {
                        node.material.opacity = 1.0;
                        node.material.color = 0x000000;
                    }
                }
            })
        })
    }
 
    /**
     * Returns a node object based on position
     *
     * @param {Vector3} pos position of a given node
     * @param {Node} this.nodes[i] node object
     */
    getNode(pos)
    {
        for(let i = 0; i < this.nodes.length; i++)
        {
            if (this.nodes[i].mesh.position.equals(pos))
            {
                return this.nodes[i];
            }
        }
        return null;
    }

    /**
     * Clears nodes from maze
     */
    clear()
    {
        this.nodes = [];
        this.nodeMeshes.clear();

        // reset bfs
        this.algVis.bfs.order = [];
        this.algVis.bfs.shortestPath = [];
        this.algVis.bfs.index = 0;
        this.algVis.bfs.shortestPathIndex = 0;
        this.algVis.bfs.visualize = false;
        this.algVis.bfs.seeShortestPath = false;
        this.algVis.bfs.pathCleared = true;
    }

    /**
     * Returns the maze nodes
     *
     * @return {Group} maze nodes
     */
    getNodeMeshes()
    {
        return this.nodeMeshes;
    }
}
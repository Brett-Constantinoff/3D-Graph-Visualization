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

    generate()
    {
        // fill our maze with walls and start and end node
        this.fill();
        
        // for some reason, putting this in a function and returning the value doesnt work
        let n;
        this.adjList.forEach((value, key) => {
            if (key.x === this.start.x && key.y === this.start.y && key.z === this.start.z) 
            {
                n = value;
            }
        })
        // creates paths for maze
        this.dfs(this.start, n);
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
                this.start = new Vector3(position.x, position.y, position.z);
            }
            // end node
            else if (position.equals(new Vector3(-this.adjustmentX, -this.adjustmentY, -this.adjustmentZ)))
            {
                node = new Node(0x781f19, false, this.nodeSize, 1.0, position, "end");
            }
            // wall
            else 
            {
                node = new Node(0x6577B3, false, this.nodeSize, 0.25, position, "wall");
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
            neighbours.push(xPlus);
        }
        if (xMinus.x >= this.adjustmentX)
        {
            neighbours.push(xMinus);
        }
        if (yPlus.y <= -this.adjustmentY)
        {
            neighbours.push(yPlus);
        }
        if (yMinus.y >= this.adjustmentY)
        {
            neighbours.push(yMinus);
        }
        if (zPlus.z <= -this.adjustmentZ)
        {
            neighbours.push(zPlus);
        }
        if (zMinus.z >= this.adjustmentZ)
        {
            neighbours.push(zMinus);
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
     * Generates pathways through the maze
     *
     * @param {Vector3} nodePos position of a given node
     * @param {Array of neighbours} neighboursPos nodes neighbours positions
     */
    dfs(nodePos, neighboursPos)
    {
        // get current node object
        let node = this.getNode(new Vector3(nodePos.x, nodePos.y, nodePos.z));
        
        // if node exists
        if (node)
        {
            // make the node yellow and opaque if its a path
            if (node.type === "path")
            {
                node.material.opacity = 1.0;
                node.material.color.set(0xEDD94C);
            }
            // mark the current node as visited
            node.visited = true;
            // get a random neighbour and make it a path
            let index = Math.floor(Math.random() * neighboursPos.length);
            let randomPath = this.getNode(neighboursPos[index]);
            randomPath.type = "path";
            
            // perfrom dfs on each neighbour recursivly
            neighboursPos.forEach((neighbourPos) => {
                let neighbour = this.getNode(neighbourPos);
                if (!neighbour.visited)
                {
                    // again, this cant be in its own function for some reason
                    let n;
                    this.adjList.forEach((value, key) => {
                        if (key.x === neighbourPos.x && key.y === neighbourPos.y && key.z === neighbourPos.z) 
                        {
                            n = value;
                        }
                    })
                    // recurse
                    this.dfs(neighbourPos, n);
                }
            })
        }
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
        this.nodes.clear();
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
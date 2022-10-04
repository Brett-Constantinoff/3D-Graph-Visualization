import * as THREE from 'three';
import Node from './Node';
import Cube from './Cube'
import AdjacencyList from './AdjacencyList';
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
       this.nodes = new THREE.Group();
       this.nodeSize = 0.5;
       this.wireFrame.scale.set(this.size.x, this.size.y, this.size.z);
       this.adjList = new AdjacencyList();
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
            // start
            if (position.equals(new Vector3(this.adjustmentX, this.adjustmentY, this.adjustmentZ)))
            {
                node = new Node(0x48A14D, false, this.nodeSize, 1.0, position);
                node.type = "start";
            }
            // end
            else if(position.equals(new Vector3(-this.adjustmentX, -this.adjustmentY, -this.adjustmentZ)))
            {
                node = new Node(0x781f19 , false, this.nodeSize, 1.0, position);
                node.type = "end";
            }
            // wall
            else
            {
                node = new Node(0x6577B3, false, this.nodeSize, 0.25, position);
                node.type = "wall";
            }
            this.nodes.add(node.getMesh());
            this.findNeighbours(position);
            position.y += this.nodeSize;
        }
        console.log(this.adjList);
        this.degbugAdj();
    }

    /**
     * fills adj list 
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
        this.adjList.addVertex(new Vector3(pos.x, pos.y, pos.z), neighbours);
    }

    /**
     * Debug adj list function, 
     * if a nodes neighbor is not found it will
     * remain transparent and blue otherwise
     * it will be white and opaque
     */
    degbugAdj()
    {
        this.adjList.getAdjacencyList().forEach((value, key) => {
            value.forEach((n) => {
                let nodes = this.nodes.children;
                for (let i = 0; i < nodes.length; i++) {
                    let node = nodes[i];
                    node.scale.set(0.25, 0.25, 0.25);
                    if (n.equals(node.position)) {
                        node.material.opacity = 1.0;
                        node.material.color = 0x000000;
                    }
                }
            })
        })
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
    getNodes()
    {
        return this.nodes;
    }
}
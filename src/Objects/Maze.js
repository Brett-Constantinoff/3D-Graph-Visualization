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
            // every node is a wall to begin with
            let node = new Node(0x6577B3, false, this.nodeSize, 0.25, position);
            this.nodes.add(node.getMesh());
            this.findNeighbours(position);
            position.y += this.nodeSize;
        }
    }

    /**
     * fills adj list 
     */
    findNeighbours(pos)
    {
        // positions will be relative to the -x, -y, -z corner of maze
        // corner 0 (-x, -y, -z)
        if (pos.equals(new Vector3(this.adjustmentX, this.adjustmentY, this.adjustmentZ)))
        {
            this.adjList.addVertex(new Vector3(pos.x, pos.y, pos.z), [
                new Vector3(pos.x, pos.y + this.nodeSize, pos.z),
                new Vector3(pos.x + this.nodeSize, pos.y, pos.z),
                new Vector3(pos.x, pos.y, pos.z + this.nodeSize)
            ]);
        }
        // corner 1 (+x, -y, -z)
        else if (pos.equals(new Vector3(-this.adjustmentX, this.adjustmentY, this.adjustmentZ)))
        {
            this.adjList.addVertex(new Vector3(pos.x, pos.y, pos.z), [
                new Vector3(pos.x, pos.y + this.nodeSize, pos.z),
                new Vector3(pos.x - this.nodeSize, pos.y, pos.z),
                new Vector3(pos.x, pos.y, pos.z + this.nodeSize)
            ]);
        }
        // corner 2 (+x, -y, +z)
        else if (pos.equals(new Vector3(-this.adjustmentX, this.adjustmentY, -this.adjustmentZ)))
        {
            this.adjList.addVertex(new Vector3(pos.x, pos.y, pos.z), [
                new Vector3(pos.x, pos.y + this.nodeSize, pos.z),
                new Vector3(pos.x - this.nodeSize, pos.y, pos.z),
                new Vector3(pos.x, pos.y, pos.z - this.nodeSize)
            ]);
        }
         // corner 3 (-x, -y, +z)
         else if (pos.equals(new Vector3(this.adjustmentX, this.adjustmentY, -this.adjustmentZ)))
         {
             this.adjList.addVertex(new Vector3(pos.x, pos.y, pos.z), [
                 new Vector3(pos.x, pos.y + this.nodeSize, pos.z),
                 new Vector3(pos.x + this.nodeSize, pos.y, pos.z),
                 new Vector3(pos.x, pos.y, pos.z - this.nodeSize)
             ]);
         }
         // corner 4 (-x, +y, -z)
        else if (pos.equals(new Vector3(this.adjustmentX, -this.adjustmentY, this.adjustmentZ)))
        {
            this.adjList.addVertex(new Vector3(pos.x, pos.y, pos.z), [
                new Vector3(pos.x, pos.y + this.nodeSize, pos.z),
                new Vector3(pos.x + this.nodeSize, pos.y, pos.z),
                new Vector3(pos.x, pos.y, pos.z + this.nodeSize)
            ]);
        }
        // corner 5 (+x, +y, -z)
        else if (pos.equals(new Vector3(-this.adjustmentX, -this.adjustmentY, this.adjustmentZ)))
        {
            this.adjList.addVertex(new Vector3(pos.x, pos.y, pos.z), [
                new Vector3(pos.x, pos.y + this.nodeSize, pos.z),
                new Vector3(pos.x - this.nodeSize, pos.y, pos.z),
                new Vector3(pos.x, pos.y, pos.z + this.nodeSize)
            ]);
        }
        // corner 6 (+x, +y, +z)
        else if (pos.equals(new Vector3(-this.adjustmentX, -this.adjustmentY, -this.adjustmentZ)))
        {
            this.adjList.addVertex(new Vector3(pos.x, pos.y, pos.z), [
                new Vector3(pos.x, pos.y + this.nodeSize, pos.z),
                new Vector3(pos.x - this.nodeSize, pos.y, pos.z),
                new Vector3(pos.x, pos.y, pos.z - this.nodeSize)
            ]);
        }
         // corner 7 (-x, +y, +z)
         else if (pos.equals(new Vector3(this.adjustmentX, -this.adjustmentY, -this.adjustmentZ)))
         {
             this.adjList.addVertex(new Vector3(pos.x, pos.y, pos.z), [
                 new Vector3(pos.x, pos.y + this.nodeSize, pos.z),
                 new Vector3(pos.x + this.nodeSize, pos.y, pos.z),
                 new Vector3(pos.x, pos.y, pos.z - this.nodeSize)
             ]);
         }
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
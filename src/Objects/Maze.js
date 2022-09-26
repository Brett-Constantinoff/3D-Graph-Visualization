import * as THREE from 'three';
import Node from './Node';
import Cube from './Cube'

export default class Maze extends Cube{
    /**
     * Constructor of Maze
     *
     * @param {hex} color color of the cube in hex
     * @param {hex} border color of the cube border in hex
     * @param {positive integer} initialSize initial scale of cube
     * @param {float} transparency alpha value of cube
     * @param {Vec3} postiion position of cube in world space
     */
    constructor(color, border, initialSize, transparency, position)
    {
       super(color, border, initialSize, transparency, position);
       this.nodes = new THREE.Group();
       this.nodeSize = 0.5;
    }

    /**
     * Adds new node at a given position to node group
     *
     * @param {Vec3} position position of node
     */
    addNode(position)
    {
        let node = new Node(0xFF0000, 0x000000, this.nodeSize, 0.10, position);
        this.nodes.add(node.getMesh());
    }

    /**
     * Currently just fills in entire maze
     */
    generate()
    {
        let adjustmentX = this.mesh.position.x - (this.size.x / 2) + (this.nodeSize / 2);
        let adjustmentY = this.mesh.position.y - (this.size.y / 2) + (this.nodeSize / 2);
        let adjustmentZ = this.mesh.position.z - (this.size.z / 2) + (this.nodeSize / 2);
        let position = new THREE.Vector3(adjustmentX, adjustmentY, adjustmentZ);

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
                position.y = adjustmentY;
                position.z += this.nodeSize;
            }
            if (i % (Math.pow(mazeSize.y, 2)) === 0 && i != 0)
            {
                position.x += this.nodeSize;
                position.y = adjustmentY;
                position.z = adjustmentZ;
            }

            this.addNode(position);
            position.y += this.nodeSize;
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
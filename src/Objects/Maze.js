import * as THREE from 'three';
import Node from './Node';
import Cube from './Cube'

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
            if (i % (mazeSize.y * mazeSize.z) === 0 && i != 0)
            {
                position.x += this.nodeSize;
                position.y = adjustmentY;
                position.z = adjustmentZ;
            }
            // make every second node opaque and yellow
        
            let node = new Node(0x6577B3, false, this.nodeSize, 0.25, position);
            
            this.nodes.add(node.getMesh());
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
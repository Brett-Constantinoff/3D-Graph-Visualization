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
            // start node 
            if (position.equals(new Vector3(this.adjustmentX, this.adjustmentY, this.adjustmentZ)))
            {
                node = new Node(0x48A14D, false, this.nodeSize, 1.0, position);
                this.start = position;
                
            }
            // end node
            else if (position.equals(new Vector3(-this.adjustmentX, -this.adjustmentY, -this.adjustmentZ)))
            {
                node = new Node(0x781f19, false, this.nodeSize, 1.0, position);
                this.end = node;
            }
            // wall
            else 
            {
                node = new Node(0x6577B3, false, this.nodeSize, 0.25, position);
            }
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
        // if node is not along the outside walls of maze
        if ((pos.x != this.adjustmentX && pos.x != -this.adjustmentX) &&  
             (pos.y != this.adjustmentY && pos.y != -this.adjustmentY) &&
             (pos.z != this.adjustmentZ && pos.z != -this.adjustmentZ))
        {
            this.adjList.addVertex(new Vector3(pos.x, pos.y, pos.z), [
                new Vector3(pos.x + this.adjustmentX, pos.y, pos.z),
                new Vector3(pos.x - this.adjustmentX, pos.y, pos.z),
                new Vector3(pos.x, pos.y + this.adjustmentY, pos.z),
                new Vector3(pos.x, pos.y - this.adjustmentY, pos.z),
                new Vector3(pos.x, pos.y, pos.z + this.adjustmentZ),
                new Vector3(pos.x, pos.y, pos.z - this.adjustmentZ),
            ])
        }
        // -z face
        else if (pos.z === this.adjustmentZ)
        {   
            this.handleZFace(1, pos);
        }
        // +z face
        else if (pos.z === -this.adjustmentZ)
        {
            this.handleZFace(-1, pos);
        }
        // -x face
        else if (pos.x === this.adjustmentX)
        {   
            this.handleXFace(1, pos);
        }
        // +z face
        else if (pos.x === -this.adjustmentX)
        {
            this.handleXFace(-1, pos);
        }
        // -y face
        else if (pos.y === this.adjustmentY)
        {   
            this.handleYFace(1, pos);
        }
        // +y face
        else if (pos.y === -this.adjustmentY)
        {
            this.handleYFace(-1, pos);
        }
    }

    /**
     * Finds neighbors for Z faces
     */
    handleZFace(direction, pos)
    {
        let n = [new Vector3(pos.x, pos.y, pos.z + this.nodeSize * direction)]
            
        // bottom right corner
        if ((pos.x === this.adjustmentX) && (pos.y === this.adjustmentY))
        {
            n.push(
                new Vector3(pos.x + this.nodeSize, pos.y, pos.z),
                new Vector3(pos.x, pos.y + this.nodeSize, pos.z)
            );
            this.adjList.addVertex(new Vector3(pos.x, pos.y, pos.z), n);
        }
        // bottom left corner
        else if ((pos.x === -this.adjustmentX) && (pos.y === this.adjustmentY))
        {
            n.push(
                new Vector3(pos.x - this.nodeSize, pos.y, pos.z),
                new Vector3(pos.x, pos.y + this.nodeSize, pos.z)
            );
            this.adjList.addVertex(new Vector3(pos.x, pos.y, pos.z), n);
        }
        // top right corner
        else if ((pos.y === -this.adjustmentY) && (pos.x === this.adjustmentX))
        {
            n.push(
                new Vector3(pos.x + this.nodeSize, pos.y, pos.z),
                new Vector3(pos.x, pos.y - this.nodeSize, pos.z)
            );
            this.adjList.addVertex(new Vector3(pos.x, pos.y, pos.z), n);
        }
        // top left corner
        else if ((pos.y === -this.adjustmentX) && (pos.x === -this.adjustmentX))
        {
            n.push(
                new Vector3(pos.x - this.nodeSize, pos.y, pos.z),
                new Vector3(pos.x, pos.y - this.nodeSize, pos.z)
            );
            this.adjList.addVertex(new Vector3(pos.x, pos.y, pos.z), n);
        }
        // bottom edge
        else if((pos.x < -this.adjustmentX && pos.x > this.adjustmentX) && pos.y === this.adjustmentY)
        {
            n.push(
                new Vector3(pos.x + this.nodeSize, pos.y, pos.z),
                new Vector3(pos.x - this.nodeSize, pos.y, pos.z),
                new Vector3(pos.x, pos.y + this.nodeSize, pos.z)
            );
            this.adjList.addVertex(new Vector3(pos.x, pos.y, pos.z), n);
        }
        // top edge
        else if((pos.x < -this.adjustmentX && pos.x > this.adjustmentX) && pos.y === -this.adjustmentY)
        {
            n.push(
                new Vector3(pos.x + this.nodeSize, pos.y, pos.z),
                new Vector3(pos.x - this.nodeSize, pos.y, pos.z),
                new Vector3(pos.x, pos.y - this.nodeSize, pos.z)
            );
            this.adjList.addVertex(new Vector3(pos.x, pos.y, pos.z), n);
        }
        // right edge
        else if((pos.y < -this.adjustmentY && pos.y > this.adjustmentY) && pos.x === this.adjustmentX)
        {
            n.push(
                new Vector3(pos.x + this.nodeSize, pos.y, pos.z),
                new Vector3(pos.x, pos.y + this.nodeSize, pos.z),
                new Vector3(pos.x, pos.y - this.nodeSize, pos.z)
            );
            this.adjList.addVertex(new Vector3(pos.x, pos.y, pos.z), n);
        }
        // left edge
        else if((pos.y < -this.adjustmentY && pos.y > this.adjustmentY) && pos.x === -this.adjustmentX)
        {
            n.push(
                new Vector3(pos.x - this.nodeSize, pos.y, pos.z),
                new Vector3(pos.x, pos.y + this.nodeSize, pos.z),
                new Vector3(pos.x, pos.y - this.nodeSize, pos.z)
            );
            this.adjList.addVertex(new Vector3(pos.x, pos.y, pos.z), n);
        }
        // middle of face
        else 
        {
            n.push(
                new Vector3(pos.x - this.nodeSize, pos.y, pos.z),
                new Vector3(pos.x + this.nodeSize, pos.y, pos.z),
                new Vector3(pos.x, pos.y + this.nodeSize, pos.z),
                new Vector3(pos.x, pos.y - this.nodeSize, pos.z)
            );
            this.adjList.addVertex(new Vector3(pos.x, pos.y, pos.z), n);
        }
    }

    /**
     * Finds neighbors for X faces
     */
    handleXFace(direction, pos)
    {
        let n = [new Vector3(pos.x + this.nodeSize * direction, pos.y, pos.z)];

        // top edge
        if ((pos.z > this.adjustmentZ && pos.z < -this.adjustmentZ) && pos.y === -this.adjustmentY)
        {
            n.push(
                new Vector3(pos.x, pos.y, pos.z + this.nodeSize),
                new Vector3(pos.x, pos.y, pos.z - this.nodeSize,),
                new Vector3(pos.x, pos.y - this.nodeSize, pos.z)
            );
            this.adjList.addVertex(new Vector3(pos.x, pos.y, pos.z), n);
        }
        //bottom edge
        else if ((pos.z > this.adjustmentZ && pos.z < -this.adjustmentZ) && pos.y === this.adjustmentY)
        {
            n.push(
                new Vector3(pos.x, pos.y, pos.z + this.nodeSize),
                new Vector3(pos.x, pos.y, pos.z - this.nodeSize,),
                new Vector3(pos.x, pos.y + this.nodeSize, pos.z)
            );
            this.adjList.addVertex(new Vector3(pos.x, pos.y, pos.z), n);
        }
        // middle of face
        else
        {
            n.push(
                new Vector3(pos.x, pos.y + this.nodeSize, pos.z),
                new Vector3(pos.x, pos.y - this.nodeSize, pos.z),
                new Vector3(pos.x, pos.y, pos.z + this.nodeSize),
                new Vector3(pos.x, pos.y, pos.z - this.nodeSize),

            );
            this.adjList.addVertex(new Vector3(pos.x, pos.y, pos.z), n);
        }
    }

    /**
     * Finds neighbors for Y faces
     */
    handleYFace(direction, pos)
    {
        // middle of face
        let n = [new Vector3(pos.x, pos.y + this.nodeSize * direction, pos.z)];
        n.push(
            new Vector3(pos.x + this.nodeSize, pos.y, pos.z),
            new Vector3(pos.x - this.nodeSize, pos.y, pos.z),
            new Vector3(pos.x, pos.y, pos.z + this.nodeSize),
            new Vector3(pos.x, pos.y, pos.z - this.nodeSize),

        );
        this.adjList.addVertex(new Vector3(pos.x, pos.y, pos.z), n);
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
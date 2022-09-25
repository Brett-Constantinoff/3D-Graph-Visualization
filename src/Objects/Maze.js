import * as THREE from 'three';
import Node from './Node';

export default class Maze{
    constructor(color, initialSize)
    {
        this.color = color;
        this.currentScale = 1;
        this.initialSize = this.size;
        this.currentScale = 1;
        this.maxSize = 50;
        this.size = initialSize;
        this.points = [];

        // not sure what to call this yet
        this.adjacencyList = [];

        // nodes for cube
        this.nodes = new THREE.Group()

        this.init();
    }

     /**
     * Creates the points neccessary to create the 
     * cube outline, dont need the top and bottom faces
     * 
     * Also will create all the nodes for the maze
     */
    init()
    {   
        // makes the (0, 0, 0) at the center of the cube
        this.adjustment = this.size / 2;

        // front face
        this.points.push(new THREE.Vector3(0 - this.adjustment, 0 - this.adjustment, 0 - this.adjustment));
        this.points.push(new THREE.Vector3(0 - this.adjustment,this.size - this.adjustment, 0 - this.adjustment));
        this.points.push(new THREE.Vector3(0 - this.adjustment,this.size - this.adjustment, 0 - this.adjustment));
        this.points.push(new THREE.Vector3(this.size - this.adjustment,this.size - this.adjustment, 0 - this.adjustment));
        this.points.push(new THREE.Vector3(this.size - this.adjustment,this.size - this.adjustment, 0 - this.adjustment));
        this.points.push(new THREE.Vector3(this.size - this.adjustment, 0 - this.adjustment, 0 - this.adjustment));
        this.points.push(new THREE.Vector3(0 - this.adjustment, 0 - this.adjustment, 0 - this.adjustment));

        // right face
        this.points.push(new THREE.Vector3(this.size - this.adjustment, 0 - this.adjustment, 0 - this.adjustment));
        this.points.push(new THREE.Vector3(this.size - this.adjustment,this.size - this.adjustment, 0 - this.adjustment));
        this.points.push(new THREE.Vector3(this.size - this.adjustment,this.size - this.adjustment, 0 - this.adjustment));
        this.points.push(new THREE.Vector3(this.size - this.adjustment,this.size - this.adjustment,this.size - this.adjustment));
        this.points.push(new THREE.Vector3(this.size - this.adjustment,this.size - this.adjustment,this.size - this.adjustment));
        this.points.push(new THREE.Vector3(this.size - this.adjustment, 0 - this.adjustment,this.size - this.adjustment));
        this.points.push(new THREE.Vector3(this.size - this.adjustment, 0 - this.adjustment, 0 - this.adjustment));

        // back face 
        this.points.push(new THREE.Vector3(this.size - this.adjustment, 0 - this.adjustment,this.size - this.adjustment));
        this.points.push(new THREE.Vector3(this.size - this.adjustment,this.size - this.adjustment,this.size - this.adjustment));
        this.points.push(new THREE.Vector3(this.size - this.adjustment,this.size - this.adjustment,this.size - this.adjustment));
        this.points.push(new THREE.Vector3(0 - this.adjustment,this.size - this.adjustment,this.size - this.adjustment));
        this.points.push(new THREE.Vector3(0 - this.adjustment,this.size - this.adjustment,this.size - this.adjustment));
        this.points.push(new THREE.Vector3(0 - this.adjustment, 0 - this.adjustment,this.size - this.adjustment));
        this.points.push(new THREE.Vector3(this.size - this.adjustment, 0 - this.adjustment,this.size - this.adjustment));

        // left face 
        this.points.push(new THREE.Vector3(0 - this.adjustment, 0 - this.adjustment,this.size - this.adjustment));
        this.points.push(new THREE.Vector3(0 - this.adjustment,this.size - this.adjustment,this.size - this.adjustment));
        this.points.push(new THREE.Vector3(0 - this.adjustment,this.size - this.adjustment,this.size - this.adjustment));
        this.points.push(new THREE.Vector3(0 - this.adjustment,this.size - this.adjustment, 0 - this.adjustment));
        this.points.push(new THREE.Vector3(0 - this.adjustment,this.size - this.adjustment, 0 - this.adjustment));
        this.points.push(new THREE.Vector3(0 - this.adjustment, 0 - this.adjustment, 0 - this.adjustment));
        this.points.push(new THREE.Vector3(0 - this.adjustment, 0 - this.adjustment,this.size - this.adjustment));

        // create material
        this.material = new THREE.LineBasicMaterial( 
            {
                color: this.color,
            }
        );
        // create geometry from lines
        this.geometry = new THREE.BufferGeometry().setFromPoints(this.points);
        // create mesh out of lines
        this.mesh = new THREE.Line(this.geometry, this.material);
    }

    /**
     * Currently fills out some of the maze
     * 
     * TODO: Actually use DFS to generate maze
     */
    generate()
    {
        // fill maze with nodes
        // start at bottom corner
        let start = new THREE.Vector3(0 - this.adjustment, 0 - this.adjustment, 0 - this.adjustment);
        for (let i = 0, j = 0, k = 0; i < Math.pow(this.size, 3); i++)
        {
            // skip 0
            if (i != 0)
            {
                // filled column along y
                if (i % this.size == 0)
                {
                    // if face is filled, fill next face
                    if (i % Math.pow(this.size, 2) == 0)
                    {
                        k++;
                        start.y = 0 - this.adjustment;
                        start.z = 0 - this.adjustment;
                        start.x += 1;
                    }
                    // fill next column
                    else
                    {
                        j++;
                        start.y = 0 - this.adjustment;
                        start.z += 1;
                    }
                }
            }
            // starting opacity
            this.nodeOpacity = 0.45;
            // only add every second node
            let condition = (i % 2 == 0 && j % 2 == 0 && k % 2 == 0);
            if (condition)
            {
                let node = new Node(start, 0xFFD580, 0.5, this.nodeOpacity);
                this.nodes.add(node.getMesh());
            }
            start.y += 1;
        }
    }

    /**
     * Currently clears the group of nodes of all the nodes
     */
    clear()
    {
        this.nodes.clear()

        // TODO: Reset other attributes of the graph
    }

    /**
     * Scale the maze along a given axis by a positive number
     * @param {value} number to scale the maze axis by
     * @param {axis} char axis to scale by
     */
     scale(value, axis)
     {
        if (axis.toLowerCase() === 'x')
        {
            if (value < this.currentScale.x)
            {
                value /= this.currentScale.x;
            }
            this.mesh.scale.set(value, this.mesh.scale.y, this.mesh.scale.z);
            this.currentScale = this.scale;
        }
        else if (axis.toLowerCase() === 'y')
        {
            if (value < this.currentScale.y)
            {
                value /= this.currentScale.y;
            }
            this.mesh.scale.set(this.mesh.scale.x, value, this.mesh.scale.z);
            this.currentScale = this.scale;
        }
        else
        {
            if (value < this.currentScale.z)
            {
                value /= this.currentScale.z;
            }
            this.mesh.scale.set(this.mesh.scale.x, this.mesh.scale.y, value);
            this.currentScale = this.scale;
        }
    

         //TODO: Scale all the nodes within the graph
         //this.nodes.scale.set(value, value, value);
     }
 
     /**
      * Returns the frame mesh for rendering
      * @return {mesh} mesh of the frame
      */
     getMesh()
     {
         return this.mesh;
     }

      /**
      * Returns nodes that make up the maze
      * @return {group} all of the nodes in the maze
      */
     getNodes()
     {
        return this.nodes;
     }

    /**
     * Returns the current frame size
     * @return {size} size of the frame
     */
    getSize()
    {
        return this.size;
    }


    /**
     * Sets the size of the maze, size as in length
     * @param {value} number new size
     */
    setSize(value)
    {
        this.size = value;
    }

    /**
     * Returns the initial frame size
     * @return {size} initial size of the frame
     */
    getInitialSize()
    {
        return this.initialSize;
    }
}
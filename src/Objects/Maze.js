import * as THREE from 'three';

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

        this.init();
    }

     /**
     * Creates the points neccessary to create the 
     * cube outline, dont need the top and bottom faces
     */
    init()
    {   
        // makes the (0, 0, 0) at the center of the cube
        let adjustment = this.size / 2;

        // front face
        this.points.push(new THREE.Vector3(0 - adjustment, 0 - adjustment, 0 - adjustment));
        this.points.push(new THREE.Vector3(0 - adjustment,this.size - adjustment, 0 - adjustment));
        this.points.push(new THREE.Vector3(0 - adjustment,this.size - adjustment, 0 - adjustment));
        this.points.push(new THREE.Vector3(this.size - adjustment,this.size - adjustment, 0 - adjustment));
        this.points.push(new THREE.Vector3(this.size - adjustment,this.size - adjustment, 0 - adjustment));
        this.points.push(new THREE.Vector3(this.size - adjustment, 0 - adjustment, 0 - adjustment));
        this.points.push(new THREE.Vector3(0 - adjustment, 0 - adjustment, 0 - adjustment));

        // right face
        this.points.push(new THREE.Vector3(this.size - adjustment, 0 - adjustment, 0 - adjustment));
        this.points.push(new THREE.Vector3(this.size - adjustment,this.size - adjustment, 0 - adjustment));
        this.points.push(new THREE.Vector3(this.size - adjustment,this.size - adjustment, 0 - adjustment));
        this.points.push(new THREE.Vector3(this.size - adjustment,this.size - adjustment,this.size - adjustment));
        this.points.push(new THREE.Vector3(this.size - adjustment,this.size - adjustment,this.size - adjustment));
        this.points.push(new THREE.Vector3(this.size - adjustment, 0 - adjustment,this.size - adjustment));
        this.points.push(new THREE.Vector3(this.size - adjustment, 0 - adjustment, 0 - adjustment));

        // back face 
        this.points.push(new THREE.Vector3(this.size - adjustment, 0 - adjustment,this.size - adjustment));
        this.points.push(new THREE.Vector3(this.size - adjustment,this.size - adjustment,this.size - adjustment));
        this.points.push(new THREE.Vector3(this.size - adjustment,this.size - adjustment,this.size - adjustment));
        this.points.push(new THREE.Vector3(0 - adjustment,this.size - adjustment,this.size - adjustment));
        this.points.push(new THREE.Vector3(0 - adjustment,this.size - adjustment,this.size - adjustment));
        this.points.push(new THREE.Vector3(0 - adjustment, 0 - adjustment,this.size - adjustment));
        this.points.push(new THREE.Vector3(this.size - adjustment, 0 - adjustment,this.size - adjustment));

        // left face 
        this.points.push(new THREE.Vector3(0 - adjustment, 0 - adjustment,this.size - adjustment));
        this.points.push(new THREE.Vector3(0 - adjustment,this.size - adjustment,this.size - adjustment));
        this.points.push(new THREE.Vector3(0 - adjustment,this.size - adjustment,this.size - adjustment));
        this.points.push(new THREE.Vector3(0 - adjustment,this.size - adjustment, 0 - adjustment));
        this.points.push(new THREE.Vector3(0 - adjustment,this.size - adjustment, 0 - adjustment));
        this.points.push(new THREE.Vector3(0 - adjustment, 0 - adjustment, 0 - adjustment));
        this.points.push(new THREE.Vector3(0 - adjustment, 0 - adjustment,this.size - adjustment));

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
     * Scales the frame by a positive number, 
     * the scale will always be uniform so no need to use
     * a vector. Will also scale all nodes within graph
     * @param {value} number to scale the frame by
     * @return {mesh} mesh of the frame
     */
     scale(value)
     {
         if (this.value < this.currentScale)
         {
             value /= this.currentScale;
         }
         this.mesh.scale.set(value, value, value);
         this.currentScale = this.scale;

         //TODO: Scale all the nodes within the graph
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
     * Returns the current frame size
     * @return {size} size of the frame
     */
    getSize()
    {
        return this.size;
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
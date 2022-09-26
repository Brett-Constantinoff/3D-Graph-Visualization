import * as THREE from 'three'

export default class Cube
{
    /**
     * Constructor of Cube
     *
     * @param {hex} color color of the cube in hex
     * @param {bool} border determines if cube should have a border
     * @param {positive integer} initialSize initial scale of cube
     * @param {float} transparency alpha value of cube
     * @param {Vec3} postiion position of cube in world space
     */
    constructor(color, border, size, transparency, position)
    {
        this.color = color;
        this.border = border;
        this.size = {
            x: size,
            y: size,
            z: size
        }
        this.transparency = transparency;
        this.position = position;

        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshPhongMaterial(
            {
                color: this.color,
                transparent: true,
                opacity: this.transparency,
            }
        )
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        
        // create a border but only add if required
        let edges = new THREE.EdgesGeometry(this.geometry);
        this.wireFrame = new THREE.LineSegments(edges, new THREE.LineBasicMaterial(
            {
                color:this.color
            }
        ));
        if (border)
        {
            this.mesh.add(this.wireFrame);
        }
    }

    /**
     * Returns cube mesh
     * @return {Mesh} cube mesh
     */
    getMesh()
    {
        return this.mesh;
    }

    /**
     * Returns cube wireframe
     * @return {Wireframe} cube wireframe
     */
    getWireFrame()
    {
        return this.wireFrame;
    }
}
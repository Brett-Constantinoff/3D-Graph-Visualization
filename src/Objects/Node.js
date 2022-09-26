import Cube from "./Cube";

export default class Node extends Cube
{
    /**
     * Constructor of Node
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
        // allow some separation between nodes
        this.mesh.scale.set(this.size.x * 0.95, this.size.y * 0.95, this.size.z * 0.95);

    }
}
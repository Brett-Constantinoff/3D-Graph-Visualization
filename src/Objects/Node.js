import Cube from "./Cube";

export default class Node extends Cube
{
    /**
     * Constructor of Node
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
        this.wireFrame.scale.set(0.98, 0.98, 0.98);
    }
}
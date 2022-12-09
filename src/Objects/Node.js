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
     * @param {string} type type of node
     */
    constructor(color, border, initialSize, transparency, position, type)
    {
        super(color, border, initialSize, transparency, position);
        this.type = type;
        this.visitied = false;
        this.parent = null;
        this.distance = Infinity;
        this.heuristic = Infinity;
        this.initialState = {
            type : type, 
            visited : false,
            parent : null, 
            distance : Infinity, 
            heuristic: Infinity,
            color : color, 
            transparency : transparency
        };
        // allow some separation between nodes
        this.mesh.scale.set(this.size.x * 0.95, this.size.y * 0.95, this.size.z * 0.95);
    }

    reset()
    {
        this.visitied = this.initialState.visited;
        this.parent = this.initialState.parent;
        this.distance = this.initialState.distance;
        this.heuristic = this.initialState.heuristic;
    }
}
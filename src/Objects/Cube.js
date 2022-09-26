import * as THREE from 'three'

export default class Cube
{
    /**
     * Constructor of Cube
     *
     * @param {hex} color color of the cube in hex
     * @param {hex} border color of the cube border in hex
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
                blending: THREE.CustomBlending,
                blendEquation: THREE.AddEquation,
                blendSrc: THREE.SrcAlphaFactor, 
                blendDst: THREE.OneMinusSrcAlphaFactor,
            }
        )
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        
        let edges = new THREE.EdgesGeometry(this.geometry);
        this.wireFrame = new THREE.LineSegments(edges, new THREE.LineBasicMaterial(
            {
                color:this.border
            }
        ));
        this.mesh.add(this.wireFrame);
        this.mesh.scale.set(this.size.x, this.size.y, this.size.z);
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
            this.mesh.scale.x = value;
            this.size.x = value;
        }
        else if (axis.toLowerCase() == 'y')
        {
            this.mesh.scale.y = value;
            this.size.y = value;
        }
        else
        {
            this.mesh.scale.z = value;
            this.size.z = value;
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
}
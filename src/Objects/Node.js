import * as THREE from 'three';

export default class Node
{
    constructor(position, color, size, opactiy)
    {
        this.position = position;
        this.color = color;
        this.size = size
        this.initialOpacity = opactiy;
        this.init()
    }

    /**
     * Iniitializes the inner cube node as a transparent 1 x 1 x 1 
     * cube
     */
    init()
    {
        this.geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
        this.material = new THREE.MeshPhongMaterial(
            {
                color: this.color,
                transparent: true,
                opacity: this.initialOpacity,
                blending: THREE.CustomBlending,
                blendEquation: THREE.AddEquation,
                blendSrc: THREE.SrcAlphaFactor, 
                blendDst: THREE.OneMinusSrcAlphaFactor,
            }
        )
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        let adjustment = this.size / 2;
        this.mesh.position.set(this.position.x + adjustment, this.position.y + adjustment, this.position.z + adjustment);
    }

    /**
     * Returns the nodes cube mesh
     * @return {mesh} mesh of the node
     */
    getMesh()
    {
        return this.mesh
    }
}
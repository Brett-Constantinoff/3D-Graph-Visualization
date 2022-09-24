import * as THREE from "three"

export default class Vertex
{
    // size is radius
    constructor(size, position)
    {
        this.geometry = new THREE.SphereGeometry(size, 32, 16);
        this.material = new THREE.MeshPhongMaterial(
            {
                color : 0xff00ff
            }
        );
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.x = position.x;
        this.mesh.position.y = position.y;
        this.mesh.position.z = position.z;
    }

    getMesh()
    {
        return this.mesh;
    }

    getPosition()
    {
        return this.mesh.position;
    }
}
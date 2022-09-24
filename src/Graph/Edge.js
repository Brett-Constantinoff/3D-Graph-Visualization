import * as THREE from "three";

export default class Edge
{
    constructor(a, b)
    {
        this.material = new THREE.LineBasicMaterial(
            {
                color : 0x000000
            }
        );
        this.points = [];
        const pointA = new THREE.Vector3(a.getPosition().x, a.getPosition().y, a.getPosition().z);
        const pointB = new THREE.Vector3(b.getPosition().x, b.getPosition().y, b.getPosition().z);

        this.points.push(pointA);
        this.points.push(pointB);
        this.geometry = new THREE.BufferGeometry().setFromPoints(this.points);

        this.mesh = new THREE.Line(this.geometry, this.material);
    }

    getMesh()
    {
        return this.mesh;
    }
}
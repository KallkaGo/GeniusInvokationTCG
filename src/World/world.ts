import Experience from "@/Tengine/experience";
import * as THREE from 'three'

export default class World {
  public experience;
  public scene;
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene

    const testMesh = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({
      color:'white',
      wireframe: true
    }))
    console.log(this.scene);
    this.scene.add(testMesh)
  }
}
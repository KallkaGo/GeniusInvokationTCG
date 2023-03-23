import * as CANNON from 'cannon-es'
import *  as THREE from 'three'
import Experience from '@/Tengine/experience';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils';

export default class PhysicalWorld {
  private world: CANNON.World;
  public experience;
  public diceBody;
  public dice;
  constructor(mesh: THREE.Mesh) {
    this.world = new CANNON.World()
    this.world.gravity.set(0, -9.82, 0)
    this.world.allowSleep = true
    this.dice =mesh
    this.experience = new Experience()
    /* Floor */
    const floorBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Plane(),
      position: new CANNON.Vec3(0, 1, 0)
    })
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
    this.world.addBody(floorBody)
    /* dice */
    const dice =this.setPhyDice(mesh)
    this.diceBody = new CANNON.Body({
      mass: 10,
      position:new CANNON.Vec3(2, 10, 0),
      shape:dice
    })
    this.world.addBody(this.diceBody)

  }
  setPhyDice(mesh: THREE.Mesh) {
    let geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', mesh.geometry.getAttribute('position'))
    geometry = mergeVertices(geometry)
    const position = (<THREE.BufferAttribute>(geometry.attributes.position)).array;
    const index = geometry.index!.array;
    const vertices = [];
    const faces = []
    /* 顶点 */
    for (let i = 0; i < position.length; i++) {
      vertices.push(
        new CANNON.Vec3(position[i], position[i + 1], position[i + 2])
      );
    }
    /*面 */
    for (let j = 0, len = index.length; j < len; j += 3) {
      faces.push([index[j], index[j + 1], index[j + 2]]);
    }
    return new CANNON.ConvexPolyhedron({vertices,faces})
  }
  updated() {
    this.world.step(1/60,this.experience.time?.delta ,3)
    this.dice.position.copy((this.diceBody.position) as any )
  }
}
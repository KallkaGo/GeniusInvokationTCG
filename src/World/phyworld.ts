import * as CANNON from 'cannon-es'
import *  as THREE from 'three'
import Experience from '@/Tengine/experience';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils';
import createDice from '@/utils/dice'


export default class PhysicalWorld {
  private world: CANNON.World;
  public experience;
  public objectsToUpdate: any[];
  constructor() {
    this.world = new CANNON.World()
    this.world.gravity.set(0, -9.82, 0)
    this.world.allowSleep = true
    this.experience = new Experience()
    this.objectsToUpdate = []

    /* Material */
    const defaultMaterial = new CANNON.Material('default')


    const mergeMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.1, //摩擦系数
        restitution: 0.4 //弹跳系数
      }
    )
    this.world.addContactMaterial(mergeMaterial)
    this.world.defaultContactMaterial = mergeMaterial
    // this.world.broadphase = new CANNON.SAPBroadphase(this.world)

    /* Floor */
    const floorBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Plane(),
      position: new CANNON.Vec3(0, 0.5, 0),
      material: defaultMaterial
    })
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)

    this.world.addBody(floorBody)
  

  }

  createBox(position: any) {
    //threejs
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({
      color: 'pink'
    })
    const mesh = new THREE.Mesh(geometry, material)

    this.experience.scene.add(mesh)
    //cannon
    const shape = new CANNON.Box(new CANNON.Vec3(1 / 2, 1 / 2, 1 / 2))

    const body = new CANNON.Body({
      mass: 1,
      shape: shape,
    })
    body.position.copy(position)
    this.world.addBody(body)
    this.objectsToUpdate.push({ mesh, body })

  }

  createDice(position: any) {
    //threejs
    const mesh = createDice()
    mesh.position.set(position.x,position.y,position.z)
    mesh.castShadow = true
    //cannon
    const dice = this.setPhyDice(mesh)
    const body = new CANNON.Body({
      mass: 1,
      shape: dice,
    })
    
    body.position.copy(position)
    body.angularVelocity.set(Math.random(), Math.random(), Math.random());
    body.velocity.set(0, -8, 0);
    this.experience.scene.add(mesh)
    this.world.addBody(body)
    this.objectsToUpdate.push({ mesh, body })
  }

  
  setPhyDice(mesh:any) {
    let geometry: any = new THREE.BufferGeometry()
    geometry.setAttribute('position', mesh.geometry.getAttribute('position'))
    geometry = mergeVertices(geometry)
    const position = (<THREE.BufferAttribute>(geometry.attributes.position)).array;
    const index = geometry.index.array;

    const vertices = [];
    const faces = []
    /* 顶点 */
    for (let i = 0; i < position.length; i += 3) {
      vertices.push(
        new CANNON.Vec3(position[i], position[i + 1], position[i + 2])
      );
    }
    /*面 */
    for (let j = 0, len = index.length; j < len; j += 3) {
      faces.push([index[j], index[j + 1], index[j + 2]]);
    }
    return new CANNON.ConvexPolyhedron({ vertices, faces })
  }
  update() {
    this.world.step(1 / 60, 16, 3)
    for (const object of this.objectsToUpdate) {
      object.mesh.position.copy(object.body.position)
      object.mesh.quaternion.copy(object.body.quaternion)
    }
  }

}
import * as CANNON from 'cannon-es'
import *  as THREE from 'three'
import Experience from '@/Tengine/experience';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils';
import createDice, { initPoints, getTopface } from '@/utils/dice'
import setOctahedron from '@/utils/setOctahedron'


const topFace: any[] = []
let flag: any = null
export default class PhysicalWorld {
  public world: CANNON.World;
  public experience;
  public objectsToUpdate: any[];
  public debug;
  public debugFolder;
  public debugObject: any;


  constructor() {
    this.world = new CANNON.World()
    this.world.gravity.set(0, -9.82, 0)
    this.world.allowSleep = true
    this.experience = new Experience()
    this.objectsToUpdate = []
    this.debug = this.experience.debug
    this.createPhyFloor()
    this.debugFolder = this.debug!.ui!.addFolder('Dice')
    this.debugObject = {
      emissive: '#FFFFFF',
      color: '#FFFFFF',
      emissiveIntensity: 0.3,
      throwDice: () => {
        this.experience.world.createModel(10, 8)
        flag = null
      }
    }
    this.debugFolder?.addColor(this.debugObject, 'emissive').onChange((value) => { this.setProperty(this.experience.scene.children, "emissive", value) })
    this.debugFolder?.addColor(this.debugObject, 'color').onChange((value) => { this.setProperty(this.experience.scene.children, "color", value) })
    this.debugFolder?.add(this.debugObject, 'emissiveIntensity').min(0).max(5).step(0.01).onChange((value) => { this.setProperty(this.experience.scene.children, "emissiveIntensity", value) })
    this.debugFolder?.add(this.debugObject, 'throwDice')
  }
  setProperty(target: any[], arg: string, value: string) {
    console.log(target);
    for (const item of target) {
      if (item.type === 'Group' && Array.isArray(item.children)) {
        item.children.forEach((element: any) => {
          console.log(value);
          if (element.name === 'dice') {
            element.material.forEach((item: any) => {
              const val = typeof value === 'number' ? value : new THREE.Color(value)
              item[arg] = val
            })
          }
        });
      }
    }
  }


  createPhyFloor() {
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
    // const mesh = createDice()
    // mesh.position.set(position.x, position.y, position.z)
    const geometry = createDice()
    setOctahedron(geometry)
    const faceTex = [
      {
        element: "primogem",
        color: "#38383c",
      },
      {
        element: "anemo",
        color: "#54b6a5",
      },
      {
        element: "geo",
        color: "#3c2d22",
      },
      {
        element: "electro",
        color: "#522552",
      },
      {
        element: "dendro",
        color: "#5fcc66",
      },
      {
        element: "hydro",
        color: "#24236c",
      },
      {
        element: "pyro",
        color: "#8f3e43",
      },
      {
        element: "cryo",
        color: "#95dae4",
      }
    ]
    // const materials = [
    //   new THREE.MeshStandardMaterial({ map: this.experience.resource.items.pyroTex, color: '#c81a1a' }),
    //   new THREE.MeshStandardMaterial({ map: this.experience.resource.items.anemoTex, color: '#095f44' }),
    //   new THREE.MeshStandardMaterial({ map: this.experience.resource.items.cryoTex, color: '#1fbbbb' }),
    //   new THREE.MeshStandardMaterial({ map: this.experience.resource.items.electroTex, color: '#871b87' }),
    //   new THREE.MeshStandardMaterial({ map: this.experience.resource.items.geoTex, color: '#3f2205' }),
    //   new THREE.MeshStandardMaterial({ map: this.experience.resource.items.dendroTex, color: '#118111' }),
    //   new THREE.MeshStandardMaterial({ map: this.experience.resource.items.hydroTex, color: '#1818c9' }),
    //   new THREE.MeshStandardMaterial({ map: this.experience.resource.items.primogemTex, color: '#111111' })
    // ]

    const materials = faceTex.map((item) => {
      const texture = this.experience.resource.items[`${item.element}Tex`]
      const textureB = this.experience.resource.items[`${item.element}TexB`]
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      texture.center.set(0.5, 0.5)
      texture.repeat.set(2, 2)
      texture.rotation = -Math.PI / 6
      textureB.magFilter = THREE.NearestFilter;
      textureB.minFilter = THREE.NearestFilter;
      textureB.center.set(0.5, 0.5)
      textureB.repeat.set(3, 3)
      texture.rotation = -Math.PI / 6
      return new THREE.MeshLambertMaterial(
        {
          map: textureB,
          side: THREE.DoubleSide,
          emissive: this.debugObject?.emissive,
          color: this.debugObject?.color,
          emissiveIntensity: 0.3,
          emissiveMap: texture
        })

    })
    //   const material = new THREE.MeshBasicMaterial({
    //   vertexColors: true, 
    //   side: THREE.DoubleSide,
    // });
    const mesh = new THREE.Mesh(geometry, materials)
    mesh.name = 'dice'
    mesh.castShadow = true
    const group = initPoints(mesh)
    // mesh.position.copy(position)
    group.position.copy(position)
    // group.position.set(position.x, position.y, position.z)
    // mesh.position.set(position.x, position.y, position.z)
    // this.experience.scene.add(mesh)
    this.experience.scene.add(group)
    //cannon
    // const dice = this.setPhyDice(mesh)
    const dice = this.setPhyDice(group.children[0])
    const body = new CANNON.Body({
      mass: 10,
      shape: dice,
    })

    body.position.copy(position)
    body.angularVelocity.set(Math.random(), Math.random(), Math.random());
    body.velocity.set(0, -8, 0);
    body.addEventListener('collide', (value: any) => { this.playHitSound(value) })
    this.world.addBody(body)
    this.objectsToUpdate.push({ mesh: group, body })
  }


  setPhyDice(mesh: any) {
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

  playHitSound(collision: any) {
    const strength = collision.contact.getImpactVelocityAlongNormal()
    if (strength > 6 && !this.experience.world.dicesound.isPlaying) {


      this.experience.world.dicesound.play()
    }
  }
  isBodyStill(body: CANNON.Body) {
    const EPSILON = 0.01; // 阈值
    const v = body.velocity;
    const w = body.angularVelocity;
    return v.almostZero(EPSILON) && w.almostZero(EPSILON);
  }

  checkAllBodiesStopped(world: CANNON.World) {
    let allBodiesStopped = true;

    world.bodies.forEach((body) => {
      if (!body.sleepState) {
        allBodiesStopped = false;
      }
    });

    return allBodiesStopped;
  }


  update() {
    this.world.step(1 / 60, 16, 3)
    for (const object of this.objectsToUpdate) {
      object.mesh.position.copy(object.body.position)
      object.mesh.quaternion.copy(object.body.quaternion)
    }
    if (this.checkAllBodiesStopped(this.world) && this.objectsToUpdate.length) {
      if (!flag) {
        this.objectsToUpdate.forEach((item) => {
          const tmp = getTopface(item.mesh)
          topFace.push(tmp)
        })
        console.log(topFace);
        flag = true
      }
    }
  }

}
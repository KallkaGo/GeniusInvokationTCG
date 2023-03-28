import Experience from "@/Tengine/experience";
import { SphereGeometry, ShaderMaterial, Mesh, Vector2, IcosahedronGeometry, DoubleSide, Vector3, PlaneGeometry, BoxGeometry, MeshStandardMaterial } from 'three'

import Floor from "../components/floor";
import PhyWorld from './phyworld'
import vertexShader from './shader/vertex.glsl'
import fragmentShader from './shader/fragment.glsl'
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";


export default class World {
  public experience;
  public scene;
  public floor: any;
  public physicalWorld!: PhyWorld;
  public resource;
  public effectComposer!: EffectComposer;
  public mesh: any;

  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resource = this.experience.resource



    /* 
  资源文件加载完毕 渲染场景
    */
    this.resource?.on('ready', () => {
      this.floor = new Floor()
      this.scene.add(this.floor.mesh)
      this.physicalWorld = new PhyWorld()
      this.createModel(10, 8)
    })

  }

  createModel(height: number, count: number) {
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 10 + 0.5
      const y = height
      const z = (Math.random() - 0.5) * 10 + 0.5
      const position = new Vector3(x, y, z)
      // this.physicalWorld.createBox(position)
      this.physicalWorld.createDice(position)
    }
  }

}
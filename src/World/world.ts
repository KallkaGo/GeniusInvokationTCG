import Experience from "@/Tengine/experience";
import { SphereGeometry, ShaderMaterial, Mesh, Vector2, IcosahedronGeometry, DoubleSide, Vector3, PlaneGeometry } from 'three'
import createDice from '@/utils/dice'
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
  public physicalWorld: any;
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

      const dice = createDice()
      dice.castShadow =true
      dice.position.set(2, 10, 0)
      this.scene.add(dice)
      this.floor = new Floor()
      this.scene.add(this.floor.mesh)
      this.physicalWorld = new PhyWorld(dice)

    })

  }


}
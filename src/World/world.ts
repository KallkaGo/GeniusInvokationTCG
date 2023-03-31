import Experience from "@/Tengine/experience";
import { AudioListener, Vector3, Audio } from 'three'

import Floor from "../components/floor";
import PhyWorld from './phyworld'
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
  public throwaudio: any;
  public diceaudio: any;
  public throwsound: any;
  public dicesound: any;



  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resource = this.experience.resource



    /* 
  资源文件加载完毕 渲染场景
    */
    this.resource?.on('ready', () => {
      console.log('加载完成');
      this.floor = new Floor()
      this.scene.add(this.floor.mesh)
      this.physicalWorld = new PhyWorld()
      this.throwaudio = new AudioListener()
      this.diceaudio = new AudioListener()
      this.throwsound = new Audio(this.throwaudio)
      this.dicesound = new Audio(this.diceaudio)
      this.dicesound.setBuffer(this.resource.items['diceLightenSE'])
      this.throwsound.setBuffer(this.resource.items['diceRollSE'])
      this.dicesound.setLoop(false)
    })

  }

  createModel(height: number, count: number) {
    for (const item of this.physicalWorld.objectsToUpdate) {
      item.body.removeEventListener('collide', this.physicalWorld.playHitSound)
      //Remove Body
      this.physicalWorld.world.removeBody(item.body)

      //Remove Mesh
      this.scene.remove(item.mesh)
    }
    this.physicalWorld.objectsToUpdate = []
    for (let i = 0; i < count; i++) {
      let tmp = new Vector3(-5, height, 0)
      const x = tmp.x + Math.random() * 10 + 1
      const y = height
      const z = tmp.z + Math.random() * 10 + 0.5
      const position = new Vector3(x, y, z)
      this.physicalWorld.createDice(position)
      tmp = new Vector3(x, y, z)
    }
    if (!this.throwsound.isPlaying) {
      this.throwsound.play()
    }
  }

}
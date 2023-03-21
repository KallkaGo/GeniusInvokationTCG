import { Scene, AmbientLight, Light, SpotLight } from 'three'
import Sizes from './sizes'
import Time from './time'
import Camera from './camera';
import Control from './control';
import Render from './renderer';
import World from '@/World/world';
import Resource from './resources';
import resourceList from './resourceList';

let instance: any = null

export default class Experience {
  public canvas;
  public sizes;
  public time;
  public camera;
  public scene!: Scene;
  public control!: any;
  public render;
  public world;
  public ambient!: Light;
  public spotLight!: Light;
  public resource;
  constructor(canvas?: HTMLCanvasElement) {

    /*  
    让其他类也可以访问该类 且不会重复创建实例
    */
    if (instance) {
      return instance
    }
    // Global access
    window.experience = this
    instance = this
    this.canvas = canvas
    this.sizes = new Sizes()
    this.time = new Time()
    this.scene = new Scene()
    this.resource = new Resource(resourceList)
    this.camera = new Camera()
    this.control = new Control()
    this.render = new Render()
    this.world = new World()


    /* 灯光 */
    this.setLight()

    this.sizes.on('resize', () => {
      this.resize()
    })
    // Time tick event
    this.time.on('tick', () => {
      this.update()
    })
  }
  setLight() {
    this.ambient = new AmbientLight(0x666666)
    this.spotLight = new SpotLight(0xffffff)
    this.spotLight.position.set(20, 220, 100)
    this.spotLight.castShadow = true
    this.spotLight.shadow.mapSize.width = 1024
    this.spotLight.shadow.mapSize.height = 1024
    this.scene.add(this.ambient)
    this.scene.add(this.spotLight)
  }


  resize() {
    this.camera?.resize()
    this.render?.resize()

  }
  update() {
    this.control?.updated()
    this.render?.update()
  }
}



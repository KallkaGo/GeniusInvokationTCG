import { Scene, AmbientLight, Light, SpotLight, Vector3, Mesh } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Sizes from './sizes'
import Time from './time'
import Camera from './camera';
import Control from './control';
import Render from './renderer';
import World from '@/World/world';
import Resource from './resources';
import resourceList from './resourceList';
import Debug from '@/utils/debug';

let instance: any = null

export default class Experience {
  public canvas;
  public sizes;
  public time;
  public camera;
  public scene!: Scene;
  public control!: Control;
  public render;
  public world?: any;
  public ambient!: Light;
  public spotLight!: Light;
  public resource?: any;
  public debug;
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
    this.debug = new Debug()
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
      if (this.world.physicalWorld) {
        this.world.physicalWorld.update()
      }

    })


  }
  setLight() {
    this.ambient = new AmbientLight(0x666666)
    this.spotLight = new SpotLight(0xffffff, 0.5, 5000)
    this.spotLight.position.set(20, 200, 0)
    this.spotLight.castShadow = true
    this.spotLight.shadow.mapSize.width = 2048
    this.spotLight.shadow.mapSize.height = 2048
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
  dispose() {
    this.sizes?.off('resize')
    this.time?.off('tick')
    /* 销毁场景里的几何体 材质等 */
    this.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.geometry.dispose()
        for (const key of child.material) {
          const value = child.material[key]
          if (value && typeof value.dispose === 'function') {
            value.dispose()
          }
        }
      }
    })

    /* 销毁轨道控制器 */
    this.control.instance.dispose()

  }

}



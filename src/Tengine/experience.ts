import { Scene } from 'three'
import Sizes from './sizes'
import Time from './time'
import Camera from './camera';
import Control from './control';
import Render from './renderer';
import World from '@/World/world';

let instance: any = null

export default class Experience {
  public canvas;
  public sizes;
  public time;
  public camera;
  public scene!: Scene;
  public control!:any;
  public render;
  public world;
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
    this.camera = new Camera()
    this.control = new Control()
    this.render = new Render()
    this.world = new World()


    this.sizes.on('resize', () => {
      this.resize()
    })
     // Time tick event
     this.time.on('tick', () =>
     {
         this.update()
     })
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



import Experience from "./experience";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Camera from './camera';
export default class Control {
  public instance!: OrbitControls;
  public camera:Camera;
  public experience;
  public canvas;
  constructor() {
    this.experience = new Experience()
    this.camera = this.experience.camera!
    this.canvas = this.experience.canvas
    this.setOrbitControls()

  }
  setOrbitControls(){
    this.instance = new OrbitControls(this.camera.instance,this.canvas)
    this.instance.enableDamping = true
    // this.instance.autoRotate =true
  }
  updated() {
      this.instance.update()
  }

}
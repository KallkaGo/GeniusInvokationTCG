import Experience from "./experience";
import { Scene, PerspectiveCamera } from 'three'

export default class Camera {
  public experience;
  public sizes;
  public scene: Scene
  public instance!: PerspectiveCamera
  constructor() {
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.setPerspectiveCamera()

  }
  setPerspectiveCamera() {
    this.instance = new PerspectiveCamera(45, this.sizes!.width / this.sizes!.height, 0.1, 1000)
    this.instance.position.set(6, 15, 30)
    this.scene.add(this.instance)
  }

  resize(){
    this.instance.aspect = this.sizes!.width/this.sizes!.height
    this.instance.updateProjectionMatrix()
  }

}
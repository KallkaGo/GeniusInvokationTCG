import { WebGLRenderer, CineonToneMapping, sRGBEncoding, PCFSoftShadowMap } from 'three'
import Experience from './experience';
export default class Render {
  public instance!: WebGLRenderer;
  private experience;
  private canvas;
  private sizes;
  private scene;
  private camera;
  constructor() {
    this.experience = new Experience()
    this.canvas = this.experience.canvas
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.camera = this.experience.camera
    this.setRenderer()
  }
  setRenderer() {
    this.instance = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    })
    this.instance.toneMapping = CineonToneMapping
    this.instance.outputEncoding = sRGBEncoding
    this.instance.shadowMap.enabled = true
    this.instance.shadowMap.type = PCFSoftShadowMap
    this.instance.setSize(this.sizes!.width, this.sizes!.height)
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  }
  resize() {
    this.instance.setSize(this.sizes!.width, this.sizes!.height)
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
  update() {
    this.instance.render(this.scene, this.camera!.instance)
  }
}
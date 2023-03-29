import { WebGLRenderer, CineonToneMapping, sRGBEncoding, PCFSoftShadowMap,LinearToneMapping } from 'three'
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
    this.instance.toneMapping = LinearToneMapping
    this.instance.outputEncoding = sRGBEncoding
    this.instance.shadowMap.enabled = true
    this.instance.shadowMap.type = PCFSoftShadowMap
    this.instance.setClearColor(0xb9d3ff, 1)
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
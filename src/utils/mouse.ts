import * as THREE from 'three'
import Experience from "@/Tengine/experience";
import Raycaster from '@/utils/raycaster'


export default class Mouse {
  public mouse;
  public sizes;
  public raycaster;
  public exprience;
  constructor() {
    this.mouse = new THREE.Vector2()
    this.exprience = new Experience()
    this.sizes = this.exprience.sizes
    this.raycaster = new Raycaster()
    this.getMousePosition()
    window.addEventListener('click', () => this.handleClick())
  }

  getMousePosition() {
    window.addEventListener('mousemove', (e: MouseEvent) => {
      this.mouse.x = e.clientX / this.sizes!.width * 2 - 1
      this.mouse.y = -(e.clientY / this.sizes!.height) * 2 + 1
    })
  }

  handleClick() {
    this.raycaster.instance.setFromCamera(this.mouse, this.exprience.camera!.instance)
    const intersects = this.raycaster.instance.intersectObjects(this.exprience.scene.children)
    if (intersects.length) {
      if (intersects[0].object.parent!.name === 'dice') {
        intersects[0].object.parent!.visible =false
        this.exprience.world.physicalWorld.LockSelectDice(intersects[0].object.parent)
      }
    }
  }
}
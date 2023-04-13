import * as THREE from 'three'
import Experience from "@/Tengine/experience";
import Raycaster from '@/utils/raycaster'
import EffectComposerClass from './effectcomposer';

export default class Mouse {
  public mouse;
  public sizes;
  public raycaster;
  public exprience;
  public effectComposer;
  public world;

  constructor() {
    this.mouse = new THREE.Vector2()
    this.exprience = new Experience()
    this.sizes = this.exprience.sizes
    this.world = this.exprience.world
    this.raycaster = new Raycaster()
    this.effectComposer = new EffectComposerClass()
    this.getMousePosition()
    window.addEventListener('click', () => this.handleClick())
  }

  getMousePosition() {
    window.addEventListener('mousemove', (e: MouseEvent) => {
      this.mouse.x = e.clientX / this.sizes!.width * 2 - 1
      this.mouse.y = -(e.clientY / this.sizes!.height) * 2 + 1
      this.raycaster.instance.setFromCamera(this.mouse, this.exprience.camera!.instance)
      this.insertDice(true, false)
    })
  }

  handleClick() {

    this.insertDice(false, true)
  }

  insertDice(outline: boolean, visible: boolean) {

    if (this.world.physicalWorld && this.world.physicalWorld.checkAllBodiesStopped(this.world.physicalWorld.world)) {
      const intersects = this.raycaster.instance.intersectObjects(this.exprience.scene.children)
      if (intersects.length && intersects[0].object.parent!.name === 'dice') {
        const selectObject = intersects[0].object.parent
        const selectArr = []
        selectArr.push(intersects[0].object.parent)
        visible === true ? intersects[0].object.parent!.visible = false : null
        visible === true ? this.LockDice(selectObject) : null
        outline === true ? this.effectComposer.outlinePass.selectedObjects = selectArr : null
      }
    }

  }
  LockDice(selectObject: any) {
    this.exprience.world.physicalWorld.LockSelectDice(selectObject)
  }
}
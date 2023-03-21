import Experience from "@/Tengine/experience";
import createDice from '@/utils/dice'
import Floor from "../components/floor";
import PhyWorld from './phyworld'


export default class World {
  public experience;
  public scene;
  public floor: any;
  public physicalWorld: any;
  public resource;

  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resource = this.experience.resource
    /* 
  资源文件加载完毕 渲染场景
    */
    this.resource?.on('ready', () => {
      
      const dice = createDice()
      dice.position.set(2, 5, 0)
      this.scene.add(dice)
      this.floor = new Floor()
      this.scene.add(this.floor.mesh)
      this.physicalWorld = new PhyWorld()

    })

  }
}
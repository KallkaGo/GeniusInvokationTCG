import { BufferGeometry, Material, Mesh, BoxGeometry, MeshPhongMaterial } from 'three'

export default class Floor {
  public geometry: BufferGeometry;
  public material: Material;
  public mesh: Mesh;
  constructor() {
    this.geometry = new BoxGeometry(200, 100)
    this.material = new MeshPhongMaterial({
      color: 0x845EC2,
    })
    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.receiveShadow = true
    this.mesh.rotateX(-Math.PI / 2)
  }
}
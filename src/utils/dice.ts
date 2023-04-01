import * as THREE from 'three'
export default function createDice() {
  const rgb_arr = [
    [161, 178, 74],
    [255, 150, 75],
    [176, 103, 208],
    [219, 168, 79],
    [20, 204, 238],
    [109, 210, 192],
    [166, 228, 241],
    [255, 255, 255],
  ];
  const color_arr: any[] = [];
  rgb_arr.map((val_arr) => {
    for (let i = 0; i < 3; i++) {
      val_arr.map((val) => {
        color_arr.push(val / 255);
      });
    }
  });
  const geometry = new THREE.OctahedronGeometry(1)
  const color = new Float32Array(color_arr);
  geometry.attributes.color = new THREE.BufferAttribute(color, 3);
  // const material = new THREE.MeshBasicMaterial({
  //   // vertexColors: true, 
  //   side: THREE.DoubleSide,
  // });
  // const polyhedron_mesh = new THREE.Mesh(geometry, material);

  return geometry
}


const createBasicMesh = (position: Array<number>, name: string) => {
  const geometry = new THREE.BufferGeometry()
  const vertices = new Float32Array([0, 0, 0])
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  const mesh = new THREE.Mesh(geometry)
  const [x, y, z] = position
  mesh.position.set(x, y, z)
  mesh.name = name
  return mesh
}


const initPoints = (mesh: THREE.Mesh) => {
  const group = new THREE.Group()
  group.add(mesh)
  group.name = 'dice'
  group.add(createBasicMesh([1, 1, 1], 'universal'))
  group.add(createBasicMesh([-1, 1, 1], 'ice'))
  group.add(createBasicMesh([1, -1, 1], 'wind'))
  group.add(createBasicMesh([-1, -1, 1], 'fire'))
  group.add(createBasicMesh([1, 1, -1], 'thunder'))
  group.add(createBasicMesh([-1, 1, -1], 'grass'))
  group.add(createBasicMesh([-1, -1, -1], 'water'))
  group.add(createBasicMesh([1, -1, -1], 'rock'))
  return group
}


const getTopface = (group: THREE.Group) => {
  let topFace, max = 0
  group.children.forEach((item) => {
    /* 
    更新模型的世界矩阵,一般情况下，渲染器的 render() 方法会自动更新场景中所有物体的全局变换矩阵，
    因此不需要显式地调用 Object3D.updateMatrixWorld() 方法。
    但是，如果在渲染过程中发现物体的位置或方向不正确，或者需要进行拾取或碰撞检测等操作，
    那么可能需要手动调用 updateMatrixWorld() 方法来更新物体的全局变换矩阵，
    以确保它们能够正确地显示和交互。
    */
    item.updateMatrixWorld() 
    let worldPosition = new THREE.Vector3()
    //将结果复制到worldPosition中
    item.getWorldPosition(worldPosition)
    if (max < worldPosition.y) {
      max = worldPosition.y
      topFace = item
    }
  })
  return topFace
}


export {
  createBasicMesh,
  initPoints,
  getTopface
}
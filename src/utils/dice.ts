import * as THREE from 'three'

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
const color_arr:any[] = [];
rgb_arr.map((val_arr) => {
  for (let i = 0; i < 3; i++) {
    val_arr.map((val) => {
      color_arr.push(val / 255);
    });
  }
});
const color = new Float32Array(color_arr);
const geometry = new THREE.OctahedronGeometry()
geometry.attributes.color = new THREE.BufferAttribute(color, 3);
const material = new THREE.MeshLambertMaterial({
  vertexColors: true, 
  side: THREE.DoubleSide,
});
export const polyhedron_mesh = new THREE.Mesh(geometry, material);


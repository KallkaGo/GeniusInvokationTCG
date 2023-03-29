import * as THREE from 'three'
function setOctahedron(g:THREE.BufferGeometry) {
  let pos = g.attributes.position;
  let faces = pos.count / 3;
  let groupStart = 0;
  for (let i = 0; i < faces; i++) {
    g.addGroup(groupStart, 3, i);
    groupStart += 3;
  }
  let uvs = [];
  uvs.push(0.5,1,0.06698729810778059,0.25,0.9330127018922194,0.25);
  uvs.push(0.06698729810778059,0.75,0.5,0,0.9330127018922194,0.75);
  uvs.push(0.5,0,0.9330127018922194,0.75,0.06698729810778059,0.75);
  uvs.push(0.9330127018922194,0.25,0.5,1,0.06698729810778059,0.25);
  uvs.push(0.5,1,0.06698729810778059,0.25,0.9330127018922194,0.25);
  uvs.push(0.06698729810778059,0.75,0.5,0,0.9330127018922194,0.75);
  uvs.push(0.5,0,0.9330127018922194,0.75,0.06698729810778059,0.75);
  uvs.push(0.9330127018922194,0.25,0.5,1,0.06698729810778059,0.25);
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
}


export default setOctahedron
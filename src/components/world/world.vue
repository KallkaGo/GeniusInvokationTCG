<template>
  <canvas class="webgl"></canvas>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {polyhedron_mesh} from '@/utils/dice'


const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
onMounted(() => {
  /* 
  canvas
*/
  const canvas = document.querySelector('.webgl') as HTMLCanvasElement
  

  /* 
  physical world
  */
  const world = new CANNON.World();
  world.gravity.set(0, -9.82, 0);
  world.allowSleep = true;
  const floorBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane(),
    position: new CANNON.Vec3(0, 3, 0),
  })

  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
  world.addBody(floorBody)


  /* 
  Scene
  */
  const scene = new THREE.Scene()
  /* Mesh */
  const geometry = new THREE.BoxGeometry(300, 300, 5); //创建一个立方体几何对象Geometry
  const material = new THREE.MeshPhongMaterial({
    color: 0x845EC2,
  }); //材质对象Material
  const desk = new THREE.Mesh(geometry, material); //网格模型对象Mesh
  desk.receiveShadow = true;
  desk.rotateX(Math.PI * 0.5)
  scene.add(desk);
  polyhedron_mesh.position.set(0,3,0)
  scene.add(polyhedron_mesh)


  //聚光灯
  const light = new THREE.SpotLight(0xffffff);
  light.position.set(20, 220, 100); //光源位置
  light.castShadow = true;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  scene.add(light); //点光源添加到场景中
  //环境光
  const ambient = new THREE.AmbientLight(0x666666);
  scene.add(ambient);


  /* 
  camera
  */
  const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)

  camera.position.set(6, 10, 20)



  /* 
renderer
*/
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  })

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0xb9d3ff, 1)

  /* 
  Control
  */
  const controls = new OrbitControls(camera, canvas)

  controls.enableDamping = true

  /* 
  CLock
  */
  const Clock = new THREE.Clock()

  /* 
  resize
  */
  window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
  })



  /* 
  Animate
  */

  const animate = () => {
    const elapedTime = Clock.getElapsedTime()
    const deltaTime = Clock.getDelta()
    world.step(1 / 60, deltaTime, 3)

    /* 
    Update Control 
    */
    controls.update()
    /* 
    Uodate physical
    */

    renderer.render(scene, camera)
    requestAnimationFrame(animate)

  }

  animate()
})



</script>

<style scoped></style>

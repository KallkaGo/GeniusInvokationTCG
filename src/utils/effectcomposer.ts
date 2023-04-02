import * as THREE from 'three'
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import Experience from "@/Tengine/experience";
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'


export default class EffectComposerClass {
  public composer: any;
  public renderder;
  public experience;
  public outlinePass: any;
  constructor() {
    this.experience = new Experience()
    this.renderder = this.experience.render!.instance
    this.InitComposer()
  }
  InitComposer() {
    this.composer = new EffectComposer(this.renderder)
    const renderpass = new RenderPass(this.experience.scene, this.experience.camera!.instance)
    this.composer.addPass(renderpass)
    this.outlinePass = new OutlinePass(
      new THREE.Vector2(this.experience.sizes!.width, this.experience.sizes!.height),
      this.experience.scene,
      this.experience.camera!.instance)
    this.composer.addPass(this.outlinePass)
    this.outlinePass.edgeStrength = 5;//边缘强度
    this.outlinePass.edgeGlow = 1;//缓缓接近
    this.outlinePass.edgeThickness = 2;//边缘厚度
    this.outlinePass.pulsePeriod = 1; //脉冲周期

    /* 伽马矫正 */
    const gammaCorrectionPass  = new ShaderPass(GammaCorrectionShader)
    this.composer.addPass(gammaCorrectionPass)

    const effectFXAA  = new ShaderPass( FXAAShader )
    effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
		this.composer.addPass( effectFXAA );


  }
  updated() {
    this.composer.render()
  }
}
import * as THREE from "three";
import * as kokomi from "kokomi.js";
import type * as STDLIB from "three-stdlib";
import * as CANNON from "cannon-es";

import type createSketch from "@/sketches/entries/genshinDice";

// import diceVertexShader from "./shaders/vertex.glsl";
// import diceFragmentShader from "./shaders/fragment.glsl";

const diceVertexShader = `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

void main(){
    vec3 p=position;
    
    csm_Position=p;
    
    vUv=uv;
}
`;

const diceFragmentShader = `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform vec3 uElementColor;
uniform sampler2D uElementTex;
uniform float uUvRotate;
uniform float uUvScale;
uniform float uUvFlipX;
uniform float uUvFlipY;
uniform vec2 uUvTx;
uniform vec2 uUvSkew;
uniform float uBrightness;

vec2 rotateUV(vec2 uv,float rotation)
{
    float mid=.5;
    return vec2(
        cos(rotation)*(uv.x-mid)+sin(rotation)*(uv.y-mid)+mid,
        cos(rotation)*(uv.y-mid)-sin(rotation)*(uv.x-mid)+mid
    );
}

vec2 rotateUV(vec2 uv,float rotation,vec2 mid)
{
    return vec2(
        cos(rotation)*(uv.x-mid.x)+sin(rotation)*(uv.y-mid.y)+mid.x,
        cos(rotation)*(uv.y-mid.y)-sin(rotation)*(uv.x-mid.x)+mid.y
    );
}

vec2 rotateUV(vec2 uv,float rotation,float mid)
{
    return vec2(
        cos(rotation)*(uv.x-mid)+sin(rotation)*(uv.y-mid)+mid,
        cos(rotation)*(uv.y-mid)-sin(rotation)*(uv.x-mid)+mid
    );
}

float blendScreen(float base,float blend){
    return 1.-((1.-base)*(1.-blend));
}

vec4 blendScreen(vec4 base,vec4 blend){
    return 1.-((1.-base)*(1.-blend));
}

vec2 scaleUv(vec2 u,float scale){
    u=2.*u-1.;
    u/=scale;
    u=(u+1.)*.5;
    return u;
}

vec2 flipUv(vec2 u,float flipX,float flipY){
    if(flipX==1.){
        u.x=1.-u.x;
    }
    if(flipY==1.){
        u.y=1.-u.y;
    }
    return u;
}

mat2 skewUVMat(in vec2 uv,in float skewX,in float skewY){
    return mat2(1.,tan(skewX),
    tan(skewY),1.);
}

vec2 skewUV(vec2 u,float x,float y){
    return u*skewUVMat(u,x,y);
}

vec2 distort(vec2 p){
    p+=uUvTx;
    p=rotateUV(p,uUvRotate);
    p=flipUv(p,uUvFlipX,uUvFlipY);
    p=scaleUv(p,uUvScale);
    p=skewUV(p,uUvSkew.x,uUvSkew.y);
    return p;
}

void main(){
    vec2 p=vUv;
    p=2.*p-1.;
    
    p=distort(p);
    
    vec3 bgCol=uElementColor;
    
    float d=distance(vec2(.5),p);
    float r=1.2;
    float blur=1.6;
    d=smoothstep(r-blur,r,d);
    bgCol*=mix(vec3(1.),bgCol,d);
    
    vec4 col=vec4(bgCol,1.);
    
    vec4 elementTex=texture(uElementTex,p);
    
    col=blendScreen(col,elementTex);
    
    col.rgb*=uBrightness;
    
    // col=vec4(p,0.,1.);
    
    csm_DiffuseColor=col;
}
`;

interface InnerMatConfig {
  elementColor: THREE.Color;
  elementTex: THREE.Texture;
  materialParams: kokomi.AllMaterialParams;
  uvRotate: number;
  uvScale: number;
  uvFlipX: boolean;
  uvFlipY: boolean;
  uvTx: THREE.Vector2;
  uvSkew: THREE.Vector2;
}

interface Face {
  name: string;
  element: string;
  mesh: THREE.Mesh;
  color: string;
  config: Partial<InnerMatConfig>;
}

interface DiceConfig {
  position: CANNON.Vec3;
  velocity: CANNON.Vec3;
  angularVelocity: CANNON.Vec3;
}

const frameMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#795c30"),
  metalness: 1,
  roughness: 0.2,
  side: THREE.DoubleSide
});

class Dice extends kokomi.Component {
  declare base: ReturnType<typeof createSketch>;
  gltf: STDLIB.GLTF;
  group: THREE.Group;
  faces: Face[];
  body: CANNON.Body;
  constructor(base: kokomi.Base, config: Partial<DiceConfig> = {}) {
    super(base);

    const {
      position = new CANNON.Vec3(0, 8, 0),
      velocity = new CANNON.Vec3(0, -8, 0),
      angularVelocity = new CANNON.Vec3(
        Math.random(),
        Math.random(),
        Math.random()
      )
    } = config;

    // mesh
    this.gltf = this.base.assetManager.items["diceModel"];

    this.group = this.gltf.scene.clone();

    const modelParts = kokomi.flatModel(this.group);

    modelParts.forEach((child) => {
      child.castShadow = true;
    });

    kokomi.printModel(modelParts);

    const inner = modelParts[1] as THREE.Mesh;
    const frame = modelParts[2] as THREE.Mesh;
    const face1 = modelParts[3] as THREE.Mesh;
    const face2 = modelParts[4] as THREE.Mesh;
    const face3 = modelParts[5] as THREE.Mesh;
    const face4 = modelParts[6] as THREE.Mesh;
    const face5 = modelParts[7] as THREE.Mesh;
    const face6 = modelParts[8] as THREE.Mesh;
    const face7 = modelParts[9] as THREE.Mesh;
    const face8 = modelParts[10] as THREE.Mesh;

    // frame.visible = false;

    frameMat.envMap = this.base.envMap;

    const dummyGeometry = new THREE.PlaneGeometry();

    const createInnerMat = (config: Partial<InnerMatConfig> = {}) => {
      const {
        elementColor = new THREE.Color("#095f44"),
        elementTex = this.base.assetManager.items["anemoTex"] as THREE.Texture,
        materialParams = {},
        uvRotate = THREE.MathUtils.degToRad(90 - 8),
        uvScale = 0.8,
        uvFlipX = false,
        uvFlipY = true,
        uvTx = new THREE.Vector2(0.6, 0.23),
        uvSkew = new THREE.Vector2(-0.56, 0.14)
      } = config;

      elementTex.minFilter = THREE.NearestFilter;
      // elementTex.wrapS = elementTex.wrapT = THREE.RepeatWrapping;

      const innerMat = new kokomi.CustomShaderMaterial({
        baseMaterial: new THREE.MeshStandardMaterial(),
        vertexShader: diceVertexShader,
        fragmentShader: diceFragmentShader,
        uniforms: {
          uElementColor: {
            value: elementColor
          },
          uElementTex: {
            value: elementTex
          },
          uUvRotate: {
            value: uvRotate
          },
          uUvScale: {
            value: uvScale
          },
          uUvFlipX: {
            value: uvFlipX
          },
          uUvFlipY: {
            value: uvFlipY
          },
          uUvTx: {
            value: uvTx
          },
          uUvSkew: {
            value: uvSkew
          },
          uBrightness: {
            value: 0.2
          }
        },
        transparent: true,
        side: THREE.DoubleSide,
        envMap: this.base.envMap,
        ...materialParams
      });
      return innerMat;
    };

    frame.material = frameMat;

    const faces: Face[] = [
      {
        name: "face1",
        element: "primogem",
        mesh: face1,
        color: "#111111",
        config: {
          uvRotate: THREE.MathUtils.degToRad(4),
          uvFlipY: false,
          uvTx: new THREE.Vector2(1.1, 0.3)
        }
      },
      {
        name: "face2",
        element: "anemo",
        mesh: face2,
        color: "#095f44",
        config: {}
      },
      {
        name: "face3",
        element: "geo",
        mesh: face3,
        color: "#3f2205",
        config: {}
      },
      {
        name: "face4",
        element: "electro",
        mesh: face4,
        color: "#871b87",
        config: {}
      },
      {
        name: "face5",
        element: "dendro",
        mesh: face5,
        color: "#118111",
        config: {}
      },
      {
        name: "face6",
        element: "hydro",
        mesh: face6,
        color: "#1818c9",
        config: {}
      },
      {
        name: "face7",
        element: "pyro",
        mesh: face7,
        color: "#c81a1a",
        config: {}
      },
      {
        name: "face8",
        element: "cryo",
        mesh: face8,
        color: "#1fbbbb",
        config: {}
      }
    ];
    faces.forEach((face) => {
      face.mesh.geometry.attributes.uv = dummyGeometry.attributes.uv;
      face.mesh.material = createInnerMat({
        elementColor: new THREE.Color(face.color),
        elementTex: this.base.assetManager.items[`${face.element}Tex`],
        ...face.config
      });
    });
    this.faces = faces;

    // physics
    // const shape = kokomi.convertGeometryToShape(frame.geometry);
    const shape = kokomi.convertGeometryToShape(new THREE.OctahedronGeometry());
    const body = new CANNON.Body({
      mass: 1,
      shape,
      position
    });
    body.velocity = velocity;
    body.angularVelocity = angularVelocity;
    this.body = body;
  }
  addExisting(): void {
    this.base.scene.add(this.group);
    this.base.physics.add({ mesh: this.group, body: this.body });
  }
  lightenFace(mesh: THREE.Mesh) {
    const mat = mesh.material as THREE.ShaderMaterial;
    mat.uniforms.uBrightness.value = 1;
  }
  darkenFace(mesh: THREE.Mesh) {
    const mat = mesh.material as THREE.ShaderMaterial;
    mat.uniforms.uBrightness.value = 0.2;
  }
  get topFace() {
    const raycastor = new THREE.Raycaster();
    const rayOrigin = this.group.position;
    const rayDirection = new THREE.Vector3(
      this.group.position.x,
      100,
      this.group.position.z
    );
    rayDirection.normalize();
    raycastor.set(rayOrigin, rayDirection);
    const intersects = raycastor.intersectObjects(
      this.faces.map((face) => face.mesh)
    );
    if (intersects) {
      const firstIntersect = intersects[0];
      return firstIntersect?.object as THREE.Mesh;
    }
    return null;
  }
  lightenTopFace() {
    if (this.topFace) {
      this.lightenFace(this.topFace);
    }
  }
  get isIdle() {
    return (
      Math.abs(this.body.velocity.x) +
        Math.abs(this.body.velocity.y) +
        Math.abs(this.body.velocity.z) <
      0.1
    );
  }
  checkIdle() {
    if (this.isIdle) {
      this.emit("idle");
    }
  }
  destroy() {
    this.base.physics.world.removeBody(this.body);
    this.base.scene.remove(this.group);
  }
}

export default Dice;

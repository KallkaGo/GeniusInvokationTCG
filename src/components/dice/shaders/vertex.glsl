uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

void main(){
    vec3 p=position;
    
    csm_Position=p;
    
    vUv=uv;
}
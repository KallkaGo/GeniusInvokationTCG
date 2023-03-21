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
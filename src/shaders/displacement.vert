precision highp float;

attribute vec4 position;
attribute vec3 normal;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

//varying vec2 vUv;
uniform float iGlobalTime;

varying vec4 P;
varying float fr;
varying vec3 vNormal;

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    vNormal = normal;
//    P = gl_Vertex;
    P = position;
//	vec3 N = gl_NormalMatrix*gl_Normal;                     // check this
	vec3 N = normal;
//	vec3 V = vec3(gl_ModelViewMatrix*gl_Vertex);
	vec3 V = vec3(modelViewMatrix * position);
	vec3 E = normalize(-V);
	fr = dot(N, E);


  float displacement = (rand(position.xz) * cos(iGlobalTime * 0.9) * .125);


  gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x + ((cos(iGlobalTime * 1.2) * position.y) * 0.2) + (displacement * 0.25), (position.y * 1.2) + (displacement * 2.0), position.z + displacement, 1.0 );

//  gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x + ((cos(iGlobalTime * 0.5) * position.y) * 0.8) + (displacement * 0.25), (position.y * 0.5) + (displacement * 1.2), position.z + (displacement * 0.05) + ((sin(iGlobalTime * 0.4) * position.y) * 0.2), 1.0 );
}

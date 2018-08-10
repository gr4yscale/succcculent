precision highp float;

attribute vec4 position;
attribute vec3 normal;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

varying vec4 P;
varying float fr;
varying vec3 vNormal;

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

	gl_Position = projectionMatrix * modelViewMatrix * position;
}

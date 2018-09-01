precision highp float;

attribute vec4 position;
attribute vec3 normal;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform float iGlobalTime;
uniform float audio1;
uniform float audio2;
uniform float audio3;

attribute vec3 plantPosition;
attribute float petalRotation;

varying vec4 P;
varying float fr;
varying vec3 vNormal;

void main() {
  // pass varyings to frag shader

    vNormal = normal;
//    P = gl_Vertex;
    P = position;
//	vec3 N = gl_NormalMatrix*gl_Normal;                     // check this
	vec3 N = normal;
//	vec3 V = vec3(gl_ModelViewMatrix*gl_Vertex);
	vec3 V = vec3(modelViewMatrix * position);
	vec3 E = normalize(-V);
	fr = dot(N, E);

//  nice...
// float x = position.x + (sin(iGlobalTime * 4.0) * 10.0);
// float y = position.y + (sin((position.y) * 4.0) * 1.0);
// float z = position.z + (sin(iGlobalTime * 4.0) * 10.0);

//  not as nice
//  float x = position.x + (sin(iGlobalTime * 4.0) * 10.0);
//  float y = position.y + (sin((position.y) * 4.0) * 1.0);
//  float z = position.z + (sin(iGlobalTime * 4.0) * 10.0);

  float x = position.x;
  float y = position.y + (sin((position.y + iGlobalTime) * 2.0) * 1.0);
  float z = position.z;


//  float x = position.x;
//  float y = position.y;
//  float z = position.z;


//  Cooooool......
//float x = position.x;
//float y = distance(position.y, plantPosition.x);
//float z = position.z;

// audio reactive
//float x = position.x * (1.0 + audio3);
//float y = distance(position.y, abs(plantPosition.x) + sin(audio1));
//float z = position.z * (1.0 + audio3);


// audio reactive
//float x = position.x * (1.0 + audio1);
//float y = position.y * (1.0 + audio3);
//float z = position.z * (1.0 + audio1);


// position.y + sin(distance(plantPosition.y, plantPosition.y)

//float dist = dot(vec2(position.x, position.z), vec2(plantPosition.x, plantPosition.z));
 float dist = sin(distance(plantPosition.x, position.x));

//float dist = sin(petalRotation * 4.0);

// float x = position.x + audio2;
// float y = sin(sin(position.y) + audio1);
// float z = position.z + audio2;

//passthrough
//float x = position.x;
//float y = position.y;
//float z = position.z;

//  Cooooool......
//  float x = position.x * (1.0 + audio1);
//  float y = position.y * (1.0 + audio3);
//  float z = position.z * (1.0 + audio1);


  gl_Position = projectionMatrix * modelViewMatrix * vec4( x, y, z, 1.0 );
}

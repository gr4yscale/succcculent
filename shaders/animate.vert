precision highp float;

varying vec2 vUv;
uniform float iGlobalTime;
uniform float audio1;
uniform float audio2;
uniform float audio3;

attribute vec3 plantPosition;
attribute float petalRotation;

void main() {
  // pass varyings to frag shader
  vUv = uv;

//  nice...
// float x = position.x + (sin(iGlobalTime * 4.0) * 10.0);
 //float y = position.y + (sin((position.y) * 4.0) * 1.0);
 //float z = position.z + (sin(iGlobalTime * 4.0) * 10.0);

//  not as nice
//  float x = position.x + (sin(iGlobalTime * 4.0) * 10.0);
//  float y = position.y + (sin((position.y) * 4.0) * 1.0);
//  float z = position.z + (sin(iGlobalTime * 4.0) * 10.0);

//  float x = position.x;
//  float y = position.y + (sin((position.y + iGlobalTime) * 4.0) * 1.0);
//  float z = position.z;


//  float x = position.x;
//  float y = position.y;
//  float z = position.z;


//  Cooooool......
float x = position.x;
float y = distance(position.y, plantPosition.x);
float z = position.z;

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
// float dist = sin(distance(plantPosition.x, position.x));

float dist = sin(petalRotation * 4.0);

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

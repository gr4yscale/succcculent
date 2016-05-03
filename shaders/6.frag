precision mediump float;

#pragma glslify: cnoise2 = require(glsl-noise/classic/2d)
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

uniform float iGlobalTime;
varying vec2 vUv;

void main() {
  float color = snoise2(vUv.yx * (sin(-iGlobalTime * 1.0) * 2.0 + 20.) + 100.) * 4.0;

  float stripesA = sin(vUv.x * 100.) * 4.0;
  float stripesB = sin(vUv.y * 10.) * 4.0;

  vec3 base;
  base.x = 0.2 + (cos(vUv.y * 10.) * 1.4);
  base.y = vUv.x;
  base.z = vUv.y + cos(iGlobalTime);

  float spots = sin(vUv.x * 10.) + sin(vUv.y * 100.);

  gl_FragColor = vec4( base.y + 0.5, (vUv.x ), fract(base.x) + (color * abs(base.x + 0.5)) + 0.4, 1.0);

}

// blueish


precision highp float;

#pragma glslify: cnoise2 = require(glsl-noise/classic/2d)
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

uniform float iGlobalTime;
varying vec2 vUv;

void main() {
  float color = cnoise2(vUv.yx * (cos(iGlobalTime * 0.5) * 2.) + 100.) * 2.0;
  float stripesA = sin(vUv.x * 100.) * 4.0;
  float stripesB = sin(vUv.x * 10.) * 4.0;

  vec3 base;
  base.x = (vUv.x - 0.5) + 0.3; //snoise2(vUv.yx + (stripesA * 0.01)) * stripesA + 100.;
  base.y = (vUv.x - 0.5) + 0.0;
  base.z = (vUv.x - 0.5) + 0.4;

//base.y = snoise2(vUv.yx + (stripesA * 0.01) + iGlobalTime / 10.) * stripesB,
  //base.z = 2.0 snoise2(vUv * 100.) * (stripesB * sin(stripesB));

vec3 smoothColors;
smoothColors.x = 0.0;
smoothColors.y = snoise2(vUv + 100.);
smoothColors.z = snoise2(vUv * 2.5);

vec3 spots;
spots.x = sin(vUv.x * 10.) + sin(vUv.y * 100.);

vec4 shading = vec4( base.y, base.x, base.z, 1.0);

vec4 trippyPattern = vec4( base.y - (spots.y * 0.2) + 0.5, (base.y * 0.2) - (smoothColors.x * 0.2) / spots.x, base.z - (smoothColors.y * 0.2) * spots.x, 1.);

gl_FragColor = vec4( color + 0.75 + (shading.x * 0.2) - (trippyPattern.x * 0.9), 0.01 + (shading.y * 0.8) - (trippyPattern.y * 0.9), 0.5 - (shading.z * 0.2) +(trippyPattern.z * 0.9), 1.0);

}

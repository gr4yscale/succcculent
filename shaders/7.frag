// blueish


precision highp float;

#pragma glslify: cnoise2 = require(glsl-noise/classic/2d)
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

uniform float iGlobalTime;
varying vec2 vUv;

void main() {
  float color = cnoise2(vUv.yx * (abs(cos(iGlobalTime * 0.5)) * 2.) + 500.) * 5.0;
  float stripesA = sin(vUv.x * 100.) * 4.0;
  float stripesB = sin(vUv.x * 10.) * 4.0;

  vec3 base;
  base.x = (vUv.x - 0.5) + 0.3; //snoise2(vUv.yx + (stripesA * 0.01)) * stripesA + 100.;
  base.y = (vUv.x - 0.5) + 0.0;
  base.z = (vUv.x - 0.5) + 0.4;

vec3 smoothColors;
smoothColors.x = snoise2(vUv * 0.2);
smoothColors.y = snoise2(vUv + .9);
smoothColors.z = snoise2(vUv * vUv.x);

vec3 spots;
spots.x = sin(vUv.x * 10.) + sin(vUv.y * 10.);

vec4 shading = vec4( base.y, base.x, base.z * color, 1.0);

//vec4 trippyPattern = vec4( base.y - (spots.y * 0.2) + 0.5, (base.y * 0.2) - (smoothColors.x * 0.2) / spots.x, base.z + (smoothColors.y * 0.2) * spots.x, 1.);

vec4 trippyPattern = vec4(base.z, abs(sin(base.y - (iGlobalTime * 0.9))), smoothColors.y, 1.0);

gl_FragColor = vec4( 1.0 - smoothColors.y - vUv.y + 0.75, smoothColors.x + (sin(vUv.y * 60.0 + iGlobalTime * 3.0) * sin(vUv.x * 60.0 - iGlobalTime)), 0.5 - smoothColors.y - vUv.x, 1.0);

}

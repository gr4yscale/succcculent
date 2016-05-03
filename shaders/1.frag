precision mediump float;

#pragma glslify: cnoise2 = require(glsl-noise/classic/2d)
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d) 

uniform float iGlobalTime;
varying vec2 vUv;

void main() {
  float color = cnoise2(vUv.yx * (cos(iGlobalTime * 0.6) * 80.)) * 2.0;
  float stripesA = sin(vUv.x * 100.) * 4.0;
  float stripesB = sin(vUv.x * 10.) * 4.0;

  vec3 base;
  base.x = 0.8 + (sin(vUv.y * 100.) * 0.5);
  base.y = vUv.x;
  base.z = vUv.y + sin(iGlobalTime);
  
//  base.y = snoise2(vUv.yx + (stripesA * 0.01) + iGlobalTime / 10.) * stripesB,
//  base.z = snoise2(vUv * 100.) * (stripesB * sin(stripesB));

//  vec3 smoothColors;
//  smoothColors.x = 0.0;
//  smoothColors.y = snoise2(vUv + 100.);
//  smoothColors.z = snoise2(vUv * 2.5);

//  vec3 spots;
//  spots.x = sin(vUv.x * 100.) + sin(vUv.y * 100.);

  gl_FragColor = vec4( base.x, base.y, base.z, 1.0);
 
  //gl_FragColor = vec4( base.x, (base.y * 0.3) + (smoothColors.y * 0.05), (base.z * 0.2) + (smoothColors.z * 0.5), 1. );
  //gl_FragColor = vec4( base.x + (spots.x * 2.0) + 1.0, (base.y * 0.2) + (smoothColors.y * 0.9) * spots.x, base.z - (smoothColors.z * 1.4) * spots.x, 1.);
}

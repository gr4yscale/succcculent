precision highp float;

varying vec2 vUv;
uniform float iGlobalTime;

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  // pass varyings to frag shader
  vUv = uv;

  //position.z
  float displacement = (rand(position.xy) * cos(iGlobalTime * 0.1) * 0.05);
  //gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x + ((cos(iGlobalTime * 1.2) * position.y) * 0.2) + (displacement * 0.25), (position.y * 1.2) + (displacement * 2.0), position.z + displacement, 1.0 );
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x + ((cos(iGlobalTime * 0.5) * position.y) * 0.2) + (displacement * 0.25), (position.y * 1.2) + (displacement * 2.0), position.z + (displacement * 0.05) + ((sin(iGlobalTime * 0.4) * position.y) * 0.2), 1.0 );

  //gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x + sin(position.y), position.y, position.z + cos(position.y), 1.0 );

  //gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x + sin(iGlobalTime + (vUv.y * 2.)) * 0.05, position.y, position.z + cos(iGlobalTime + (vUv.y * 1.)) * 0.05, 1.0 );

  //gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x + sin(iGlobalTime + (vUv.y * 60.)) * 0.04, position.y, position.z + cos(iGlobalTime + (vUv.y * 60.)) * 0.04, 1.0 );

  //gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x + sin(iGlobalTime + (vUv.y * 1.)) * 0.5, position.y, position.z + cos(iGlobalTime + (vUv.y * 1.)) * 0.5, 1.0 );

  //gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x + sin(iGlobalTime * 10.0 + (vUv.y * 1000.)) * 0.05, position.y, position.z, 1.0 );

  //gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x + sin(iGlobalTime * 10.0 + (vUv.y * 10.)) * 0.05, position.y * (abs(sin(iGlobalTime * 10.)) * 2.0), position.z, 1.0 );

  //gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x + sin(iGlobalTime * 4.0 + (vUv.y * 100.)) * 0.05, position.y * (abs(sin(iGlobalTime * 4.)) * 2.0), position.z, 1.0 );

  //gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x + sin(iGlobalTime * 4.0 + (vUv.y * 100.)) * 0.05, position.y * (abs(sin(iGlobalTime * 4.)) * 2.0),  position.z + sin(iGlobalTime * 4.0 + (vUv.y * 100.)) * 0.05, 1.0 );
}

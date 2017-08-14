precision highp float;

varying vec2 vUv;

void main() {
  // pass varyings to frag shader
  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x, position.y, position.z, 1.0 );
}

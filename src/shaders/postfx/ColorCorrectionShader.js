/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Color correction
 */

import * as THREE from 'three'

export default {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"powRGB":   { type: "v3", value: new THREE.Vector3( 0.6, 0.6, 0.6 ) },
		"mulRGB":   { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform vec3 powRGB;",
		"uniform vec3 mulRGB;",

		"varying vec2 vUv;",

		"void main() {",

			"gl_FragColor = texture2D( tDiffuse, vUv );",
			"gl_FragColor.rgb = mulRGB * pow( gl_FragColor.rgb, powRGB );",

		"}"

	].join("\n")

};
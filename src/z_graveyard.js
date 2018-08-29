//////////////////////////////////////////////////////////////////////////////////////////////
// GARDEN / SCENE MANIPULATION / SHADERS PROTOYPING JUNK
//////////////////////////////////////////////////////////////////////////////////////////////
//     function resize() {
//         let width = container.offsetWidth
//         let height = container.offsetHeight
//         camera.aspect = width / height
//         camera.updateProjectionMatrix()
//
//         // TODO check on renderer.setSize
//         renderer.setSize(width, height)
//     }

// const shaderDataUrls = [shader1, shader8, shader9] // see styles.js to change the indexes in the garden style prese
// const shaderDataUrls = [shaderdev]
// for (let i = 0; i < shaderDataUrls.length; i++) {
//   const shader = shaderDataUrls[i]
//   const shaderDecoded = atob(parseDataUrl(shader).data)
//   fragShaders.push(shaderDecoded)
// }

// groundShaderMaterial = new THREE.ShaderMaterial({
//   uniforms : {
//     iGlobalTime: { type: 'f', value: 0 }
//   },
//   defines: {
//     USE_MAP: ''
//   },
//   vertexShader: passThruShader,
//   fragmentShader : devFragShader,
//   side: THREE.DoubleSide,
//   // transparent: false,
//   blending: THREE.AdditiveBlending, // see blending modes below
//   wireframe:false
// });

// Scene / Three
// import setupLights from './lights'

// import shader1 from './shaders/compiled/1.frag'
// import shader2 from './shaders/compiled/2.frag'
// import shader3 from './shaders/compiled/3.frag'
// import shader4 from './shaders/compiled/4.frag'
// import shader5 from './shaders/compiled/5.frag'
// import shader6 from './shaders/compiled/6.frag'
// import shader7 from './shaders/compiled/7.frag'
// import shader8 from './shaders/compiled/8.frag'
// import shader9 from './shaders/compiled/9.frag'
// import shader10 from './shaders/compiled/10.frag'
// import shader11 from './shaders/compiled/11.frag'
// import shader12 from './shaders/compiled/12.frag'
// import shader13 from './shaders/compiled/13.frag'
// import shader14 from './shaders/compiled/14.frag'
// import shader15 from './shaders/compiled/15.frag'
// import shader16 from './shaders/compiled/16.frag'
// import shader17 from './shaders/compiled/17.frag'
// import shader18 from './shaders/compiled/18.frag'
// import shader19 from './shaders/compiled/19.frag'

//
// // add a ground plane (do in setup)
// const groundGeom = new THREE.PlaneGeometry(20, 20, 4, 4)
// groundMesh = new THREE.Mesh(groundGeom, groundShaderMaterial)
// groundMesh.position.set(0,-0.001, 0)
// groundMesh.rotation.x = THREE.Math.degToRad(90)
// scene.add(groundMesh)
// }

// for update()
// groundShaderMaterial.uniforms.iGlobalTime.value = (tick / state.app.groundShaderTickerSpeed)

// Textures

// for (let i = 0; i < succulents.length; i++) {
//   sceneUpdateTickerSpeed++
//   if (sceneUpdateTickerSpeed > fps) {
//     if (succulents[i]) {
//       let aTex = succulents[i].material.map
//       if (aTex) {
//         let repeatA = Math.ceil(getRandomArbitrary(1, state.textureRepeatRange))
//         let repeatB = Math.ceil(getRandomArbitrary(1, state.textureRepeatRange))
//         aTex.repeat.set(repeatA, repeatB)
//         aTex.offset.set(aTex.offset.x - 0.01 - (state.audioAnalysisFilter1 * 0.15), aTex.offset.y)
//
//         // Do the offset with music
//         // console.log(state.audioAnalysisFilter1)
//         // aTex.offset.set(aTex.offset.x - 0.01, aTex.offset.y)
//         succulents[i].material.map = aTex
//       }
//     }
//     sceneUpdateTickerSpeed = 0
//   }
// }

















//////////////////////////////////////////////////////////////////////////////////////////////
// APC40 CONTROLS
//////////////////////////////////////////////////////////////////////////////////////////////

// MIDI - APC40 knobs (stub)
// function handleMidiControlChangeAPC(e) {
//     console.log('Knob #: ' + e.controller.number + ' | Value: ' + e.value) // TOFIX: replace this with generic MIDI log function?
//     let v = e.value / 127.0
//
//     switch (e.controller.number) {
//         case 48:
//
//             break
//         case 49:
//
//             break
//         case 50:
//
//             break
//         case 51:
//
//             break
//         default:
//     }
// }
//
// case 8:
//   self.audioAnalaysisFilter3TriggerThreshold = lerp(0, 1.0, v)
//   self.audioAnalaysisFilter3TriggerThresholdReached = false
//   break
// case 9:
//   state.audioAnalysisFilter1Gain = lerp(0, 1.0, v)
//   breacontrolsk
// case 10:
//   state.audioAnalysisFilter2Gain = lerp(0, 1.0, v)
//   break
// case 11:
//   self.audioAnalysisFilter3Gain = lerp(0, 1.0, v)
//   break
//   case 15: {
//     state.sameShaderForAllPlantsIndex = Math.floor(lerp(0, 14, v)) //TOFIX: keep this within bounds, pass in the shaders array length
//     if (state.sameShaderForAllPlants) {
//       callbackToUpdatePlantShaders(state.sameShaderForAllPlantsIndex)
//     }
//     break
//   }
//   default:
// }
//}
//
// // MIDI - camera controls (TouchOSC)
// function handleMidiControlChangeTouchOSC(e) {
//     if (logControlSurfaceEvents) {
//         console.log('Channel #: ' + e.channel + ' | Knob #: ' + e.controller.number + ' | Value: ' + e.value) // TOFIX: replace this with generic MIDI log function?
//     }
//
//     let v = e.value / 127.0
//
//     // Camera, page 1
//     if (e.channel == 1) {
//         switch (e.controller.number) {
//             case 0:
//                 if (!self.xboxControllerSelected) cameraRotationDeltaY = lerp(-0.5, 0.5, v)
//                 break
//             case 1:
//                 if (!self.xboxControllerSelected) cameraRotationDeltaX = lerp(0.5, -0.5, v)
//                 break;
//             case 2:
//                 if (!self.xboxControllerSelected) cameraPositionDeltaY = lerp(-0.5, 0.5, v)
//                 break;
//             case 3:
//                 if (!self.xboxControllerSelected) cameraPositionDeltaX = lerp(0.5, -0.5, v)
//                 break;
//             case 4:
//                 joystickSensitivity = lerp(0, 8.0, v)
//                 break
//             case 5:
//                 cameraDollyDelta = lerp(1.0099, 0.986, v)
//                 break
//         }
//         // Textures, page 2
//     } else if (e.channel == 3) {
//         switch (e.controller.number) {
//             case 7:
//                 state.textureUpdateSpeed = lerp(1.0, 10.0, v)
//                 break
//             case 8:
//                 state.textureRepeatRange = lerp(1.0, 10.0, v)
//                 break
//         } // Garden Presets
//     } else if (e.channel == 4) {
//         switch (e.controller.number) {
//             case 0:
//                 console.log('updating the selected style')
//                 presets.selectedStyleIndex = Math.floor(lerp(0, presets.styles.length - 1, v))
//                 break
//             case 1:
//                 state.numPlantsForNextGeneration = Math.floor(lerp(0, 250, v))
//                 break
//         }
//
//     }
//
// function callbackToUpdatePlantShaders(shaderIndex) {
//     if (state.sameShaderForAllPlants) {
//         let data = {shaderIndex: shaderIndex}
//         callbackForControlEvent(events.SET_SAME_SHADER_FOR_ALL_PLANTS, data)
//     } else {
//         callbackForControlEvent(events.RESET_SHADERS_TO_INITIAL_SHADER_FOR_ALL_PLANTS)
//     }
// }

// LIGHTS

// export default (THREE, scene) => {
//     let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
//     light.position.set(0, 40, 80);
//
//     let lightB = new THREE.DirectionalLight(0xFFFFFF, 1.0);
//     lightB.position.set(1, 20, 1);
//
//     lightB.castShadow = true;
//     lightB.shadowCameraVisible = true;
//
//     lightB.shadowCameraNear = 1;
//     lightB.shadowCameraFar = 1000;
//     lightB.shadowCameraLeft = -1000;
//     lightB.shadowCameraRight = 1000;
//     lightB.shadowCameraTop = 1000;
//     lightB.shadowCameraBottom = -1000;
//     lightB.distance = 0;
//     lightB.intensity = 1.0;
//
//     scene.add(lightB);
//
//     let spotLight = new THREE.SpotLight();
//     spotLight.angle = Math.PI / 8;
//     spotLight.exponent = 30;
//     spotLight.position.copy(new THREE.Vector3(40, 60, -50));
//
//     spotLight.castShadow = true;
//     spotLight.shadowCameraNear = 50;
//     spotLight.shadowCameraFar = 200;
//     spotLight.shadowCameraFov = 35;
//     spotLight.shadowMapHeight = 2048;
//     spotLight.shadowMapWidth = 2048;
//
//     spotLight.name = 'spotLight';
//
//     scene.add(spotLight);
// }

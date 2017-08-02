const THREE = window.THREE

import React from 'react'
import {render} from 'react-dom'
import {browserHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import configureStore from './redux/store/configureStore'
import {requestInitialData} from './redux/actions'
import Root from './components/Root'


var domReady = require('domready');
var dat = require('dat-gui');

// var glslify = require('glslify');

// require('./FileSaver.js')

// TOFIX: changed this to find the correct THREE reference
// const stlExporter = require('three-STLexporter') // adds to the global THREE namespace

let WebMidi = require('webmidi')
var Succulent = require('./succulent')(THREE);
var Presets = require('./presets')
var Controls = require('./controls')
let state = require('./state.js')
let events = require('./events.js')
let config = require('./config.js')

var camera, scene, renderer;
var container;
var clock = new THREE.Clock();

var presets = new Presets()

var sceneUpdateTickerSpeed = 0.001
var fps = 60.0
var shaderTickerSpeed = 1000 // TOFIX: remnant of old project, probably put scene update and shader on same timer

var boxes = [];
var succulents = [];
var shaders = [];
var fragShaders = [];

var controls;


var composer, renderPass, effectCopy;
var bleachFilter, edgeShader, FXAAShader, focusShader, colorCorrectionShader, hueSaturationShader

var controlsGUI = new function () {
    this.bleachOpacity = 1;
    this.bleach = false;
    this.edgeDetect = false;
    this.edgeAspect = 512;
    this.FXAA = false;
    this.focus = false;
    this.sampleDistance = 0.94;
    this.waveFactor = 0.00125;
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

    this.colorR = 1;
    this.colorG = 1;
    this.colorB = 1;

    this.hue = 0;
    this.saturation = 0;

    this.onChange = function () {
        bleachFilter.enabled = controlsGUI.bleach;
        bleachFilter.uniforms.opacity.value = controlsGUI.bleachOpacity;
        edgeShader.enabled = controlsGUI.edgeDetect;
        edgeShader.uniforms.aspect.value = new THREE.Vector2(controlsGUI.edgeAspect, controlsGUI.edgeAspect);
        FXAAShader.enabled = controlsGUI.FXAA;
        FXAAShader.uniforms.resolution.value = new THREE.Vector2(1 / window.innerWidth, 1 / window.innerHeight);
        focusShader.enabled = controlsGUI.focus;
        focusShader.uniforms.screenWidth.value = controlsGUI.screenWidth;
        focusShader.uniforms.screenHeight.value = controlsGUI.screenHeight;
        focusShader.uniforms.waveFactor.value = controlsGUI.waveFactor;
        focusShader.uniforms.sampleDistance.value = controlsGUI.sampleDistance;

        // colorCorrectionShader.uniforms.mulRGB.value.set(controlsGUI.colorR, controlsGUI.colorG, controlsGUI.colorB)
        hueSaturationShader.uniforms.hue.value = controlsGUI.hue
        hueSaturationShader.uniforms.saturation.value = controlsGUI.saturation
    }
};



function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function findRandomUnusedSucculentPosition(offsetMin, offsetMax, box) {
  var newBox = box.clone();
  var offsetX = getRandomArbitrary(offsetMin, offsetMax);
  var offsetZ = getRandomArbitrary(offsetMin, offsetMax);
  var offsetVec3 = new THREE.Vector3(offsetX, 0, offsetZ);
  newBox.translate(offsetVec3);

  for (var i = 0; i < boxes.length; i++) {
    var aBox = boxes[i];
    if (newBox.intersectsBox(aBox)) {
      // console.log('There was an intersection: ' + offsetX + ' ' + offsetZ);
      var newOffsetMin = offsetMin - config.randomPositionTestOffset;
      var newOffsetMax = offsetMax + config.randomPositionTestOffset;
      return findRandomUnusedSucculentPosition(newOffsetMin, newOffsetMax, box);
    }
  }
  // console.log('Found the offset that i want to work with: ' + newBox.center().x + ' ' + newBox.center().y + ' ' + boxes.length);
  return newBox;
}

function positionSucculentRandomly(index, plantParams, succulent) {
  var bboxHelperA = new THREE.BoundingBoxHelper(succulent);
  bboxHelperA.update();
  // var bbox = new THREE.Box3().setFromObject(succulent);
  var newBox = findRandomUnusedSucculentPosition(-config.randomPositionTestOffset, config.randomPositionTestOffset, bboxHelperA.box);

  succulent.position.x = newBox.center().x;
  succulent.position.y = 0;
  succulent.position.z = newBox.center().z;

  var helper = new THREE.BoundingBoxHelper(succulent);
  helper.update();
  boxes.push(helper.box);
  // helper.visible = true;
  // scene.add(helper);

  plantParams['positionX'] = succulent.position.x
  plantParams['positionY'] = succulent.position.y
  plantParams['positionZ'] = succulent.position.z

  presets.plantParams[index] = plantParams
}

function addSucculent(index, plantParams) {
  if (!plantParams) return
  var shaderIndex = plantParams['shaderIndex']
  var shaderMaterial = shaders[shaderIndex];

  const positionSucculent = (succulent) => {
    // load position from our preset if it exists, otherwise find a position for the succulent
    if (plantParams['positionX'] !== 'not_placed' && plantParams['positionY'] !== 'not_placed' && plantParams['positionZ'] !== 'not_placed') {
      succulent.position.x = plantParams['positionX']
      succulent.position.y = plantParams['positionY']
      succulent.position.z = plantParams['positionZ']
    } else {
      positionSucculentRandomly(index, plantParams, succulent)
    }

    /////////////////////////////////

    // look at BufferGeometry .setFromObject

    // This is based on the SUCCULENT position, not petal mesh - so y component will be useless

    // The succulent mesh is actually empty and just contains children petal meshes.
    // We need to add a BufferAttribute to the petal geometries
    // to get the plant position attribute in the vertex shader

    for (var m = 0; m < succulent.children.length; m++) {
      let petalMesh = succulent.children[m]

      let plantPositionAttributeArray = new Float32Array(petalMesh.geometry.attributes.position.count * 3)

      // lay out the position data in the way that the GPU wants it.
      // we deal with it on the CPU like this: [ [x,y,z], [x,y,z], [x,y,z]] ...
      // the gpu wants this: [ x, y, z, x, y, z, x, y, z, x, y, z ]

      for (var i = 0; i < plantPositionAttributeArray.length; i++) {
        plantPositionAttributeArray[i * 3] = succulent.position.x
        plantPositionAttributeArray[i * 3 + 1] = succulent.position.y
        plantPositionAttributeArray[i * 3 + 2] = succulent.position.z
      }

      let petalMeshRotationAttributeArray = new Float32Array(petalMesh.geometry.attributes.position.count)
      for (var j = 0; j < petalMeshRotationAttributeArray.length; j++) {
        petalMeshRotationAttributeArray[j] = petalMesh.rotation.y
      }


      // console.log('petalMesh geom position attributes:')
      // console.log(petalMesh.geometry.attributes.position)
      let posAttribs = petalMesh.geometry.attributes.position.array
      let l = petalMesh.geometry.attributes.position.count
      // console.log(posAttribs[0] + ' | ' + posAttribs[1] + ' | ' + posAttribs[2])
      // console.log(posAttribs[0] + ' | ' + posAttribs[1] + ' | ' + posAttribs[2])
      // console.log(posAttribs[0] + ' | ' + posAttribs[1] + ' | ' + posAttribs[2])
      // console.log(posAttribs[l-30] + ' | ' + posAttribs[l-29] + ' | ' + posAttribs[l-28 ])

      // console.log('plant position attributes array:')
      // console.log(plantPositionAttributeArray[0] + ' | ' + plantPositionAttributeArray[1] + ' | ' + plantPositionAttributeArray[2])
      // debugger

      petalMesh.geometry.addAttribute("plantPosition", new THREE.BufferAttribute(plantPositionAttributeArray, 3))
      petalMesh.geometry.addAttribute("petalRotation", new THREE.BufferAttribute(petalMeshRotationAttributeArray, 1))
    }

    scene.add(succulent);
    succulents.push(succulent);
  }

  if (plantParams.textureFileName) {
    Succulent(shaderMaterial, plantParams, positionSucculent)
  } else {
    let succulent = Succulent(shaderMaterial, plantParams)
    positionSucculent(succulent)
  }
}

function loadShaderMaterials() {


  const passThruShader = `
    precision highp float;

    varying vec2 vUv;

    void main() {
      // pass varyings to frag shader
      vUv = uv;

      gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x, position.y, position.z, 1.0 );
    }
  `

  // this makes use of the browserify transform (it's a preprocessor)
  // so can't clean this up with a loop
  // fragShaders.push(glslify(__dirname + './../shaders/1.frag'))
  // fragShaders.push(glslify(__dirname + './../shaders/2.frag'))
  // fragShaders.push(glslify(__dirname + './../shaders/3.frag'))
  // fragShaders.push(glslify(__dirname + './../shaders/4.frag'))
  // fragShaders.push(glslify(__dirname + './../shaders/5.frag'))
  // fragShaders.push(glslify(__dirname + './../shaders/6.frag'))
  // fragShaders.push(glslify(__dirname + './../shaders/7.frag'))
  // fragShaders.push(glslify(__dirname + './../shaders/8.frag'))
  // fragShaders.push(glslify(__dirname + './../shaders/9.frag'))
  // fragShaders.push(glslify(__dirname + './../shaders/10.frag'))
  // fragShaders.push(glslify(__dirname + './../shaders/11.frag'))
  // fragShaders.push(glslify(__dirname + './../shaders/12.frag'))
  // fragShaders.push(glslify(__dirname + './../shaders/13.frag'))
  // fragShaders.push(glslify(__dirname + './../shaders/14.frag'))
  // fragShaders.push(glslify(__dirname + './../shaders/15.frag'))
  // fragShaders.push(glslify(__dirname + '/shaders/16.frag'))
  // fragShaders.push(glslify(__dirname + '/shaders/17.frag'))
  // fragShaders.push(glslify(__dirname + '/shaders/18.frag'))
  // fragShaders.push(glslify(__dirname + '/shaders/19.frag'))

  for (var i = 0; i < fragShaders.length; i++) {
    var shaderMaterial = new THREE.ShaderMaterial({
      uniforms : {
        iGlobalTime: { type: 'f', value: 0 },
        audio1: { type: 'f', value: 0 },
        audio2: { type: 'f', value: 0 },
        audio3: { type: 'f', value: 0 },
      },
      defines: {
        USE_MAP: ''
      },
      // vertexShader : glslify(__dirname + './../shaders/passthrough.vert'),
      vertexShader: passThruShader,
      fragmentShader : fragShaders[i],
      side: THREE.DoubleSide,
      // transparent: false,
      blending: THREE.AdditiveBlending,
      wireframe:false
    });
    shaders.push(shaderMaterial);
  }
}

function setSameShaderForAllPlants(shaderIndex) {
  for (var i = 0; i < state.numPlantsForNextGeneration; i++) {
    succulents[i].material.fragmentShader = fragShaders[shaderIndex]
    succulents[i].material.needsUpdate = true
  }
}

function resetShadersForAllPlants() {
  for (var i=0; i < state.numPlantsForNextGeneration; i++) {
    succulents[i].material.fragmentShader = fragShaders[presets.plantParams[i].shaderIndex]
    succulents[i].material.needsUpdate = true
  }
}

// APP ENTRY POINT (LOVE THE MESSINESS, who has time for refactoring?)

domReady(function(){

  const regenGardenIfAllowed = () => {
    if (state.adHocGardenGenerationEnabled) generateNewRandomGarden()
  }

  let gui = new dat.GUI()

  let guiGardenGen = gui.addFolder("Ad-Hoc Garden Generation")
  guiGardenGen.add(state, 'numPlantsForNextGeneration', 1, 300).step(1).name("# Plants").onFinishChange(regenGardenIfAllowed)
  guiGardenGen.add(state, 'adHocGardenGenerationEnabled').name("Ad-Hoc Garden Gen").onFinishChange(regenGardenIfAllowed)
  guiGardenGen.add(state, 'adHocPlantParamsPetalCount', 4, 200).step(1).name("Petal Count").onFinishChange(regenGardenIfAllowed)
  guiGardenGen.add(state, 'adHocPlantParamsPetalLength', 0.01, 4.0).step(0.01).name("Petal Length").onFinishChange(regenGardenIfAllowed)
  guiGardenGen.add(state, 'adHocPlantParamsPetalWidth', 0.01, 4.0).step(0.01).name("Petal Width").onFinishChange(regenGardenIfAllowed)
  guiGardenGen.add(state, 'adHocPlantParamsCurveAmountB', 0.01, 3.0).step(0.01).name("Curve Amt B").onFinishChange(regenGardenIfAllowed)
  guiGardenGen.add(state, 'adHocPlantParamsCurveAmountC', 0.01, 3.0).step(0.01).name("Curve Amt C").onFinishChange(regenGardenIfAllowed)
  guiGardenGen.add(state, 'adHocPlantParamsCurveAmountD', 0.01, 3.0).step(0.01).name("Curve Amt D").onFinishChange(regenGardenIfAllowed)
  guiGardenGen.add(state, 'adHocPlantParamsLayers', 2, 40).step(1).name("# Layers").onFinishChange(regenGardenIfAllowed)



  gui.add(controlsGUI, 'bleach').onChange(controlsGUI.onChange);
  gui.add(controlsGUI, 'bleachOpacity', 0, 2).onChange(controlsGUI.onChange);
  gui.add(controlsGUI, 'edgeDetect').onChange(controlsGUI.onChange);
  gui.add(controlsGUI, 'edgeAspect', 128, 2048).step(128).onChange(controlsGUI.onChange);
  gui.add(controlsGUI, 'FXAA').onChange(controlsGUI.onChange);
  gui.add(controlsGUI, 'focus').onChange(controlsGUI.onChange);
  gui.add(controlsGUI, 'sampleDistance', 0, 2).step(0.01).onChange(controlsGUI.onChange);
  gui.add(controlsGUI, 'waveFactor', 0, 0.005).step(0.0001).onChange(controlsGUI.onChange);

  gui.add(controlsGUI, 'colorR', 0, 1).onChange(controlsGUI.onChange);
  gui.add(controlsGUI, 'colorG', 0, 1).onChange(controlsGUI.onChange);
  gui.add(controlsGUI, 'colorB', 0, 1).onChange(controlsGUI.onChange);

  gui.add(controlsGUI, 'hue', -1, 1).onChange(controlsGUI.onChange);
  gui.add(controlsGUI, 'saturation', -1, 1).onChange(controlsGUI.onChange);



  // dat.GUI.toggleHide()

  initThree()
  // initReact()
  generateNewRandomGarden()
  animate()
})

function clearSucculents() {
  for (var i=0; i < succulents.length; i++) {
    scene.remove(succulents[i])
  }
  succulents = []
  boxes = []
}

function loadFirstGardenFromPresetFile() {
  clearSucculents()
  presets.load(function(plantParams) {
    for (var i=0; i < state.numPlantsForNextGeneration; i++) {
      addSucculent(i, plantParams[i])
    }
  })
}

function loadGardenFromSelectedPreset() {
  // assumes we've already loaded data into presets from the file
  clearSucculents()
  if (!presets.selectedPresetData()) return
  let plantParams = presets.selectedPresetData().plantParams
  for (var i=0; i < state.numPlantsForNextGeneration; i++) {
    if (i < plantParams.length) {
      addSucculent(i, plantParams[i])
    }
  }
}

function generateNewRandomGarden() {
  clearSucculents()
  let preset = presets.generatePlantParams(state.numPlantsForNextGeneration, shaders.length, state)
  for (var i=0; i < state.numPlantsForNextGeneration; i++) {
    addSucculent(i, preset.plantParams[i])
  }
}

function initThree() {
  renderer = new THREE.WebGLRenderer({'antialias': false, alpha: false, precision: 'highp'});
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(new THREE.Color(0x333333, 1.0));



  // **** FUCKS UP POST PROCESSING TO HAVE FACE CULLING FALSE


  // renderer.setFaceCulling(false)



  // ******************************** !!!!!


  container = document.getElementById('webglrender');
  container.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(65, 1, 0.0001, 1000000);

  camera.position.set(0, 0.35, 0.75);
  scene.add(camera);

  controls = new Controls(presets, state, WebMidi, scene, camera, renderer.domElement, handleControlsEvent)

  // setup the scene
  var setupLights = require('./lights')(THREE, scene);
  setupLights();
  loadShaderMaterials();

  // create the shaders
  // overlay of black and white
  bleachFilter = new THREE.ShaderPass(THREE.BleachBypassShader);
  bleachFilter.enabled = false;
  edgeShader = new THREE.ShaderPass(THREE.EdgeShader);
  edgeShader.enabled = false;
  FXAAShader = new THREE.ShaderPass(THREE.FXAAShader);
  FXAAShader.enabled = false;
  focusShader = new THREE.ShaderPass(THREE.FocusShader);
  focusShader.enabled = false;
  colorCorrectionShader = new THREE.ShaderPass(THREE.ColorCorrectionShader);
  hueSaturationShader = new THREE.ShaderPass(THREE.HueSaturationShader);

  renderPass = new THREE.RenderPass(scene, camera);
  effectCopy = new THREE.ShaderPass(THREE.CopyShader);
  effectCopy.renderToScreen = true;

  composer = new THREE.EffectComposer(renderer);

  composer.addPass(renderPass);
  composer.addPass(bleachFilter);
  composer.addPass(edgeShader);
  composer.addPass(FXAAShader);
  composer.addPass(focusShader);
  composer.addPass(hueSaturationShader);

  composer.addPass(effectCopy);

  window.addEventListener('resize', resize, false);
  setTimeout(resize, 1);
}

function resize() {
  var width = container.offsetWidth;
  var height = container.offsetHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

////////////////////////////////

function updateSucculentTextures() {
  for (var i = 0; i < succulents.length; i++) {
    sceneUpdateTickerSpeed++
    if (sceneUpdateTickerSpeed > fps) {
      if (succulents[i]) {
        let aTex = succulents[i].material.map
        if (aTex) {
          let repeatA = Math.ceil(getRandomArbitrary(1, state.textureRepeatRange))
          let repeatB = Math.ceil(getRandomArbitrary(1, state.textureRepeatRange))
          aTex.repeat.set(repeatA, repeatB)
          aTex.offset.set(aTex.offset.x - 0.01 - (state.audioAnalysisFilter1 * 0.15), aTex.offset.y)

          // Do the offset with music
          // console.log(state.audioAnalysisFilter1)
          // aTex.offset.set(aTex.offset.x - 0.01, aTex.offset.y)
          succulents[i].material.map = aTex
        }
      }
      sceneUpdateTickerSpeed = 0
    }
  }
}

function updateShaderUniforms(t) {
  // update shader time
  var shaderTime = (t / shaderTickerSpeed)
  for (var j = 0; j < shaders.length; j++) {
    shaders[j].uniforms.iGlobalTime.value = shaderTime;
    shaders[j].uniforms.audio1.value = state.audioAnalysisFilter1;
    shaders[j].uniforms.audio2.value = state.audioAnalysisFilter2;
    shaders[j].uniforms.audio3.value = state.audioAnalysisFilter3;
  }
}

function update(t) {
  // updateSucculentTextures()
  updateShaderUniforms(t)
  resize()
  controls.update(state, presets)
}

function animate(t) {
  requestAnimationFrame(animate);
  update(t);
  composer.render();
  // clock.getDelta();
}

function fullscreen() {
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.msRequestFullscreen) {
    container.msRequestFullscreen();
  } else if (container.mozRequestFullScreen) {
    container.mozRequestFullScreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  }
}

function updateIndicators(data) {
  let el = document.getElementById(data.key)
  if (data.value) {
    el.style.display = 'block'
  } else {
    el.style.display = 'none'
  }
  console.log('Updated indicator view for ' + data.key + ': ' + data.value)
}

function handleControlsEvent(e) {
  // console.log('Handling control event of type: ' + e.type)
  switch (e.type) {
    case events.SAVE_GARDEN_TO_PRESET_FILE:
      presets.save('plants.json')
      break
    case events.LOAD_GARDEN_FROM_PRESET_FILE:
      loadFirstGardenFromPresetFile()
      break
    case events.GENERATE_NEW_RANDOM_GARDEN:
      generateNewRandomGarden()
      break
    case events.GARDEN_PRESET_MODE_TOGGLED:
      state.gardenPresetModeEnabled = !state.gardenPresetModeEnabled
      break
    case events.GARDEN_PRESET_MODE_SAVE_NEXT_PRESET_TOGGLED:
      state.gardenPresetSaveNext = !state.gardenPresetSaveNext
      console.log('preset save next : ' + state.gardenPresetSaveNext)
      break
    case events.ADD_NEW_GARDEN_PRESET:
      presets.addNew()
      break
    case events.LOAD_GARDEN_FROM_SELECTED_PRESET:
      presets.select(e.data.index)
      loadGardenFromSelectedPreset()
      break
    case events.SAVE_GARDEN_TO_SELECTED_PRESET:
      presets.select(e.data.index)
      presets.saveLastGeneratedPresetForSelectedIndex()
      break
    case events.DEBUGGER_PAUSE:
      debugger
      break
    case events.CAMERA_PRESETS_LEARN_TOGGLED: {
      updateIndicators(e.data)
      break
    }
    case events.CAMERA_PRESET_LEARN: {
      let presetIdentifier = e.data.presetIdentifier
      presets.updateCameraMap(presetIdentifier, camera, e.data)
      // console.log('Updated camera presets for identifier: ' + presetIdentifier)
      updateIndicators(e.data)
      break
    }
    case events.CAMERA_PRESET_TRIGGER: {
      // get the serialized matrix out of presets (which stores the matrix the matrix as an array for convenient persistence)
      // use the callback that controls gives to let it update camera / orbitcontrols state
      let presetIdentifier = e.data.presetIdentifier
      let data = presets.selectedPresetCameraMap()
      if (data) {
        controls.updateFromPresetData(data[presetIdentifier])
        // console.log('Triggered orbit controls and camera update using preset with identifier: ' + presetIdentifier)
      } else {
        console.log('There is no preset for identifier: ' + presetIdentifier + '!')
      }
      break
    }
    case events.CAMERA_CONTROLS_RESET:
      break
    case events.SET_SAME_SHADER_FOR_ALL_PLANTS: {
      setSameShaderForAllPlants(e.data.shaderIndex)
      break
    }
    case events.RESET_SHADERS_TO_INITIAL_SHADER_FOR_ALL_PLANTS:
      resetShadersForAllPlants()
      break
    case events.AUDIO_ANALYSIS_FILTER_UPDATE:
      // console.log(e.data.filter1 + ' | ' + e.data.filter2 + ' | ' + e.data.filter3)
      break
    case events.AUDIO_ANALYSIS_FILTER_1_TRIGGER_THRESHOLD_REACHED: {
      console.log('tried to trigger filter 1')
      let map = presets.cameraMap['1']
      if (map) {
        console.log(map)
        controls.updateFromPresetData(map)
      }
      break
    }
    case events.AUDIO_ANALYSIS_FILTER_2_TRIGGER_THRESHOLD_REACHED: {
      console.log('tried to trigger filter 2')
      let map = presets.cameraMap['2']
      if (map) {
        console.log(map)
        controls.updateFromPresetData(map)
      }
      break
    }
    case events.AUDIO_ANALYSIS_FILTER_3_TRIGGER_THRESHOLD_REACHED:
      break
    case events.GENERATE_NEW_PLANTS_TEXTURE_STYLES_TOGGLE: {
      presets.generateNewPlantsWithTextures = e.data.generateNewPlantsWithTextures
      console.log(e.data)
      break
    }
    case events.TOGGLE_DAT_GUI:
      dat.GUI.toggleHide()
      break
    case events.EXPORT_STL:
      // saveSTL(scene, 'test')
      break
    default:
      // console.log('Received unknown control type! *******')
      break
  }
}

// function saveSTL(scene, name) {
//   var exporter = new stlExporter()
//   var stlString = exporter.parse(scene)
//
//   console.log(stlString)
//   // console.log(exporter)
//   debugger
//
//   var blob = new Blob([stlString], {type: 'text/plain'})
//   // saveAs(blob, name + '.stl')
//
//   // create a link and make us click on it!
//   var a = document.createElement("a");
//   document.body.appendChild(a);
//   a.style = "display: none";
//
//   url = window.URL.createObjectURL(blob);
//   a.href = url;
//   a.download = name;
//   a.click();
//   window.URL.revokeObjectURL(url);
// }

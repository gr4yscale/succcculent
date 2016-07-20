var domReady = require('domready');
var dat = require('dat-gui');
var glslify = require('glslify');

let WebMidi = require('webmidi')
var Succulent = require('./js/succulent')(THREE);
var Presets = require('./js/presets')
var Controls = require('./js/controls')

var camera, scene, renderer;
var effect;
var container;
var clock = new THREE.Clock();

var presets = new Presets()

var numPlants = 150;
var speed = 1000;
var boxes = [];
var succulents = [];
var shaders = [];
var fragShaders = [];
var useVR = false; // disable device orientation when VR is off
var randomPoints = [];

var controls;

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
      var newOffsetMin = offsetMin - 0.02;
      var newOffsetMax = offsetMax + 0.02;
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
  var newBox = findRandomUnusedSucculentPosition(-0.02, 0.02, bboxHelperA.box);

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
    scene.add(succulent);
    succulents.push(succulent);
  }
  if (plantParams.textureFilename) {
    Succulent(shaderMaterial, plantParams, positionSucculent)
  } else {
    let succulent = Succulent(shaderMaterial, plantParams)
    positionSucculent(succulent)
  }

}

function loadShaderMaterials() {
  // this makes use of the browserify transform (it's a preprocessor)
  // so can't clean this up with a loop
  fragShaders.push(glslify(__dirname + '/shaders/1.frag'))
  fragShaders.push(glslify(__dirname + '/shaders/2.frag'))
  fragShaders.push(glslify(__dirname + '/shaders/3.frag'))
  fragShaders.push(glslify(__dirname + '/shaders/4.frag'))
  fragShaders.push(glslify(__dirname + '/shaders/5.frag'))
  fragShaders.push(glslify(__dirname + '/shaders/6.frag'))
  fragShaders.push(glslify(__dirname + '/shaders/7.frag'))
  fragShaders.push(glslify(__dirname + '/shaders/8.frag'))
  fragShaders.push(glslify(__dirname + '/shaders/9.frag'))
  fragShaders.push(glslify(__dirname + '/shaders/10.frag'))
  fragShaders.push(glslify(__dirname + '/shaders/11.frag'))
  fragShaders.push(glslify(__dirname + '/shaders/12.frag'))
  fragShaders.push(glslify(__dirname + '/shaders/13.frag'))
  fragShaders.push(glslify(__dirname + '/shaders/14.frag'))

  for (var i = 0; i < fragShaders.length; i++) {
    var shaderMaterial = new THREE.ShaderMaterial({
      uniforms : {
        iGlobalTime: { type: 'f', value: 0 }
      },
      defines: {
        USE_MAP: ''
      },
      vertexShader : glslify(__dirname + '/shaders/passthrough.vert'),
      fragmentShader : fragShaders[i],
      side: THREE.DoubleSide,
      // wireframe: true
    });
    shaders.push(shaderMaterial);
  }
}

function setSameShaderForAllPlants(shaderIndex) {
  for (var i = 0; i < numPlants; i++) {
    succulents[i].material.fragmentShader = fragShaders[shaderIndex]
    succulents[i].material.needsUpdate = true
  }
}

function resetShadersForAllPlants() {
  for (var i=0; i < numPlants; i++) {
    succulents[i].material.fragmentShader = fragShaders[presets.plantParams[i].shaderIndex]
    succulents[i].material.needsUpdate = true
  }
}

// APP ENTRY POINT (LOVE THE MESSINESS, who has time for refactoring?)

domReady(function(){
  initThree()
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

function loadGardenFromPresetFile() {
  clearSucculents()
  presets.load(function(plantParams) {
    for (var i=0; i < numPlants; i++) {
      addSucculent(i, plantParams[i])
    }
  })
}

function generateNewRandomGarden() {
  clearSucculents()
  presets.generatePlantParams(numPlants, shaders.length)

  for (var i=0; i < numPlants; i++) {
    addSucculent(i, presets.plantParams[i])
  }
}

function initThree() {
  renderer = new THREE.WebGLRenderer({'antialias': true, alpha: false, precision: 'highp'});
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(new THREE.Color(0x333333, 1.0));

  container = document.getElementById('webglrender');
  container.appendChild(renderer.domElement);

  effect = new THREE.StereoEffect(renderer);
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(65, 1, 0.001, 1000);
  camera.position.set(0, 0.35, 0.75);
  scene.add(camera);

  controls = new Controls(WebMidi, scene, camera, renderer.domElement, handleControlsEvent)

  // setup the scene
  var setupLights = require('./js/lights')(THREE, scene);
  setupLights();
  loadShaderMaterials();

  window.addEventListener('resize', resize, false);
  setTimeout(resize, 1);
}

function resize() {
  var width = container.offsetWidth;
  var height = container.offsetHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  effect.setSize(width, height);
}

function update(t) {
  var tickCounter = (t / speed);

  for (var j = 0; j < shaders.length; j++) {
    shaders[j].uniforms.iGlobalTime.value = tickCounter;
  }
  resize()
  controls.update()
}

function render(dt) {
  if (useVR) {
    effect.render(scene, camera);
  } else {
    renderer.render(scene, camera);
  }
}

function animate(t) {
  requestAnimationFrame(animate);
  update(t);
  render(clock.getDelta());
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
  console.log('Handling control event of type: ' + e.type)
  switch (e.type) {
    case 'ADD_SUCCULENT_IN_RANDOM_POSITION':
      console.log('add a succulent randomly (outside of the normal parameter loading/saving)')
      console.log('will have to get random params, deal with this later....')
      break
    case 'SAVE_GARDEN_TO_PRESET_FILE':
      presets.save('plants.json')
      break
    case 'LOAD_GARDEN_FROM_PRESET_FILE':
      loadGardenFromPresetFile()
      break
    case 'GENERATE_NEW_RANDOM_GARDEN':
      generateNewRandomGarden()
      break
    // case 'TOGGLE_CAMERA_PRESETS_LEARN':
      // cameraRecordMode = !cameraRecordMode
      // break
    case 'DEBUGGER_PAUSE':
      debugger
      break
    case 'CAMERA_PRESETS_LEARN_TOGGLED': {
      updateIndicators(e.data)
      break
    }
    case 'CAMERA_PRESET_LEARN': {
      let presetIdentifier = e.data.presetIdentifier
      presets.updateCameraMap(presetIdentifier, camera, e.data)
      console.log('Updated camera presets for identifier: ' + presetIdentifier)
      break
    }
    case 'CAMERA_PRESET_TRIGGER': {
      // get the serialized matrix out of presets (which stores the matrix the matrix as an array for convenient persistence)
      // use the callback that controls gives to let it update camera / orbitcontrols state
      let presetIdentifier = e.data.presetIdentifier
      let map = presets.cameraMap[presetIdentifier]
      if (map) {
        controls.updateFromPresetData(map)
        console.log('Triggered orbit controls and camera update using preset with identifier: ' + presetIdentifier)
      } else {
        console.log('There is no preset for identifier: ' + presetIdentifier + '!')
      }
      break
    }
    case 'SET_SAME_SHADER_FOR_ALL_PLANTS': {
      setSameShaderForAllPlants(e.data.shaderIndex)
      break
    }
    case 'RESET_SHADERS_TO_INITIAL_SHADER_FOR_ALL_PLANTS':
      resetShadersForAllPlants()
      break
    case 'FIRST_PERSON_CAMERA_CONTROLS_TOGGLED': {
      updateIndicators(e.data)
      break
    }
    case 'AUDIO_ANALYSIS_FILTER_UPDATE':
      console.log(e.data.filter1Value + ' | ' + e.data.filter2Value + ' | ' + e.data.filter3Value)
      break
    default:
      console.log('Received unknown control type! *******')
      break
  }
}

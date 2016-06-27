var domReady = require('domready');
var dat = require('dat-gui');
var glslify = require('glslify');
var Succulent = require('./js/succulent')(THREE);
var Presets = require('./js/presets')


var camera, scene, renderer;
var effect, controls;
var element, container;
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
var cameraRecordMode = false

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
  // var randomShaderIndex = Math.floor(getRandomArbitrary(0, shaders.length));
  // var shaderMaterial = shaders[randomShaderIndex];

  var shaderIndex = plantParams['shaderIndex']
  var shaderMaterial = shaders[shaderIndex];

  var succulent = Succulent(shaderMaterial, plantParams);

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
    var fragShaderString = __dirname + '/shaders/1.frag';
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

function setupTapGestureRecognizer() {
  var mc = new Hammer.Manager(document.body);
  // Tap recognizer with minimal 2 taps
  mc.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }) );
  mc.add( new Hammer.Tap({ event: 'singletap' }) );
  // we want to recognize this simulatenous, so a quadrupletap will be detected even while a tap has been recognized.
  mc.get('doubletap').recognizeWith('singletap');
  // mc.get('tripletap').recognizeWith('doubletap');
  // we only want to trigger a tap, when we don't have detected a doubletap
  mc.get('singletap').requireFailure('doubletap');
// mc.get('doubletap').requireFailure('tripletap');

  mc.on("singletap", function(ev) {
      // addSucculent()
      // ^^ this is for mobile devices - won't work anymore since we're loading/saving garden params...probably need to put this on another branch
  });

  mc.on("doubletap", function(ev) {
      useVR = !useVR;
  });
}

// APP ENTRY POINT (LOVE THE MESSINESS, who has time for refactoring?)

domReady(function(){
  document.body.addEventListener('keypress', function(e) {
    switch (e.key) {
      case '+':
        console.log('add a succulent randomly (outside of the normal parameter loading/saving)')
        console.log('will have to get random params, deal with this later....')
        break
      case 's':
        presets.save('plants.json')
        break
      case 'l': // load or generate/save plant params
        loadGardenFromPresetFile()
        break
      case 'g': // generate new random garden
        generateNewRandomGarden()
        break
      case '/':
        cameraRecordMode = !cameraRecordMode
        break
      default:
        if (cameraRecordMode) {
          presets.updateCameraMap(e.key, controls, camera)
        } else {
          let map = presets.cameraMap[e.key]
          let cameraMatrix = map['cameraMatrix']
          // apply the position, quaternion, and scale from serialized matrix to the camera using decompose()
          var m = new THREE.Matrix4();
          m.fromArray(JSON.parse(cameraMatrix));
          m.decompose(camera.position, camera.quaternion, camera.scale)
          // orbit controls needed the center property to be updated to properly position the camera after a pan
          controls.target.set(map.controlsTarget.x, map.controlsTarget.y, map.controlsTarget.z)
        }
        break
    }
  })

  setupTapGestureRecognizer();
  initThree()
  generateNewRandomGarden();
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

// THREE STUFF

function initThree() {
  renderer = new THREE.WebGLRenderer({'antialias': true, alpha: false, precision: 'highp'});
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(new THREE.Color(0x333333, 1.0));

  element = renderer.domElement;
  container = document.getElementById('webglrender');
  container.appendChild(element);

  effect = new THREE.StereoEffect(renderer);
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(65, 1, 0.001, 1000);
  camera.position.set(0, 2.0, 0);
  scene.add(camera);

  controls = new THREE.OrbitControls(camera, element);

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

  controls.update();
  resize();
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

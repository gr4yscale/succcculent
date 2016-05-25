var domReady = require('domready');
var dat = require('dat-gui');
var glslify = require('glslify');
var Succulent = require('./js/succulent')(THREE);

var camera, scene, renderer;
var effect, controls;
var element, container;
var clock = new THREE.Clock();

var params = {
  speed: 1000,
};

var boxes = [];
var succulents = [];
var shaders = [];
var fragShaders = [];
var useVR = false;
// disable device orientation when VR is off
var timeOffsets = [];
var initialScaleMultipliers = [];
var succulentScaleFactors = [];
var randomPoints = [];
var spline;
var camPosIndex = 0;

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

function addSucculent() {
  var randomShaderIndex = Math.floor(getRandomArbitrary(0, shaders.length));
  var shaderMaterial = shaders[randomShaderIndex];

  var succulent = Succulent(shaderMaterial);

  var bboxHelperA = new THREE.BoundingBoxHelper(succulent);
  bboxHelperA.update();
  // var bbox = new THREE.Box3().setFromObject(succulent);
  var newBox = findRandomUnusedSucculentPosition(-0.02, 0.02, bboxHelperA.box);

  succulent.position.x = newBox.center().x;
  succulent.position.y = 0;
  succulent.position.z = newBox.center().z;

  var helper = new THREE.BoundingBoxHelper(succulent);
  helper.update();
  // helper.visible = true;
  // scene.add(helper);
  scene.add(succulent);
  boxes.push(helper.box);
  succulents.push(succulent);

  //randomPoints.push(new THREE.Vector3(succulent.position.x + getRandomArbitrary(-0.1, 0.1), 3.0, succulent.position.z + getRandomArbitrary(-0.1, 0.1)));
}

function loadShaderMaterials() {
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
    // console.log(fragShaderString);

    var shaderMaterial = new THREE.ShaderMaterial({
      uniforms : {
        iGlobalTime: { type: 'f', value: 0 }
      },
      defines: {
        USE_MAP: ''
      },
      vertexShader : glslify(__dirname + '/shaders/spiral.vert'),
      fragmentShader : fragShaders[i],
      // fragmentShader : glslify(__dirname + '/shaders/1.frag'),
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
      addSucculent();
  });

  mc.on("doubletap", function(ev) {
      useVR = !useVR;
  });
}

domReady(function(){
  document.body.addEventListener('keypress', function(e) {
    addSucculent();
  });

  setupTapGestureRecognizer();
  initThree();

  for (var i = 0; i < succulents.length; i++) {
    initialScaleMultipliers[i] = getRandomArbitrary(0.1, 1.0);
    // console.log(initialScaleMultipliers[i]);
    timeOffsets[i] = getRandomArbitrary(1.0, 30000.0);
  }

  animate();
});

function initThree() {
  // three boilerplate junk
  renderer = new THREE.WebGLRenderer({'antialias': true, alpha: false, precision: 'highp'});
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(new THREE.Color(0x333333, 1.0));

  console.log(renderer.getPrecision())

  element = renderer.domElement;
  container = document.getElementById('webglrender');
  container.appendChild(element);

  effect = new THREE.StereoEffect(renderer);
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(65, 1, 0.001, 1000);
  camera.position.set(0, 2.0, 0);
  scene.add(camera);

  // setup orbit controls
  controls = new THREE.OrbitControls(camera, element);
  controls.target.set(
    camera.position.x + 0.1,
    camera.position.y - 0.1,
    camera.position.z
  );
  // controls.noZoom = true;
  // controls.noPan = true;

  // setup orientation controls
  function setOrientationControls(e) {
    if (!e.alpha) {
      return;
    }

    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();

    element.addEventListener('click', fullscreen, false);

    window.removeEventListener('deviceorientation', setOrientationControls, true);
  }
  window.addEventListener('deviceorientation', setOrientationControls, true);

  // setup the scene
  var setupLights = require('./js/lights')(THREE, scene);
  setupLights();
  loadShaderMaterials();

  for ( var i = 0; i < 100; i ++ ) {
      randomPoints.push(new THREE.Vector3(Math.random() * 15 - 7, getRandomArbitrary(0.5, 1.0), 12-i));
  }
  spline = new THREE.SplineCurve3(randomPoints);

  for (var i = 0; i < 150; i++) {
    addSucculent()
  }

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
  var tickCounter = (t / params.speed);
  shaders[0].uniforms.iGlobalTime.value = tickCounter;
  shaders[1].uniforms.iGlobalTime.value = tickCounter;
  shaders[2].uniforms.iGlobalTime.value = tickCounter;
  shaders[3].uniforms.iGlobalTime.value = tickCounter;
  shaders[4].uniforms.iGlobalTime.value = tickCounter;
  shaders[5].uniforms.iGlobalTime.value = tickCounter;
  shaders[6].uniforms.iGlobalTime.value = tickCounter;
  shaders[7].uniforms.iGlobalTime.value = tickCounter;
  shaders[8].uniforms.iGlobalTime.value = tickCounter;
  shaders[9].uniforms.iGlobalTime.value = tickCounter;
  shaders[10].uniforms.iGlobalTime.value = tickCounter;
  shaders[11].uniforms.iGlobalTime.value = tickCounter;
  shaders[12].uniforms.iGlobalTime.value = tickCounter;
  shaders[13].uniforms.iGlobalTime.value = tickCounter;

  for (var i = 0; i < succulents.length; i++) {
    var succulent = succulents[i];
    //var scale = (Math.sin(timeOffsets[i] + tickCounter * 1.0) + 1.0) * initialScaleMultipliers[i];

    var scaleTickCounter = (t / (params.speed * 3.0));
    // var scaleX = (Math.sin(timeOffsets[i] + scaleTickCounter * 1.0) + 1.0) * initialScaleMultipliers[i];
    // var scaleY = 0.55 + (Math.cos(timeOffsets[i] + scaleTickCounter * 1.0) + 1.0) * initialScaleMultipliers[i];
    // var scaleZ = (Math.sin(timeOffsets[i] + scaleTickCounter * 1.0) + 1.0) * initialScaleMultipliers[i];

    var scaleX = (Math.sin(timeOffsets[i] + scaleTickCounter * 2.0) + 1.05) * initialScaleMultipliers[i];
    var scaleY = 0.5 + (Math.cos(timeOffsets[i] + scaleTickCounter * 2.0) + 1.0) * initialScaleMultipliers[i];
    var scaleZ = (Math.sin(timeOffsets[i] + scaleTickCounter * 1.0)) * initialScaleMultipliers[i];

    // console.log(scale);
    //succulent.scale.set(scaleX, scaleY, scaleZ);
    // succulent.scale.set(scaleX, scaleY, scaleX);
  }

  camPosIndex++;
  if (camPosIndex > 20000) {
    camPosIndex = 0;
  }
  var camPos = spline.getPoint(camPosIndex / 20000);
  //var camRot = spline.getTangent(camPosIndex / 1000);

  //camera.position.x = camPos.x;
  // camera.position.y = camPos.y;
  // camera.position.z = camPos.z;


  //camera.position.x = Math.sin(t / 10000) * 3.0;
  //camera.position.y = 0.5;
  //camera.position.z = Math.cos(t / 10000) * 3.0;

  controls.update(t);

  camera.updateProjectionMatrix();

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

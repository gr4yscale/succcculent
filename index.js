var domReady = require('domready');
var dat = require('dat-gui');
var glslify = require('glslify');

var Succulent = require('./js/succulent')(THREE);

domReady(function(){
  var params = {
    speed: 1000,
  };

  var boxes = [];
  var shaders = [];
  var fragShaders = [];

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
    // app.scene.add(helper);
    app.scene.add(succulent);
    boxes.push(helper.box);
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
        vertexShader : glslify(__dirname + '/shaders/passthrough.vert'),
        fragmentShader : fragShaders[i],
        // fragmentShader : glslify(__dirname + '/shaders/1.frag'),
        side: THREE.DoubleSide,
        // wireframe: true
      });
      shaders.push(shaderMaterial);
    }
  }

  // var datgui = new dat.GUI();
  var OrbitViewer = require('three-orbit-viewer')(THREE);
  var app = OrbitViewer({
    clearColor: 'rgb(50,50,50)',
    clearAlpha: 1.0,
    fov: 65,
    contextAttributes: {
      antialias: true,
      alpha: false
    },
    position: new THREE.Vector3(0, 2, -2.5),
    //target: new THREE.Vector3(0,0.5,0)
  });
  var setupLights = require('./js/lights')(THREE, app.scene);
  setupLights();
  loadShaderMaterials();

  for (var i = 0; i < 200; i++) {
    addSucculent()
  }

  // render loop
  var tickCounter = 0;
  app.on('tick', function(time) {
    tickCounter += (time / params.speed);
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

    //light.position.set( 0, params.lightYPosition, 0);
  });

  // params GUI
  // datgui.add(params, "speed", 10, 2000);
//datgui.add(params, 'height', 0.02, 3).step(0.01);

});

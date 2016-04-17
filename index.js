var domReady = require('domready');
var dat = require('dat-gui');

var glslify = require('glslify');

domReady(function(){

  var params = {
    speed: 1000,
    opacity : 0.25,
    width : 2.0,
    height : 0.2,
    boxThickness : 1.0,
    hueRange : 0.35,
    hueOffset : 0.3,
    twistSpeed : 0.0,
    rotationSpeed : 0.00,
    lightYPosition : 80
  };

  var OrbitViewer = require('three-orbit-viewer')(THREE);

  var app = OrbitViewer({
    clearColor: 'rgb(50,50,50)',
    clearAlpha: 1.0,
    fov: 65,
    contextAttributes: {
      antialias: true,
      alpha: false
    },
    position: new THREE.Vector3(0,1.4,-1.75),
    target: new THREE.Vector3(0,0.5,0)
  });

  var datgui = new dat.GUI();

  var light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
  light.position.set(0, 40, 80);

  var lightB = new THREE.DirectionalLight(0xFFFFFF, 1.0); 
  lightB.position.set(1, 20, 1);

  lightB.castShadow = true;
  lightB.shadowCameraVisible = true;
  
  lightB.shadowCameraNear = 1;
  lightB.shadowCameraFar = 1000;
  lightB.shadowCameraLeft = -1000;
  lightB.shadowCameraRight = 1000;
  lightB.shadowCameraTop = 1000;
  lightB.shadowCameraBottom = -1000;
  lightB.distance = 0;
  lightB.intensity = 1.0;

  //app.scene.add(light);
  app.scene.add(lightB);

  var spotLight = new THREE.SpotLight();
  spotLight.angle = Math.PI / 8;
  spotLight.exponent = 30;
  spotLight.position.copy(new THREE.Vector3(40, 60, -50));


  spotLight.castShadow = true;
  spotLight.shadowCameraNear = 50;
  spotLight.shadowCameraFar = 200;
  spotLight.shadowCameraFov = 35;
  spotLight.shadowMapHeight = 2048;
  spotLight.shadowMapWidth = 2048;

  spotLight.name = 'spotLight';
  app.scene.add(spotLight);


  var petals = [];
  var petalCount = 60;
  var curveAmountA;
  var curveAmountB = 0.2; // multiplier for log curvature
  var curveAmountC = 0.6; // initial curve amount
  var curveAmountD = 0.2;
  var layers = 8.0;
  var petalLength = 0.5;
  var petalWidth = 0.4;

  // shader
  var shaderMaterial = new THREE.ShaderMaterial({
      uniforms : {
        iGlobalTime: { type: 'f', value: 0 }
      },
      defines: {
        USE_MAP: ''
      },
      vertexShader : glslify(__dirname + '/shaders/sketch.vert'),
      fragmentShader : glslify(__dirname + '/shaders/sketch.frag'),
      side: THREE.DoubleSide
  });

  var material = new THREE.MeshLambertMaterial({
                  color: 0xFF333FF,
                  side: THREE.DoubleSide,
                  shading: THREE.SmoothShading,
                  //wireframe: true
                });


  var petalFunc = function (u, v) {
            var curve = Math.pow(u * 4.0, curveAmountD) * curveAmountA; // * (Math.pow(u, 0.9));
            var petalOutline = (Math.sin((u - 1.5) * 2.0) * Math.sin((v - 0.5) * Math.sin((u + 2.14))) * 2.0);
            return new THREE.Vector3(petalOutline * petalWidth, u * petalLength, curve);
        };

  var createPetalMesh = function() {
    var geom = new THREE.ParametricGeometry(petalFunc, 20, 20);
    var mesh = new THREE.Mesh(geom, shaderMaterial);
    return mesh;
  }

  for (var i = 0; i < petalCount; i++) {
    var j = i / petalCount;
    var rotationAmount = j * layers;
    //curveAmount = 0.1 + (Math.pow(j, 2.0) * 1.000001);
    curveAmountA = Math.abs(curveAmountC + (Math.log(j) * curveAmountB));
    var petalMesh = createPetalMesh();

    petalMesh.rotation.y = THREE.Math.degToRad(rotationAmount * 360);

    var scale = curveAmountA;
    petalMesh.scale.x = scale;
    petalMesh.scale.y = scale;
    petalMesh.scale.z = scale;

    petals.push();
    app.scene.add(petalMesh);
  }

  //app.camera.position.x = 0;
  //app.camera.position.y = 0;
  //app.camera.position.z = -1;

  //var helper = new THREE.BoundingBoxHelper(mesh, 0xff0000);
  //helper.update();
  //app.scene.add(helper);

  var sphereGeom = new THREE.SphereGeometry(0.01, 10, 10);
  var sphereMesh = new THREE.Mesh(sphereGeom, material);

  app.scene.add(sphereMesh);

  // render loop

  var tickCounter = 0;
  app.on('tick', function(time) {
    tickCounter += (time / params.speed);

    shaderMaterial.uniforms.iGlobalTime.value = tickCounter;
    //light.position.set( 0, params.lightYPosition, 0);
  });
});

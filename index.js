var domReady = require('domready');
var dat = require('dat-gui');

var Succulent = require('./js/succulent')(THREE);

domReady(function(){

  var params = {
    speed: 1000,
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
    position: new THREE.Vector3(0, 0.5,-.5),
    //target: new THREE.Vector3(0,0.5,0)
  });

  // var datgui = new dat.GUI();

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

  //app.camera.position.x = 0;
  //app.camera.position.y = 0;
  //app.camera.position.z = -1;

  //var sphereGeom = new THREE.SphereGeometry(0.01, 10, 10);
  //var sphereMesh = new THREE.Mesh(sphereGeom, material);

  //app.scene.add(sphereMesh);

  var succulentA = Succulent();
  app.scene.add(succulentA);

  var helper = new THREE.BoundingBoxHelper(succulentA, 0xff0000);
  helper.update();
  app.scene.add(helper);

  // render loop
  var tickCounter = 0;
  app.on('tick', function(time) {
    tickCounter += (time / params.speed);

    // shaderMaterial.uniforms.iGlobalTime.value = tickCounter;
    //light.position.set( 0, params.lightYPosition, 0);
  });


  // params GUI
  //datgui.add(params, "speed", 10, 2000);
  //datgui.add(params, 'opacity', 0.1, 1);
  //datgui.add(params, 'height', 0.02, 3).step(0.01);

});

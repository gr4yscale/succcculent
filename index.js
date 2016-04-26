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
    position: new THREE.Vector3(0, 1.5, -2),
    //target: new THREE.Vector3(0,0.5,0)
  });

  var datgui = new dat.GUI();

  var setupLights = require('./js/lights')(THREE, app.scene);
  setupLights();

  var material = new THREE.MeshLambertMaterial({
    color: 0xFF333FF,
    side: THREE.DoubleSide,
    shading: THREE.SmoothShading,
    //wireframe: true
  });

  var sphereGeom = new THREE.SphereGeometry(0.01, 10, 10);
  var sphereMesh = new THREE.Mesh(sphereGeom, material);
  app.scene.add(sphereMesh);

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  for (var i = 0; i < 16; i++) {
    var succulent = Succulent();

    succulent.position.x = getRandomArbitrary(-3, 3);
    succulent.position.z = getRandomArbitrary(-3, 3);
    app.scene.add(succulent);

    var helper = new THREE.BoundingBoxHelper(succulent, 0xff0000);
    helper.update();
    app.scene.add(helper);
  }

  // render loop
  var tickCounter = 0;
  app.on('tick', function(time) {
    tickCounter += (time / params.speed);
    // shaderMaterial.uniforms.iGlobalTime.value = tickCounter;
    //light.position.set( 0, params.lightYPosition, 0);
  });

  // params GUI
  datgui.add(params, "speed", 10, 2000);
//datgui.add(params, 'height', 0.02, 3).step(0.01);

});

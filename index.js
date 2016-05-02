var domReady = require('domready');
var dat = require('dat-gui');
var Succulent = require('./js/succulent')(THREE);

domReady(function(){
  var params = {
    speed: 1000,
  };

  var boxes = [];

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

  for (var i = 0; i < 40; i++) {
    var succulent = Succulent();

    var bbox = new THREE.Box3().setFromObject(succulent);
    var newBox = findRandomUnusedSucculentPosition(-0.02, 0.02, bbox);

    succulent.position.x = newBox.center().x;
    succulent.position.y = 0;
    succulent.position.z = newBox.center().z;
    succulent.updateMatrix();

    var helper = new THREE.BoundingBoxHelper(succulent);
    helper.update();
    // helper.visible = true;
    // app.scene.add(helper);

    app.scene.add(succulent);
    boxes.push(helper.box);
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

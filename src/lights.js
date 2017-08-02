module.exports = function(THREE, scene) {
  return function() {
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
    scene.add(lightB);

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

    scene.add(spotLight);
  }
}

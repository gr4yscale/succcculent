var glslify = require('glslify');

module.exports = function(THREE) {

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  return function() {
    var petals = [];
    var petalCount = Math.floor(getRandomArbitrary(20, 40));
    var curveAmountA;
    var curveAmountB = getRandomArbitrary(0.08, 0.20); // multiplier for log curvature
    var curveAmountC = getRandomArbitrary(0.2, 0.6); // initial curve amount
    var curveAmountD = getRandomArbitrary(0.2, 0.5);
    var layers = Math.floor(getRandomArbitrary(6, 10));
    var petalLength = getRandomArbitrary(0.1, 0.7);
    var petalWidth = getRandomArbitrary(0.4, 0.6);

    // shader
    var shaderMaterial = new THREE.ShaderMaterial({
      uniforms : {
        iGlobalTime: { type: 'f', value: 0 }
      },
      defines: {
        USE_MAP: ''
      },
      vertexShader : glslify('../shaders/sketch.vert'),
      fragmentShader : glslify('../shaders/sketch.frag'),
      side: THREE.DoubleSide
    });

    // console.log(shaderMaterial);
    // console.log(shaderMaterial);

    var material = new THREE.MeshLambertMaterial({
      color: 0xFF333FF,
      side: THREE.DoubleSide,
      shading: THREE.SmoothShading,
      //wireframe: true
    });

    var petalFunc = function (u, v) {
      var curve = Math.pow(u * 4.0, curveAmountD) * curveAmountA; // * (Math.pow(u, 0.9));
      // var curve = Math.pow(u * 4.0, curveAmountD) * curveAmountA; // * (Math.pow(u, 0.9));
      var petalOutline = (Math.sin((u - 1.5) * 2.0) * Math.sin((v - 0.5) * Math.sin((u + 2.14))) * 2.0);
      return new THREE.Vector3(petalOutline * petalWidth, u * petalLength, curve);
    };

    var createPetalMesh = function() {
      var geom = new THREE.ParametricGeometry(petalFunc, 20, 20);
      var mesh = new THREE.Mesh(geom, shaderMaterial);
      return mesh;
    }

    var boxGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    var boxMesh = new THREE.Mesh(boxGeometry, shaderMaterial);
    var singleGeometry = new THREE.Geometry();

    for (var i = 1; i < petalCount; i++) {
      var j = i / petalCount;
      var rotationAmount = j * layers;

      // this is responsible for the weird "blow out" effect of a strange huge leaf off the side
      curveAmountA = Math.abs(curveAmountC + (Math.log(j) * curveAmountB));
      // curveAmountA = Math.abs(curveAmountC + Math.log(j) * 0.08); // 0.08 is a sane-ish value
      //curveAmount = 0.1 + (Math.pow(j, 2.0) * 1.000001);

      var petalMesh = createPetalMesh();

      petalMesh.rotation.y = THREE.Math.degToRad(rotationAmount * 360);

      var scale = curveAmountA;
      petalMesh.scale.x = scale;
      petalMesh.scale.y = scale;
      petalMesh.scale.z = scale;
      petals.push();

      petalMesh.updateMatrix();
      singleGeometry.merge(petalMesh.geometry, petalMesh.matrix);

      // sphereMesh.add(petalMesh);
    }

    singleMesh = new THREE.Mesh(singleGeometry, shaderMaterial);

    return singleMesh;
  }
}

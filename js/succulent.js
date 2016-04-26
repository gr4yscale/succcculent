var glslify = require('glslify');

module.exports = function(THREE) {
  return function() {
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
      var petalOutline = (Math.sin((u - 1.5) * 2.0) * Math.sin((v - 0.5) * Math.sin((u + 2.14))) * 2.0);
      return new THREE.Vector3(petalOutline * petalWidth, u * petalLength, curve);
    };

    var createPetalMesh = function() {
      var geom = new THREE.ParametricGeometry(petalFunc, 20, 20);
      var mesh = new THREE.Mesh(geom, shaderMaterial);
      return mesh;
    }

    var sphereGeom = new THREE.SphereGeometry(0.01, 10, 10);
    var sphereMesh = new THREE.Mesh(sphereGeom, material);

    for (var i = 0; i < petalCount; i++) {
      var j = i / petalCount;
      var rotationAmount = j * layers;
      //curveAmount = 0.1 + (Math.pow(j, 2.0) * 1.000001);
      curveAmountA = Math.abs(curveAmountC + (Math.log(j) * curveAmountB));
      var petalMesh = createPetalMesh();

      // console.log(curveAmountA);

      petalMesh.rotation.y = THREE.Math.degToRad(rotationAmount * 360);

      var scale = curveAmountA;
      petalMesh.scale.x = scale;
      petalMesh.scale.y = scale;
      petalMesh.scale.z = scale;

      petals.push();
      sphereMesh.add(petalMesh);
    }

    return sphereMesh;
  }
}

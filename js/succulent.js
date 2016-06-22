module.exports = function(THREE) {

  return function(shaderMaterial, plantParams) {
    var petalCount = plantParams['petalCount']
    var curveAmountA; // this is on a per-petal basis so doesn't come from a global param
    var curveAmountB = plantParams['curveAmountB']
    var curveAmountC = plantParams['curveAmountC']
    var curveAmountD = plantParams['curveAmountD']
    var layers = plantParams['layers']
    var petalLength = plantParams['petalLength']
    var petalWidth = plantParams['petalWidth']

    var petalFunc = function (u, v) {
      var curve = Math.pow(u * 4.0, curveAmountD) * curveAmountA; // * (Math.pow(u, 0.9));
      // var curve = Math.pow(u * 4.0, curveAmountD) * curveAmountA; // * (Math.pow(u, 0.9));
      // var petalOutline = (Math.sin((u - 1.5) * 2.0) * Math.sin((v - 0.5) * Math.sin((u + 2.14))) * 2.0);

      var petalOutline = (Math.sin((u - 1.5) * 2.0) * Math.sin((v - 0.5) * Math.sin((u + 2.14))) * 2.0);

      return new THREE.Vector3(petalOutline * petalWidth, u * petalLength, curve);
    };

    var createPetalMesh = function() {
      var geom = new THREE.ParametricGeometry(petalFunc, 6, 6);
      var mesh = new THREE.Mesh(geom, shaderMaterial);
      return mesh;
    }

    var singleGeometry = new THREE.Geometry();

    for (var i = 1; i < petalCount; i++) {
      var j = i / petalCount;
      var rotationAmount = j * layers;

      // this is responsible for the weird "blow out" effect of a strange huge leaf off the side
      curveAmountA = Math.abs(curveAmountC + Math.log(j) * 0.08); // 0.08 is a sane-ish value
      // curveAmountA = Math.abs(curveAmountC + (Math.log(j) * curveAmountB));

      var petalMesh = createPetalMesh();
      petalMesh.rotation.y = THREE.Math.degToRad(rotationAmount * 360);

      var scale = curveAmountA;
      petalMesh.scale.x = scale;
      petalMesh.scale.y = scale;
      petalMesh.scale.z = scale;

      petalMesh.updateMatrix();
      singleGeometry.merge(petalMesh.geometry, petalMesh.matrix);
    }

    var singleMesh = new THREE.Mesh(singleGeometry, shaderMaterial);

    return singleMesh;
  }
}

module.exports = function(THREE) {

  return (shaderMaterial, plantParams, textureLoadedCallback) => {

    var petalFunc = function (u, v) {
      var curve = Math.pow(u * 4.0, curveAmountD) * curveAmountA; // * (Math.pow(u, 0.9));
      // var curve = Math.pow(u * 4.0, curveAmountD) * curveAmountA; // * (Math.pow(u, 0.9));
      // var petalOutline = (Math.sin((u - 1.5) * 2.0) * Math.sin((v - 0.5) * Math.sin((u + 2.14))) * 2.0);

      var petalOutline = (Math.sin((u - 1.5) * 2.0) * Math.sin((v - 0.5) * Math.sin((u + 2.14))) * 2.0);

      return new THREE.Vector3(petalOutline * petalWidth, u * petalLength, curve);
    };

    var createPetalMesh = function(texture) {
      if (texture) {
        shaderMaterial = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
      }
      var geom = new THREE.ParametricGeometry(petalFunc, 6, 6);
      var mesh = new THREE.Mesh(geom, shaderMaterial);
      return mesh;
    }

    var updatePlantWithTextureMaterial = function(texture) {

      // TOFIX:

      // CLONE GEOMETRY, MAKE A NEW MATERIAL AFTER TEXTURE IS LOADED,
      // REMOVE OLD GEOM, ADD NEW GEOM
    }

    var createPlant = function(texture) {
      var singleGeometry = new THREE.Geometry();

      for (var i = 1; i < petalCount; i++) {
        var j = i / petalCount;
        var rotationAmount = j * layers;

        // this is responsible for the weird "blow out" effect of a strange huge leaf off the side
        curveAmountA = Math.abs(curveAmountC + Math.log(j) * 0.08); // 0.08 is a sane-ish value
        // curveAmountA = Math.abs(curveAmountC + (Math.log(j) * curveAmountB));

        var petalMesh = createPetalMesh(texture);
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

    var petalCount = plantParams['petalCount']
    var curveAmountA; // this is on a per-petal basis so doesn't come from a global param
    var curveAmountB = plantParams['curveAmountB']
    var curveAmountC = plantParams['curveAmountC']
    var curveAmountD = plantParams['curveAmountD']
    var layers = plantParams['layers']
    var petalLength = plantParams['petalLength']
    var petalWidth = plantParams['petalWidth']

    // if the plant is textured, then we need to return it async, otherwise return it immediately
    if (plantParams.textureFileName) {
      var loader = new THREE.TextureLoader();
      loader.load(plantParams.textureFileName, function (texture) {
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(1, 1)
        textureLoadedCallback(createPlant(texture))
      })
    } else {
      return createPlant()
    }
  }
}

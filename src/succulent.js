export default (THREE) => {
  return (shaderMaterial, plantParams, textureLoadedCallback) => {

    var petalCount = plantParams['petalCount']
    var curveAmountA; // this is on a per-petal basis so doesn't come from a global param
    // var curveAmountB = plantParams['curveAmountB']
    var curveAmountC = plantParams['curveAmountC']
    var curveAmountD = plantParams['curveAmountD']
    var layers = plantParams['layers']
    var petalLength = plantParams['petalLength']
    var petalWidth = plantParams['petalWidth']
    var mergePetalGeometry = plantParams['mergePetalGeometry']

    var petalFunc = function (u, v) {
      var curve = Math.pow(u * 4.0, curveAmountD) * curveAmountA; // * (Math.pow(u, 0.9));
      // var curve = Math.pow(u * 4.0, curveAmountD) * curveAmountA; // * (Math.pow(u, 0.9));
      // var petalOutline = (Math.sin((u - 1.5) * 2.0) * Math.sin((v - 0.5) * Math.sin((u + 2.14))) * 2.0);

      var petalOutline = (Math.sin((u - 1.5) * 2.0) * Math.sin((v - 0.5) * Math.sin((u + 2.14))) * 2.0);

      // u += (Math.sin((6 - v) * -2.0) * -2.0)
      // u += (Math.sin((u) * 4.0) * 1.0) // spidery

      return new THREE.Vector3(petalOutline * petalWidth, u * petalLength, curve);
      // return new THREE.Vector3(petalOutline * petalWidth, u * petalLength, curve * 4.0);
    }

    var createPetalMesh = function(texture) {
      if (texture) {
        shaderMaterial = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
      }

      var parametricGeometry = new THREE.ParametricGeometry(petalFunc, 11, 11);
      parametricGeometry.computeVertexNormals()

        if (mergePetalGeometry === true) {
            return new THREE.Mesh(parametricGeometry, shaderMaterial);
        } else {
            var bufferGeom = new THREE.BufferGeometry()
            bufferGeom.fromGeometry(parametricGeometry)
            return new THREE.Mesh(bufferGeom, shaderMaterial);
        }
    }

    // var updatePlantWithTextureMaterial = function(texture) {
    //   // todo:
    //   // CLONE GEOMETRY, MAKE A NEW MATERIAL AFTER TEXTURE IS LOADED,
    //   // REMOVE OLD GEOM, ADD NEW GEOM
    // }

    var createPlant = function(texture) {
      var singleGeometry = new THREE.Geometry();

      var singleMesh = new THREE.Mesh(singleGeometry, shaderMaterial);

      for (var i = 1; i < petalCount; i++) {
        var j = i / petalCount;
        // var rotationAmount = j * layers;
        var rotationAmount = i * layers / petalCount;

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

        if (mergePetalGeometry === true) {
            singleGeometry.merge(petalMesh.geometry, petalMesh.matrix);
            singleGeometry.computeVertexNormals()
        } else {
            singleMesh.add(petalMesh)
        }
      }

      // var instanceGeom = createInstancedGeometry(singleGeometry, shaderMaterial)
      // let instanceMesh = new THREE.Mesh(instanceGeom, shaderMaterial);
      // instanceMesh.frustumCulled = false;
      // return instanceMesh;

      return singleMesh;
    }

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


// var createInstancedGeometry = function( geometry  , attributes ){
//
//   var positions; var normals;
//
//   if( geometry instanceof THREE.BufferGeometry ){
//
//     positions = geometry.attributes.position.array;
//     normals = geometry.attributes.normal.array;
//
//   }else{
//
//     var faces = geometry.faces.length;
//
//     // Get the totalVerts by looking up how many faces
//     // we've got in the geometry
//
//     positions = new Float32Array( faces * 3 * 3 );
//     normals   = new Float32Array( faces * 3 * 3 );
//
//     for( var j = 0; j < faces; j++ ){
//
//       var index =  j * 3;
//
//       var face = geometry.faces[j];
//
//       var p1 = geometry.vertices[ face.a ];
//       var p2 = geometry.vertices[ face.b ];
//       var p3 = geometry.vertices[ face.c ];
//
//       var n1 = face.vertexNormals[ 0 ];
//       var n2 = face.vertexNormals[ 1 ];
//       var n3 = face.vertexNormals[ 2 ];
//
//       positions[ index * 3  + 0 ] = p1.x;
//       positions[ index * 3  + 1 ] = p1.y;
//       positions[ index * 3  + 2 ] = p1.z;
//
//       positions[ index * 3  + 3 ] = p2.x;
//       positions[ index * 3  + 4 ] = p2.y;
//       positions[ index * 3  + 5 ] = p2.z;
//
//       positions[ index * 3  + 6 ] = p3.x;
//       positions[ index * 3  + 7 ] = p3.y;
//       positions[ index * 3  + 8 ] = p3.z;
//
//       normals[ index * 3  + 0 ] = n1.x;
//       normals[ index * 3  + 1 ] = n1.y;
//       normals[ index * 3  + 2 ] = n1.z;
//
//       normals[ index * 3  + 3 ] = n2.x;
//       normals[ index * 3  + 4 ] = n2.y;
//       normals[ index * 3  + 5 ] = n2.z;
//
//       normals[ index * 3  + 6 ] = n3.x;
//       normals[ index * 3  + 7 ] = n3.y;
//       normals[ index * 3  + 8 ] = n3.z;
//
//     }
//
//   }
//
//   var geo = new THREE.InstancedBufferGeometry();
//   geo.maxInstancedCount = 250;
//
//
//   // Taking care of our instanced geometry
//   var a_position  = new THREE.BufferAttribute( positions , 3 );
//   var a_normal    = new THREE.BufferAttribute( normals   , 3 );
//
//   geo.addAttribute( 'position'  , a_position );
//   geo.addAttribute( 'normal'    , a_normal   );
//
//
//   var instances = 250
//   // per instance data
//   var offsets = new THREE.InstancedBufferAttribute( new Float32Array( instances * 3 ), 3, 1 );
//   var instanceIDs = new THREE.InstancedBufferAttribute( new Float32Array( instances ), 1, 1 );
//
//   var vector = new THREE.Vector4();
//   for ( var i = 0, ul = offsets.count; i < ul; i++ ) {
//       var x = i * 0.2
//       var y = i * 0.2
//       var z = -50; // Math.random() * 10 - 5;
//       vector.set( x, y, z, 0 ).normalize();
//       // move out at least 5 units from center in current direction
//       offsets.setXYZ( i, x + vector.x, y + vector.y, z + vector.z);
//       instanceIDs.setX( i, i );
//   }
//
//   geo.addAttribute( 'offset', offsets ); // per mesh translation
//   geo.addAttribute( 'instanceID', instanceIDs ); // per mesh instance
//
//   return geo;
//
// }

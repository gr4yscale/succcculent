import * as THREE from 'three'

export default () => {
    return (shaderMaterial, plantParams, textureLoadedCallback) => {

        let petalCount = plantParams['petalCount']
        let curveAmountA; // this is on a per-petal basis so doesn't come from a global param
        // let curveAmountB = plantParams['curveAmountB']
        let curveAmountC = plantParams['curveAmountC']
        let curveAmountD = plantParams['curveAmountD']
        let layers = plantParams['layers']
        let petalLength = plantParams['petalLength']
        let petalWidth = plantParams['petalWidth']
        let mergePetalGeometry = plantParams['mergePetalGeometry']

        let petalFunc = function (u, v, target) {
            let curve = Math.pow(u * 4.0, curveAmountD) * curveAmountA; // * (Math.pow(u, 0.9));
            // let curve = Math.pow(u * 4.0, curveAmountD) * curveAmountA; // * (Math.pow(u, 0.9));
            // let petalOutline = (Math.sin((u - 1.5) * 2.0) * Math.sin((v - 0.5) * Math.sin((u + 2.14))) * 2.0);

            let petalOutline = (Math.sin((u - 1.5) * 2.0) * Math.sin((v - 0.5) * Math.sin((u + 2.14))) * 2.0);

            // u += (Math.sin((6 - v) * -2.0) * -2.0)
            // u += (Math.sin((u) * 4.0) * 1.0) // spidery

            target.set(petalOutline * petalWidth, u * petalWidth, curve)

            // return new THREE.Vector3(petalOutline * petalWidth, u * petalLength, curve);
            // return new THREE.Vector3(petalOutline * petalWidth, u * petalLength, curve * 4.0);
        }

        let createPetalMesh = function (texture) {
            if (texture) {
                shaderMaterial = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
            }

            let parametricGeometry = new THREE.ParametricGeometry(petalFunc, 9, 9);
            parametricGeometry.computeVertexNormals()

            if (mergePetalGeometry === true) {
                return new THREE.Mesh(parametricGeometry, shaderMaterial);
            } else {
                let bufferGeom = new THREE.BufferGeometry()
                bufferGeom.fromGeometry(parametricGeometry)
                return new THREE.Mesh(bufferGeom, shaderMaterial);
            }
        }

        // let updatePlantWithTextureMaterial = function(texture) {
        //   // todo:
        //   // CLONE GEOMETRY, MAKE A NEW MATERIAL AFTER TEXTURE IS LOADED,
        //   // REMOVE OLD GEOM, ADD NEW GEOM
        // }

        let createPlant = function (texture) {
            let singleGeometry = new THREE.Geometry();

            let singleMesh = new THREE.Mesh(singleGeometry, shaderMaterial);

            for (let i = 1; i < petalCount; i++) {
                let j = i / petalCount;
                // let rotationAmount = j * layers;
                let rotationAmount = i * layers / petalCount;

                // this is responsible for the weird "blow out" effect of a strange huge leaf off the side
                curveAmountA = Math.abs(curveAmountC + Math.log(j) * 0.08); // 0.08 is a sane-ish value
                // curveAmountA = Math.abs(curveAmountC + (Math.log(j) * curveAmountB));

                let petalMesh = createPetalMesh(texture);
                petalMesh.rotation.y = THREE.Math.degToRad(rotationAmount * 360);

                let scale = curveAmountA;
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

            // let instanceGeom = createInstancedGeometry(singleGeometry, shaderMaterial)
            // let instanceMesh = new THREE.Mesh(instanceGeom, shaderMaterial);
            // instanceMesh.frustumCulled = false;
            // return instanceMesh;

            return singleMesh;
        }

        // if the plant is textured, then we need to return it async, otherwise return it immediately
        if (plantParams.textureFileName) {
            let loader = new THREE.TextureLoader();
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



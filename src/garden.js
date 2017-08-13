import {getRandomArbitrary} from './util'
import {randomPositionTestOffset} from './config'
import setupLights from './lights'

//todo dependency injection?
let THREE, Succulent

let camera, scene, renderer, container
let boxes, succulents, shaders, fragShaders

// todo hack/test before store does this
const genPlantParams = () => {
  let plantParams = []
  for (let i = 0; i < 10; i++) {

    let adHocPlantParamsPetalCount = 36
    let adHocPlantParamsCurveAmountB = 0.13275223848488998
    let adHocPlantParamsCurveAmountC = 0.20827196143002302
    let adHocPlantParamsCurveAmountD = 0.36005163068644075
    let adHocPlantParamsLayers = 6
    let adHocPlantParamsPetalLength = 0.43796780893085985
    let adHocPlantParamsPetalWidth = 0.5438646263177942

    let petalCount = Math.floor(adHocPlantParamsPetalCount)
    let petalLength = adHocPlantParamsPetalLength
    let petalWidth = adHocPlantParamsPetalWidth
    let curveAmountB = adHocPlantParamsCurveAmountB
    let curveAmountC = adHocPlantParamsCurveAmountC
    let curveAmountD = adHocPlantParamsCurveAmountD
    let layers = Math.floor(adHocPlantParamsLayers)

    let shaderIndex = 0

    let params = {
      petalCount: petalCount,
      curveAmountB: curveAmountB,
      curveAmountC: curveAmountC,
      curveAmountD: curveAmountD,
      layers: layers,
      petalLength: petalLength,
      petalWidth: petalWidth,
      positionX: 'not_placed',
      positionY: 'not_placed',
      positionZ: 'not_placed',
      shaderIndex
    }
    plantParams.push(params)
  }

  return plantParams
}

class Garden {
  constructor(THREE_, Succulent_) {
    THREE = THREE_
    Succulent = Succulent_

    //todo determine if i want these to be members or not
    boxes = []
    succulents = []
    shaders = []
    fragShaders = [] //todo fix glslify browserify transform - either eject create-react-app and use a custom webpack loader, or figure out another way to preprocess shaders

    //todo hack/test
    this.plantParams = genPlantParams()
  }

  setup() {
    renderer = new THREE.WebGLRenderer({'antialias': false, alpha: false, precision: 'highp'})
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(new THREE.Color(0x333333, 1.0))

    container = document.getElementById('WebGLRender')
    container.appendChild(renderer.domElement)

    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(65, 1, 0.0001, 1000000)

    camera.position.set(0, 0.35, 0.75)
    scene.add(camera)

    setupLights(THREE, scene)

    //add orbit controls for mouse interactions
    this.orbitControls = new THREE.OrbitControls(camera, renderer.domElement)

    this.loadShaderMaterials()
    this.generateNewRandomGarden()
    this.update()
  }

  update() {
    // for (let i = 0; i < succulents.length; i++) {
    //   sceneUpdateTickerSpeed++
    //   if (sceneUpdateTickerSpeed > fps) {
    //     if (succulents[i]) {
    //       let aTex = succulents[i].material.map
    //       if (aTex) {
    //         let repeatA = Math.ceil(getRandomArbitrary(1, state.textureRepeatRange))
    //         let repeatB = Math.ceil(getRandomArbitrary(1, state.textureRepeatRange))
    //         aTex.repeat.set(repeatA, repeatB)
    //         aTex.offset.set(aTex.offset.x - 0.01 - (state.audioAnalysisFilter1 * 0.15), aTex.offset.y)
    //
    //         // Do the offset with music
    //         // console.log(state.audioAnalysisFilter1)
    //         // aTex.offset.set(aTex.offset.x - 0.01, aTex.offset.y)
    //         succulents[i].material.map = aTex
    //       }
    //     }
    //     sceneUpdateTickerSpeed = 0
    //   }
    // }

    // update shader uniforms
    // let shaderTime = (t / shaderTickerSpeed)
    // for (let j = 0; j < shaders.length; j++) {
    //   shaders[j].uniforms.iGlobalTime.value = shaderTime;
    //   shaders[j].uniforms.audio1.value = state.audioAnalysisFilter1;
    //   shaders[j].uniforms.audio2.value = state.audioAnalysisFilter2;
    //   shaders[j].uniforms.audio3.value = state.audioAnalysisFilter3;
    // }

    // update orbit camera controls
    // this.orbitControls.handleJoystickRotate(cameraRotationDeltaX * joystickSensitivity, cameraRotationDeltaY * joystickSensitivity)
    // this.orbitControls.handleJoystickDolly(cameraDollyDelta * cameraDollySensitivity)
    // this.orbitControls.handleJoystickPan(cameraPositionDeltaX * joystickSensitivity, cameraPositionDeltaY * joystickSensitivity)

    this.orbitControls.update()

    renderer.render(scene, camera)
    requestAnimationFrame(this.update.bind(this))
  }

  generateNewRandomGarden() {
    this.clearSucculents()
    //todo dispatch action here to update store
    for (let i=0; i < 10; i++) {
      this.addSucculent(i, this.plantParams[i])
    }
  }

  clearSucculents() {
    for (let i=0; i < succulents.length; i++) {
      scene.remove(succulents[i])
    }
    succulents = []
    boxes = []
  }

  findRandomUnusedSucculentPosition(offsetMin, offsetMax, box) {
    let newBox = box.clone();
    let offsetX = getRandomArbitrary(offsetMin, offsetMax);
    let offsetZ = getRandomArbitrary(offsetMin, offsetMax);
    let offsetVec3 = new THREE.Vector3(offsetX, 0, offsetZ);
    newBox.translate(offsetVec3);

    for (let i = 0; i < boxes.length; i++) {
      let aBox = boxes[i];
      if (newBox.intersectsBox(aBox)) {
        // console.log('There was an intersection: ' + offsetX + ' ' + offsetZ);
        let newOffsetMin = offsetMin - randomPositionTestOffset;
        let newOffsetMax = offsetMax + randomPositionTestOffset;
        return this.findRandomUnusedSucculentPosition(newOffsetMin, newOffsetMax, box);
      }
    }
    // console.log('Found the offset that i want to work with: ' + newBox.center().x + ' ' + newBox.center().y + ' ' + boxes.length);
    return newBox;
  }

  positionSucculentRandomly(index, plantParams, succulent) {
    let bboxHelperA = new THREE.BoundingBoxHelper(succulent);
    bboxHelperA.update();
    // let bbox = new THREE.Box3().setFromObject(succulent);
    let newBox = this.findRandomUnusedSucculentPosition(-randomPositionTestOffset, randomPositionTestOffset, bboxHelperA.box);

    succulent.position.x = newBox.center().x;
    succulent.position.y = 0;
    succulent.position.z = newBox.center().z;

    let helper = new THREE.BoundingBoxHelper(succulent);
    helper.update();
    boxes.push(helper.box);
    // helper.visible = true;
    // scene.add(helper);

    plantParams['positionX'] = succulent.position.x
    plantParams['positionY'] = succulent.position.y
    plantParams['positionZ'] = succulent.position.z

    //todo: update this in the store?
    this.plantParams[index] = plantParams
  }

  addSucculent(index, plantParams) {
    if (!plantParams) return
    let shaderIndex = plantParams['shaderIndex']
    let shaderMaterial = shaders[shaderIndex]

    const positionSucculent = (succulent) => {
      // load position from our preset if it exists, otherwise find a position for the succulent
      if (plantParams['positionX'] !== 'not_placed' && plantParams['positionY'] !== 'not_placed' && plantParams['positionZ'] !== 'not_placed') {
        succulent.position.x = plantParams['positionX']
        succulent.position.y = plantParams['positionY']
        succulent.position.z = plantParams['positionZ']
      } else {
        this.positionSucculentRandomly(index, plantParams, succulent)
      }

      /////////////////////////////////

      // look at BufferGeometry .setFromObject
      // This is based on the SUCCULENT position, not petal mesh - so y component will be useless

      // The succulent mesh is actually empty and just contains children petal meshes.
      // We need to add a BufferAttribute to the petal geometries
      // to get the plant position attribute in the vertex shader

      for (let m = 0; m < succulent.children.length; m++) {
        let petalMesh = succulent.children[m]

        let plantPositionAttributeArray = new Float32Array(petalMesh.geometry.attributes.position.count * 3)

        // lay out the position data in the way that the GPU wants it.
        // we deal with it on the CPU like this: [ [x,y,z], [x,y,z], [x,y,z]] ...
        // the gpu wants this: [ x, y, z, x, y, z, x, y, z, x, y, z ]

        for (let i = 0; i < plantPositionAttributeArray.length; i++) {
          plantPositionAttributeArray[i * 3] = succulent.position.x
          plantPositionAttributeArray[i * 3 + 1] = succulent.position.y
          plantPositionAttributeArray[i * 3 + 2] = succulent.position.z
        }

        let petalMeshRotationAttributeArray = new Float32Array(petalMesh.geometry.attributes.position.count)
        for (let j = 0; j < petalMeshRotationAttributeArray.length; j++) {
          petalMeshRotationAttributeArray[j] = petalMesh.rotation.y
        }

        // console.log('petalMesh geom position attributes:')
        // console.log(petalMesh.geometry.attributes.position)
        // let posAttribs = petalMesh.geometry.attributes.position.array
        // let l = petalMesh.geometry.attributes.position.count
        // console.log(posAttribs[0] + ' | ' + posAttribs[1] + ' | ' + posAttribs[2])
        // console.log(posAttribs[0] + ' | ' + posAttribs[1] + ' | ' + posAttribs[2])
        // console.log(posAttribs[0] + ' | ' + posAttribs[1] + ' | ' + posAttribs[2])
        // console.log(posAttribs[l-30] + ' | ' + posAttribs[l-29] + ' | ' + posAttribs[l-28 ])

        // console.log('plant position attributes array:')
        // console.log(plantPositionAttributeArray[0] + ' | ' + plantPositionAttributeArray[1] + ' | ' + plantPositionAttributeArray[2])
        // debugger

        petalMesh.geometry.addAttribute("plantPosition", new THREE.BufferAttribute(plantPositionAttributeArray, 3))
        petalMesh.geometry.addAttribute("petalRotation", new THREE.BufferAttribute(petalMeshRotationAttributeArray, 1))
      }

      scene.add(succulent);
      succulents.push(succulent);
    }

    //todo handle textures again
    // if (plantParams.textureFileName) {
    //   Succulent(shaderMaterial, plantParams, positionSucculent)
    // } else {
      let succulent = Succulent(shaderMaterial, plantParams)
      positionSucculent(succulent)
    // }
  }

  loadShaderMaterials() {
    const passThruShader = `
      precision highp float;

      letying vec2 vUv;

      void main() {
        // pass letyings to frag shader
        vUv = uv;

        gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x, position.y, position.z, 1.0 );
      }
    `

    const frag = `
      precision mediump float;
      uniform float iGlobalTime;
      varying vec2 vUv;

      void main() {
        gl_FragColor = vec4( 0.5, 1.0, 0.5, 1.0);
      }
    `

    for (let i = 0; i < fragShaders.length; i++) {
      let shaderMaterial = new THREE.ShaderMaterial({
        uniforms : {
          iGlobalTime: { type: 'f', value: 0 }
        },
        defines: {
          USE_MAP: ''
        },
        // vertexShader : glslify(__dirname + './../shaders/passthrough.vert'),
        vertexShader: passThruShader,
        fragmentShader : frag,        //todo use fragShaders array when glslify is fixed
        side: THREE.DoubleSide,
        // transparent: false,
        blending: THREE.AdditiveBlending,
        wireframe:false
      });
      shaders.push(shaderMaterial);
    }
  }

  //todo method can be static
  resize() {
    let width = container.offsetWidth
    let height = container.offsetHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }
}

export default Garden
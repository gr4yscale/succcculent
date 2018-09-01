// Redux
import * as actionTypes from "./redux/actions/actionTypes"
import {standard} from './redux/actions/index'

// Misc / Util
import {getRandomArbitrary} from './util'
import parseDataUrl from 'parse-data-url'
import {randomPositionTestOffset} from './config'

import devFragShader from './shaders/dev.frag'
import devVertShader from './shaders/dev.vert'

// import displacementVert from './shaders/displacement.vert'
import animateVert from './shaders/animate.vert'

import PostFX from './postfx'
let postFX

// Dependencies
let THREE, SucculentBuilder, store, debugGUI
// Three
let camera, controls, scene, renderer, container
// Scene
let boxes, succulents, shaders, fragShaders

class Garden {
    constructor(THREE_, SucculentBuilder_, _debugGUI) {
        THREE = THREE_
        SucculentBuilder = SucculentBuilder_
        debugGUI = _debugGUI

        //TODO determine if i want these to be members or not
        boxes = []
        succulents = []
        shaders = []
        fragShaders = [] //TODO fix glslify browserify transform - either eject create-react-app and use a custom webpack loader, or figure out another way to preprocess shader
    }

    setup(_store) {
        store = _store
        const state = store.getState()

        // quick / hacky state that we synchronize in appReducer
        // TODO could also be middleware behavior
        debugGUI.subscribe(params => {
            store.dispatch(
                standard(actionTypes.DEBUG_VALUE_UPDATED, params)
            )
            camera.setFocalLength(params.fov) //TODO evaluate moving this into update()
            camera.updateProjectionMatrix()
        })

        renderer = new THREE.WebGLRenderer({'antialias': true, alpha: false, precision: 'highp'})
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setClearColor(new THREE.Color(0x333333, 1.0)) // TODO: make background color param

        container = document.getElementById('WebGLRender')
        container.appendChild(renderer.domElement)

        camera = new THREE.PerspectiveCamera(state.scene.cameraFov, 1, 0.0001, 1000000)
        scene = new THREE.Scene()
        scene.add(camera)

        // TODO try to initialize postFX in index - needs THREE-y stuff, though...
        postFX = new PostFX(THREE, renderer, camera, scene, debugGUI)
        controls = new THREE.OrbitControls(camera, renderer.domElement)

        camera.position.set(0, 0.35, 0.75)
        controls.target.set(0,0,0)

        this.update()
    }

    update(tick) {
        const state = store.getState()

        // update shader uniforms
        for (let j = 0; j < shaders.length; j++) {
            shaders[j].uniforms.iGlobalTime.value = (tick / state.scene.shaderTickerSpeed)
        }

        this.updateOrbitControlsWithDeltas()

        postFX.render()

        requestAnimationFrame(this.update.bind(this))
    }

    reset() {
        this.loadShaderMaterials()
        this.resetPlants() //todo this is necessary to call after generating a random garden because we must update plant positions to complete garden generation. fix this.
    }

    resetPlants() {
        console.log('resetting plants')
        for (let i = 0; i < succulents.length; i++) {
            scene.remove(succulents[i])
        }
        succulents = []
        boxes = []

        const gardenGeneration = store.getState().gardenGeneration

        for (let i=0; i < gardenGeneration.numPlantsForNextGeneration; i++) {
            this.addSucculent(i, gardenGeneration.plantParams[i])
        }
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

        store.dispatch(
            standard(actionTypes.GARDEN_UPDATE_PLANT_POSITION,{
                plantIndex: index,
                position: succulent.position
            })
        )
    }

    // TODO refactor for generic geometry? create an interface to provide shaders information that's universally useful?
    // position of geometry, orientation, instance id, etc
    addSucculent(index, plantParams) {
        console.log('will add succulent if there are plant params')
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

        //TODO handle textures again
        // if (plantParams.textureFileName) {
        //   SucculentBuilder(shaderMaterial, plantParams, positionSucculent)
        // } else {

        // plantParams['mergePetalGeometry'] = false
        plantParams['mergePetalGeometry'] = true

        let succulent = SucculentBuilder(shaderMaterial, plantParams)
        positionSucculent(succulent)
        // }
    }

    loadShaderMaterials() {
        // vert shaders
        const devVertShaderDecoded = atob(parseDataUrl(devVertShader).data)
        // const devVertShaderDecoded = atob(parseDataUrl(animateVert).data)

        // frag shaders
        const devFragShaderDecoded = atob(parseDataUrl(devFragShader).data)

        let shaderMaterial = new THREE.RawShaderMaterial({
            uniforms : {
                iGlobalTime: { type: 'f', value: 0 }
            },
            defines: {
                USE_MAP: ''
            },
            vertexShader: devVertShaderDecoded,
            fragmentShader : devFragShaderDecoded,
            side: THREE.DoubleSide,
            transparent:true,
            // TODO add garden preset for transparent
            blending:THREE.MultiplyBlending,
            // THREE.NoBlending = 0;
            // THREE.NormalBlending = 1;
            // THREE.AdditiveBlending = 2;
            // THREE.SubtractiveBlending = 3;
            // THREE.MultiplyBlending = 4;
            // THREE.CustomBlending = 5;
            // TODO add garden preset for blending modes
            wireframe: false
        });
        shaders.push(shaderMaterial);
    }

    resize() {
        let width = container.offsetWidth
        let height = container.offsetHeight
        camera.aspect = width / height
        camera.updateProjectionMatrix()

        // TODO check on renderer.setSize
        renderer.setSize(width, height)
    }

    // Camera
    updateOrbitControlsWithDeltas() {
        // TODO: should be using selectors for getting state slices
        const s = store.getState().scene
        controls.handleJoystickRotate(s.cameraRotationDeltaX * s.joystickSensitivity, s.cameraRotationDeltaY * s.joystickSensitivity)
        controls.handleJoystickDolly(s.cameraDollyDelta * s.cameraDollySensitivity)
        controls.handleJoystickPan(s.cameraPositionDeltaX * s.joystickSensitivity, s.cameraPositionDeltaY * s.joystickSensitivity)
        controls.update()
    }

    updateCameraMatrix() {
        console.log('load camera matrix')
        // sloppy, this tries to handle the conditions of setting camera preset for either first person or orbit controls
        //     if (!data) {
        //         console.log('Expected there to be some camera preset data, but there wasnt! ******')
        //         return
        //     }
        //     let matrix = new THREE.Matrix4();
        //     matrix.fromArray(data.controlsOrbitMatrix)
        //     // apply position, quaternion, and scale from the matrix coming from presets to the camera using decompose()
        //     matrix.decompose(this.camera.position, this.camera.quaternion, this.camera.scale)
        //     // orbit controls needed the center property to be updated to properly position the camera after a pan, argh
        //     let updatedTarget = data.controlsOrbitTarget
        //     this.controls.target.set(updatedTarget.x, updatedTarget.y, updatedTarget.z)
    }

    getCameraMatrix() {
        console.log('save camera matrix')
        return {
            controlsType: 'orbit',
            cameraMatrix: controls.object.matrix.toArray(),
            target: controls.target.clone(),
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////
// TODO: CAMERA CONTROLS - turn into a middleware?
//////////////////////////////////////////////////////////////////////////////////////////////

//
// function cameraReset() {
//     this.camera.position.set(0, 0.35, 0.75)
//     this.controls.target.set(0,0,0)
// }
//
// function resetCameraDeltas() {
//     cameraRotationDeltaX = 0
//     cameraRotationDeltaY = 0
//     cameraPositionDeltaY = 0
//     cameraPositionDeltaX = 0
//     cameraDollyDelta = 1.0
// }


export default Garden


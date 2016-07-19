function Controls(midi, scene, camera, elementForOrbitControls, controlsEventCallback) {

  let self = this // fucking ES5 =\
  let lerp = require('./util.js').lerp
  let FirstPersonControls = require('./controls_first_person.js')
  let outputAPC40
  let logControlSurfaceEvents = true

  // camera
  this.camera = camera
  let cameraPresetsLearn = false
  let orbitControlsEnabled = true

  // TOFIX: make these Vector3's probably
  let cameraPositionUpdateX = 0.0
  let cameraPositionUpdateY = 0.0
  let cameraPositionUpdateZ = 0.0
  let cameraRotationDeltaX = 0.0
  let cameraRotationDeltaY = 0.0
  let cameraPositionDeltaX = 0.0
  let cameraPositionDeltaY = 0.0
  let joystickSensitivity = 1.0
  let cameraDollyDelta = 1.0

  let firstPersonEnabled = false
  let firstPersonDirection = 0
  let xboxLeftJoystickButtonLastState = false

  // misc modes
  let sameShaderForAllPlants = false
  let sameShaderForAllPlantsIndex = 0

  let lastCameraPresetIdentifierPressed
  const buttonIdentifierToAPC40Packet = {
    'F8' : {0: 0x97, 1: 0x35},
    '/' :  {0: 0x97, 1: 0x35}, // TOFIX: DRY this up later
    'F#8' :  {0: 0x97, 1: 0x36}
  }

  // This is only a member function because I don't want this references everywhere on the camera controls and etc variables
  this.updateCameraWithOrbitControls = function() {
    if (!orbitControlsEnabled) return

    this.orbitControls.handleJoystickRotate(cameraRotationDeltaX * joystickSensitivity, cameraRotationDeltaY * joystickSensitivity)
    this.orbitControls.handleJoystickDolly(cameraDollyDelta)
    this.orbitControls.handleJoystickPan(cameraPositionDeltaX * joystickSensitivity, cameraPositionDeltaY * joystickSensitivity)
    this.orbitControls.update()
  }

  this.updateCameraFromGamepadState = function() {
    if (!firstPersonEnabled) return

    if (navigator.webkitGetGamepads) {
      var gamepad = navigator.webkitGetGamepads()[0]
    } else {
      var gamepad = navigator.getGamepads()[0]
    }

    if (gamepad) {
      if (gamepad.buttons[6].pressed == true) { // left trigger button
        firstPersonDirection = -1
      } else if (gamepad.buttons[7].pressed == true) { // right trigger button
        firstPersonDirection = 1
      } else {
        firstPersonDirection = 0
      }

      xboxLeftJoystickButtonState = gamepad.buttons[10].pressed
      if (xboxLeftJoystickButtonState != xboxLeftJoystickButtonLastState) {
        if (xboxLeftJoystickButtonState) {
          buttonPressed('xbox10')
        }
        xboxLeftJoystickButtonLastState = xboxLeftJoystickButtonState
      }

      this.firstPersonControls.update(gamepad.axes[0],
                                      gamepad.axes[1],
                                      firstPersonDirection,
                                      gamepad.axes[2],
                                      gamepad.axes[3])
    }
  }

  this.cameraReset = function() {
    this.camera.position.set(0, 0.35, 0.75)
    this.orbitControls.target.set(0,0,0)
    // scene.remove(this.firstPersonControls.getObject())
    // firstPersonControls = new FirstPersonControls(this.camera)
    // scene.add(this.firstPersonControls.getObject())
  }


  ////////////////////////////////////////////
  // Private methods

  function initializeMidi() {
    midi.enable((err) => {
      if (err) {
        console.log('WebMidi could not be enabled.', err)
        return
      } else {
        console.log('WebMidi enabled! Inputs found: \n' + midi.inputs)
      }

      let inputAPC40 = midi.getInputByName("Akai APC40")
      outputAPC40 = midi.getOutputByName("Akai APC40")
      let inputTouchOSC = midi.getInputByName("TouchOSC Bridge")

      if (inputAPC40) {
        inputAPC40.addListener('noteoff', "all", handleUnhandledMidiEvent)
        inputAPC40.addListener('pitchbend', "all", handleUnhandledMidiEvent)
        inputAPC40.addListener('channelaftertouch', "all", handleUnhandledMidiEvent)
        inputAPC40.addListener('programchange', "all", handleUnhandledMidiEvent)
        inputAPC40.addListener('channelmode', "all", handleUnhandledMidiEvent)
        inputAPC40.addListener('noteon', "all", handleMidiNoteOn.bind(self))
        inputAPC40.addListener('noteoff', "all", handleMidiNoteOff)
        inputAPC40.addListener('controlchange', "all", handleMidiControlChangeAPC)
      }

      if (inputTouchOSC) {
        inputTouchOSC.addListener('noteoff', "all", handleUnhandledMidiEvent)
        inputTouchOSC.addListener('pitchbend', "all", handleUnhandledMidiEvent)
        inputTouchOSC.addListener('channelaftertouch', "all", handleUnhandledMidiEvent)
        inputTouchOSC.addListener('programchange', "all", handleUnhandledMidiEvent)
        inputTouchOSC.addListener('controlchange', "all", handleUnhandledMidiEvent)
        inputTouchOSC.addListener('noteon', "all", handleMidiNoteOn.bind(self))
        inputTouchOSC.addListener('noteoff', "all", handleMidiNoteOff)
        inputTouchOSC.addListener('controlchange', "all", handleMidiControlChangeTouchOSC)
      }

      if (outputAPC40) {
        updateAPC40ToggleButtonLEDs() // update LED state on init to make sure they properly represent current state
      }
    })
  }

  function callbackForControlEvent(type, data) {
    let event = { type: type, data: data}
    controlsEventCallback(event)
  }

  function buttonIdentifierFromMidiEvent(e) {
    return e.note.name + e.channel.toString()
  }

  function updateAPC40Button(buttonIdentifier, illuminate, blink) {
    console.log('updateAPC40Button: ' + buttonIdentifier)
    let map = buttonIdentifierToAPC40Packet[buttonIdentifier]
    let lastByte = illuminate ? 0x01 : 0x00
    if (blink) lastByte = 0x02
    let packet = [map[0],map[1],lastByte]
    outputAPC40.send(0xFF, packet)
  }

  function updateAPC40ToggleButtonLEDs() {
    updateAPC40Button('F8', cameraPresetsLearn, false)
    updateAPC40Button('F#8', firstPersonEnabled, false)
    let button = buttonIdentifierToAPC40Packet[lastCameraPresetIdentifierPressed]
    if (button) {
      updateAPC40Button(button, true, true)
    }
  }

  function buttonPressed(buttonIdentifier) {
    console.log('Handling button press: ' + buttonIdentifier)

    switch (buttonIdentifier) {
      case '+':
        console.log('add a succulent randomly (outside of the normal parameter loading/saving)')
        console.log('will have to get random params, deal with this later....')
        break
      case 's':
        callbackForControlEvent('SAVE_GARDEN_TO_PRESET_FILE')
        break
      case 'l':
        callbackForControlEvent('LOAD_GARDEN_FROM_PRESET_FILE')
        break
      case 'g':
        callbackForControlEvent('GENERATE_NEW_RANDOM_GARDEN')
        break
      case 'F8': // APC40
      case 'E2': // TouchOSC
      case '/':
      case 'xbox10': {
        cameraPresetsLearn = !cameraPresetsLearn
        callbackForControlEvent('CAMERA_PRESETS_LEARN_TOGGLED', {key: 'cameraPresetsLearn', value: cameraPresetsLearn})
        updateAPC40ToggleButtonLEDs()
        break
      }
      case 'A4': { // TouchOSC
        sameShaderForAllPlants = !sameShaderForAllPlants
        callbackToUpdatePlantShaders(0)
        break
      }
      case 'F#8': // APC40
      case 'D#2': // TouchOSC
      case '.': {
        firstPersonEnabled = !firstPersonEnabled
        callbackForControlEvent('FIRST_PERSON_CAMERA_CONTROLS_TOGGLED', {key: 'firstPersonEnabled', value: firstPersonEnabled})
        updateAPC40ToggleButtonLEDs()
        this.cameraReset.bind(this)()
        break
      }
      case 'D1': // APC40
      case 'D2': // TouchOSC
        this.cameraReset.bind(this)()
        break
      case 'p':
        debugger
        break
      default: {
        if (cameraPresetsLearn) {
          let data = {presetIdentifier: buttonIdentifier}

          if (firstPersonEnabled) {
            data = Object.assign({}, data, {
              controlsType: 'firstPerson',
              controlsFirstPersonMatrix: this.firstPersonControls.getObject().matrix.toArray()
            })
          } else {
            data = Object.assign({}, data, {
              controlsType: 'orbit',
              controlsOrbitMatrix: this.orbitControls.object.matrix.toArray(),
              controlsOrbitTarget: this.orbitControls.target.clone()
            })
            console.log(this.orbitControls)
          }
          console.log(data)
          callbackForControlEvent('CAMERA_PRESET_LEARN', data)
        } else {
          let data = {
            presetIdentifier: buttonIdentifier
          }
          callbackForControlEvent('CAMERA_PRESET_TRIGGER', data)
        }
        break
      }
    }
  }

  /////////////////////////////////////////////////////////
  // Event handlers for control surfaces

  // Keyboard
  function handleKeyPress(e) {
    buttonPressed.bind(this)(e.key) // TOFIX: Fucking ES5! Gotta move this over to ES6 soon...
  }

  // MIDI - modes / scene control
  function handleMidiNoteOn(e) {
    let buttonIdentifier = buttonIdentifierFromMidiEvent(e)
    buttonPressed.bind(this)(buttonIdentifier)
  }

  // MIDI - camera controls (TouchOSC)
  function handleMidiControlChangeTouchOSC(e) {
    console.log('Knob #: ' + e.controller.number + ' | Value: ' + e.value) // TOFIX: replace this with generic MIDI log function?
    let v = e.value / 127.0

    switch (e.controller.number) {
      case 0:
        cameraRotationDeltaY = lerp(-0.5, 0.5, v)
        break
      case 1:
        cameraRotationDeltaX = lerp(0.5, -0.5, v)
        break;
      case 2:
        cameraPositionDeltaY = lerp(-2.0, 2.0, v)
        break;
      case 3:
        cameraPositionDeltaX = lerp(2.0, -2.0, v)
        break;
      case 4:
        joystickSensitivity = lerp(0, 8.0, v)
        break
      case 5:
        cameraDollyDelta = lerp(1.01, 0.99, v)
        break
      case 9: {
        sameShaderForAllPlantsIndex = Math.floor(lerp(0, 14, v)) //TOFIX: keep this within bounds, pass in the shaders array length
        if (sameShaderForAllPlants) {
          callbackToUpdatePlantShaders(sameShaderForAllPlantsIndex)
        }
        break
      }
      default:
    }
  }

  // MIDI - camera controls (APC40)
  function handleMidiControlChangeAPC(e) {
    console.log('Knob #: ' + e.controller.number + ' | Value: ' + e.value) // TOFIX: replace this with generic MIDI log function?
    let v = e.value / 127.0

    switch (e.controller.number) {
      case 48:
        cameraPositionUpdateX = lerp(-0.01, 0.01, v)
        break
      case 49:
        cameraPositionUpdateY = lerp(-0.01, 0.01, v)
        break
      case 50:
        cameraPositionUpdateZ = lerp(-0.01, 0.01, v)
        break
      case 51:
        cameraDolly = lerp(-5000, 5000, v)
        break
      default:
    }
  }

  function handleMidiNoteOff(e) {
    updateAPC40ToggleButtonLEDs()
  }

  function handleUnhandledMidiEvent(e) {
    // console.log('Unhandled MIDI event fired!')
    // console.log(e)
  }


  //////////////////////////////////////////
  // CALLBACK HELPERS

  function callbackToUpdatePlantShaders(shaderIndex) {
    if (sameShaderForAllPlants) {
      let data = {shaderIndex: shaderIndex}
      callbackForControlEvent('SET_SAME_SHADER_FOR_ALL_PLANTS', data)
    } else {
      callbackForControlEvent('RESET_SHADERS_TO_INITIAL_SHADER_FOR_ALL_PLANTS')
    }
  }

  // GOOOOOOOOOOOO!
  initializeMidi()
  document.body.addEventListener('keypress', handleKeyPress.bind(this))
  this.orbitControls = new THREE.OrbitControls(camera, elementForOrbitControls)
  this.firstPersonControls = new FirstPersonControls(camera)
  scene.add(this.firstPersonControls.getObject())
}


/////////////////////////////
// Public methods
// TOFIX: this reference

Controls.prototype.update = function() {
    this.updateCameraFromGamepadState()
    this.updateCameraWithOrbitControls()
}

Controls.prototype.updateFromPresetData = function(data) {
  var matrix = new THREE.Matrix4();
  if (data.controlsType == 'orbit') {
    matrix.fromArray(data.controlsOrbitMatrix)
    // apply position, quaternion, and scale from the matrix coming from presets to the camera using decompose()
    matrix.decompose(this.camera.position, this.camera.quaternion, this.camera.scale)
    // orbit controls needed the center property to be updated to properly position the camera after a pan, argh
    let updatedTarget = data.controlsOrbitTarget
    this.orbitControls.target.set(updatedTarget.x, updatedTarget.y, updatedTarget.z)
  } else if (data.controlsType == 'firstPerson') {
    matrix.fromArray(data.controlsFirstPersonMatrix)
    matrix.decompose(this.camera.position, this.camera.quaternion, this.camera.scale)

    scene.remove(this.firstPersonControls.getObject())
    this.firstPersonControls = new FirstPersonControls(this.camera)
    scene.add(this.firstPersonControls.getObject())
  }
}

module.exports = Controls

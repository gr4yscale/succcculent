// TOFIX: This needs refactoring!

function Controls(midi, scene, camera, elementForOrbitControls, controlsEventCallback) {

  let self = this // fucking ES5 =\
  let lerp = require('./util.js').lerp
  let FirstPersonControls = require('./controls_first_person.js')
  let outputAPC40
  let logControlSurfaceEvents = true
  let xboxController

  // camera
  this.camera = camera
  let cameraPresetsLearn = false
  let orbitControlsEnabled = true

  // TOFIX: make these Vector3's probably
  let cameraRotationDeltaX = 0.0
  let cameraRotationDeltaY = 0.0
  let cameraPositionDeltaX = 0.0
  let cameraPositionDeltaY = 0.0
  let joystickSensitivity = 2.0
  let cameraDollyDelta = 1.0

  // xbox controller
  let xboxControllerSelected = true
  let xboxLeftJoystickButtonLastState = false
  let xboxJoystickCalibration = {leftX: 0, leftY: 0, rightX: 0, rightY: 0}

  // misc modes
  let sameShaderForAllPlants = false
  let sameShaderForAllPlantsIndex = 0

  let lastCameraPresetIdentifierPressed
  const buttonIdentifierToAPC40Packet = {
    'A#1' : {0: 0x97, 1: 0x35},
    '/' :  {0: 0x97, 1: 0x35}, // TOFIX: DRY this up later
    'F#8' :  {0: 0x97, 1: 0x36}
  }



  // Audio Analysis data in from VDMX
  // TOFIX: DRY this up, yuck!
  this.audioAnalysisFilter1 = 1.0
  this.audioAnalysisFilter2 = 1.0
  this.audioAnalysisFilter3 = 1.0
  this.audioAnalysisFilter1Gain = 1.0
  this.audioAnalysisFilter2Gain = 1.0
  this.audioAnalysisFilter3Gain = 1.0
  this.audioAnalaysisFilter1TriggerThreshold = 0.7
  this.audioAnalaysisFilter2TriggerThreshold = 0.7
  this.audioAnalaysisFilter3TriggerThreshold = 0.7
  this.audioAnalaysisFilter1TriggerThresholdReached = false
  this.audioAnalaysisFilter2TriggerThresholdReached = false
  this.audioAnalaysisFilter3TriggerThresholdReached = false
  let audioAnalysisFilter1TriggerThresholdsEnabled = false

  // This is only a member function because I don't want this references everywhere on the camera controls and etc variables
  this.updateCameraWithOrbitControls = function() {
    if (!orbitControlsEnabled) return

    this.orbitControls.handleJoystickRotate(cameraRotationDeltaX * joystickSensitivity, cameraRotationDeltaY * joystickSensitivity)
    this.orbitControls.handleJoystickDolly(cameraDollyDelta)
    this.orbitControls.handleJoystickPan(cameraPositionDeltaX * joystickSensitivity, cameraPositionDeltaY * joystickSensitivity)
    this.orbitControls.update()
  }

  this.updateCameraFromGamepadState = function() {

    if (navigator.webkitGetGamepads) {
      xboxController = navigator.webkitGetGamepads()[0]
    } else {
      xboxController = navigator.getGamepads()[0]
    }

    if (xboxController) {
      // reset camera
      if (xboxController.buttons[9].pressed) {
        this.cameraReset()
      }

      let shouldBoostDolly = xboxController.buttons[0].pressed
      const dollySpeed = 0.00006
      const boostAmount = 0.0001
      if (xboxController.buttons[6].pressed == true) { // left trigger button
        cameraDollyDelta += dollySpeed
        if (shouldBoostDolly) cameraDollyDelta += boostAmount
      } else if (xboxController.buttons[7].pressed == true) { // right trigger button
        cameraDollyDelta -= dollySpeed
        if (shouldBoostDolly) cameraDollyDelta -= boostAmount
      }

      xboxLeftJoystickButtonState = xboxController.buttons[10].pressed
      if (xboxLeftJoystickButtonState != xboxLeftJoystickButtonLastState) {
        if (xboxLeftJoystickButtonState) {
          buttonPressed('xbox10')
        }
        xboxLeftJoystickButtonLastState = xboxLeftJoystickButtonState
      }

      if (xboxControllerSelected) {
        // cameraRotationDeltaX = lerp(0.25, -0.25, 0.5 + xboxController.axes[0] - xboxJoystickCalibration.leftX)
        // cameraRotationDeltaY = lerp(0.25, -0.25, 0.5 + xboxController.axes[1] - xboxJoystickCalibration.leftY)
        // cameraPositionDeltaX = lerp(1.0, -1.0, 0.5 + xboxController.axes[2] - xboxJoystickCalibration.rightX)
        // cameraPositionDeltaY = lerp(1.0, -1.0, 0.5 + xboxController.axes[3] - xboxJoystickCalibration.rightY)

        cameraRotationDeltaX = lerp(0.25, -0.25, 0.5 + xboxController.axes[0] - xboxJoystickCalibration.leftX)
        cameraRotationDeltaY = lerp(0.25, -0.25, 0.5 + xboxController.axes[1] - xboxJoystickCalibration.leftY)
        cameraPositionDeltaX = lerp(1.0, -1.0, 0.5 + xboxController.axes[2] - xboxJoystickCalibration.rightX)
        cameraPositionDeltaY = lerp(1.0, -1.0, 0.5 + xboxController.axes[3] - xboxJoystickCalibration.rightY)

      }

      // TOFIX: handle first person controls mode later, i prefer orbitcontrols with xbox turns out
      // this.firstPersonControls.update(gamepad.axes[0],
      //                                 gamepad.axes[1],
      //                                 firstPersonDirection,
      //                                 gamepad.axes[2],
      //                                 gamepad.axes[3])
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
      let inputAudioAnalysis = midi.getInputByName("From VDMX")

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

      if (inputAudioAnalysis) {
        inputAudioAnalysis.addListener('controlchange', "all", (e) => {
          if (e.value) {
            let v = e.value / 127.0
            switch(e.controller.number) {
              case 0:
                this.audioAnalysisFilter1 = v * this.audioAnalysisFilter1Gain
                break
              case 1:
                this.audioAnalysisFilter2 = v * this.audioAnalysisFilter2Gain
                break
              case 2:
                this.audioAnalysisFilter3 = v * this.audioAnalysisFilter3Gain
                break
            }

            let data = {
              filter1: this.audioAnalysisFilter1,
              filter2: this.audioAnalysisFilter2,
              filter3: this.audioAnalysisFilter3
            }
            callbackForControlEvent('AUDIO_ANALYSIS_FILTER_UPDATE', data)
            if (audioAnalysisFilter1TriggerThresholdsEnabled) {
              updateAudioAnalysisTriggerThresholds.bind(this)()
            }
          }
        })
      }
    })
  }

  function updateAudioAnalysisTriggerThresholds() {
    // TOFIX: DRY this up
    // filter 1
    if (!this.audioAnalaysisFilter1TriggerThresholdReached && (this.audioAnalysisFilter1 > this.audioAnalaysisFilter1TriggerThreshold)) {
      this.audioAnalaysisFilter1TriggerThresholdReached = true
      callbackForControlEvent('AUDIO_ANALYSIS_FILTER_1_TRIGGER_THRESHOLD_REACHED')
    } else if (this.audioAnalaysisFilter1TriggerThresholdReached && (this.audioAnalysisFilter1 < this.audioAnalaysisFilter1TriggerThreshold)) {
      this.audioAnalaysisFilter1TriggerThresholdReached = false
    }

    if (!this.audioAnalaysisFilter2TriggerThresholdReached && (this.audioAnalysisFilter2 > this.audioAnalaysisFilter2TriggerThreshold)) {
      this.audioAnalaysisFilter2TriggerThresholdReached = true
      callbackForControlEvent('AUDIO_ANALYSIS_FILTER_2_TRIGGER_THRESHOLD_REACHED')
    } else if (this.audioAnalaysisFilter2TriggerThresholdReached && (this.audioAnalysisFilter2 < this.audioAnalaysisFilter2TriggerThreshold)) {
      this.audioAnalaysisFilter2TriggerThresholdReached = false
    }

    if (!this.audioAnalaysisFilter3TriggerThresholdReached && (this.audioAnalysisFilter3 > this.audioAnalaysisFilter3TriggerThreshold)) {
      this.audioAnalaysisFilter3TriggerThresholdReached = true
      callbackForControlEvent('AUDIO_ANALYSIS_FILTER_3_TRIGGER_THRESHOLD_REACHED')
    } else if (this.audioAnalaysisFilter3TriggerThresholdReached && (this.audioAnalysisFilter3 < this.audioAnalaysisFilter3TriggerThreshold)) {
      this.audioAnalaysisFilter3TriggerThresholdReached = false
    }
  }

  function resetCameraDeltas() {
    cameraRotationDeltaX = 0
    cameraRotationDeltaY = 0
    cameraPositionDeltaY = 0
    cameraPositionDeltaX = 0
    cameraDollyDelta = 1.0
  }

  function callbackForControlEvent(type, data) {
    let event = { type: type, data: data}
    controlsEventCallback(event)
  }

  function buttonIdentifierFromMidiEvent(e) {
    return e.note.name + e.channel.toString()
  }

  function updateAPC40Button(buttonIdentifier, illuminate, blink) {
    if (!outputAPC40) return
    let map = buttonIdentifierToAPC40Packet[buttonIdentifier]
    let lastByte = illuminate ? 0x01 : 0x00
    if (blink) lastByte = 0x02
    let packet = [map[0],map[1],lastByte]
    outputAPC40.send(0xFF, packet)
  }

  function updateAPC40ToggleButtonLEDs() {
    updateAPC40Button('A#1', state.cameraPresetsLearn, false)
    updateAPC40Button('F#8', xboxControllerSelected, false)
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
      case 'B1': // APC40
        callbackForControlEvent('GENERATE_NEW_RANDOM_GARDEN')
        break
      case 'a':
        audioAnalysisFilter1TriggerThresholdsEnabled = !audioAnalysisFilter1TriggerThresholdsEnabled
        break
      case ',':
        self.audioAnalysisEnabled = !self.audioAnalysisEnabled // TOFIX:
        break
      case 'A#1': // APC40
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
        if (xboxController) {
          xboxControllerSelected = !xboxControllerSelected
          callbackForControlEvent('XBOX_CONTROLLER_SELECTION_TOGGLED', {key: 'xboxControllerSelected', value: xboxControllerSelected})
          xboxJoystickCalibration.leftX = xboxController.axes[0]
          xboxJoystickCalibration.leftY = xboxController.axes[1]
          xboxJoystickCalibration.rightX = xboxController.axes[2]
          xboxJoystickCalibration.rightY = xboxController.axes[3]
          updateAPC40ToggleButtonLEDs()
        }
        break
      }
      case 'D1': // APC40
      case 'D2': // TouchOSC
      case 'm': {
        resetCameraDeltas()
        this.cameraReset.bind(this)()
        break
      }
      case 'p':
        debugger
        break
      default: {
        if (state.cameraPresetsLearn) {
          let data = {presetIdentifier: buttonIdentifier}

          // if (xboxControllerSelected) {
          //   data = Object.assign({}, data, {
          //     controlsType: 'firstPerson'
          //     // controlsFirstPersonMatrix: this.firstPersonControls.getObject().matrix.toArray()
          //   })
          // } else {
            data = Object.assign({}, data, {
              controlsType: 'orbit',
              controlsOrbitMatrix: this.orbitControls.object.matrix.toArray(),
              controlsOrbitTarget: this.orbitControls.target.clone()
            })
          // }
          console.log(data)
          this.cameraPresetsLearn = false
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
      // page 1
      case 0:
        if (!xboxControllerSelected) cameraRotationDeltaY = lerp(-0.5, 0.5, v)
        break
      case 1:
        if (!xboxControllerSelected) cameraRotationDeltaX = lerp(0.5, -0.5, v)
        break;
      case 2:
        if (!xboxControllerSelected) cameraPositionDeltaY = lerp(-0.5, 0.5, v)
        break;
      case 3:
        if (!xboxControllerSelected) cameraPositionDeltaX = lerp(0.5, -0.5, v)
        break;
      case 4:
        joystickSensitivity = lerp(0, 8.0, v)
        break
      case 5:
        cameraDollyDelta = lerp(1.01, 0.99, v)
        break
      // page 2, starting with number 6
      case 6:
        self.audioAnalaysisFilter1TriggerThreshold = lerp(0, 1.0, v)
        self.audioAnalaysisFilter1TriggerThresholdReached = false
        break
      case 7:
        self.audioAnalaysisFilter2TriggerThreshold = lerp(0, 1.0, v)
        self.audioAnalaysisFilter2TriggerThresholdReached = false
        break
      case 8:
        self.audioAnalaysisFilter3TriggerThreshold = lerp(0, 1.0, v)
        self.audioAnalaysisFilter3TriggerThresholdReached = false
        break
      case 9:
        self.audioAnalysisFilter1Gain = lerp(0, 1.0, v)
        break
      case 10:
        self.audioAnalysisFilter2Gain = lerp(0, 1.0, v)
        break
      case 11:
        self.audioAnalysisFilter3Gain = lerp(0, 1.0, v)
        break
      case 15: {
        sameShaderForAllPlantsIndex = Math.floor(lerp(0, 14, v)) //TOFIX: keep this within bounds, pass in the shaders array length
        if (sameShaderForAllPlants) {
          callbackToUpdatePlantShaders(sameShaderForAllPlantsIndex)
        }
        break
      }
      default:
    }
  }

  // MIDI - APC40 knobs (stub)
  function handleMidiControlChangeAPC(e) {
    console.log('Knob #: ' + e.controller.number + ' | Value: ' + e.value) // TOFIX: replace this with generic MIDI log function?
    let v = e.value / 127.0

    switch (e.controller.number) {
      case 48:

        break
      case 49:

        break
      case 50:

        break
      case 51:

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
  initializeMidi.bind(this)()
  document.body.addEventListener('keypress', handleKeyPress.bind(this))
  this.orbitControls = new THREE.OrbitControls(camera, elementForOrbitControls)
  // this.firstPersonControls = new FirstPersonControls(camera)
  // scene.add(this.firstPersonControls.getObject())
  this.audioAnalysisCanUpdateCamera = false // TOFIX: can i remove the this reference?
}


/////////////////////////////
// Public methods
// TOFIX: this reference

Controls.prototype.update = function() {
    this.updateCameraFromGamepadState()
    this.updateCameraWithOrbitControls()

    if (this.audioAnalysisEnabled) {
      this.camera.position.set(this.camera.position.x, this.audioAnalysisFilter1 * this.audioAnalysisFilter1Gain,this.camera.position.z)
      // Update rotation with FFT MIDI data
      // let v = this.camera.rotation
      // this.camera.rotation.set(this.audioAnalysisFilter1 * this.audioAnalysisFilter1Gain, this.camera.rotation.y, this.camera.rotation.z)
    }
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

    // scene.remove(this.firstPersonControls.getObject())
    // this.firstPersonControls = new FirstPersonControls(this.camera)
    // scene.add(this.firstPersonControls.getObject())
  }
}

module.exports = Controls

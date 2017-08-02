// TOFIX: This needs refactoring!...BADLY!
//TOFIX: hack
const THREE = window.THREE


function Controls(presets, state, midi, scene, camera, elementForOrbitControls, controlsEventCallback) {

  let self = this // fucking ES5 =\
  let FirstPersonControls = require('./controls_first_person.js')
  let events = require('./events.js')
  let lerp = require('./util.js').lerp
  let logControlSurfaceEvents = true

  // control surfaces
  this.apc = require('./controls_midi_apc40')
  this.outputAPC40
  let xboxController
  let touchOSC = require('./controls_midi_touchosc')
  let kb = require('./controls_kb')

  // camera
  this.camera = camera
  let orbitControlsEnabled = true // TOFIX: we'll need this back when first person controls are back in

  // TOFIX: make these Vector3's probably
  let cameraRotationDeltaX = 0.0
  let cameraRotationDeltaY = 0.0
  let cameraPositionDeltaX = 0.0
  let cameraPositionDeltaY = 0.0
  let joystickSensitivity = 2.0
  let cameraDollyDelta = 1.0
  let cameraDollySensitivity = 1.0

  // xbox controller
  this.xboxControllerSelected = false
  let xboxLeftJoystickButtonState = false
  let xboxLeftJoystickButtonLastState = false
  let xboxJoystickCalibration = {leftX: 0, leftY: 0, rightX: 0, rightY: 0}

  // This is only a member function because I don't want this references everywhere on the camera controls and etc variables
  this.updateCameraWithOrbitControls = function() {
    this.orbitControls.handleJoystickRotate(cameraRotationDeltaX * joystickSensitivity, cameraRotationDeltaY * joystickSensitivity)
    this.orbitControls.handleJoystickDolly(cameraDollyDelta * cameraDollySensitivity)
    this.orbitControls.handleJoystickPan(cameraPositionDeltaX * joystickSensitivity, cameraPositionDeltaY * joystickSensitivity)
    this.orbitControls.update()
  }

  this.updateCameraFromGamepadState = function() {
    if (!this.xboxControllerSelected) return

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

      cameraRotationDeltaX = lerp(0.25, -0.25, 0.5 + xboxController.axes[0] - xboxJoystickCalibration.leftX)
      cameraRotationDeltaY = lerp(0.25, -0.25, 0.5 + xboxController.axes[1] - xboxJoystickCalibration.leftY)
      cameraPositionDeltaX = lerp(1.0, -1.0, 0.5 + xboxController.axes[2] - xboxJoystickCalibration.rightX)
      cameraPositionDeltaY = lerp(1.0, -1.0, 0.5 + xboxController.axes[3] - xboxJoystickCalibration.rightY)
    }
  }

  this.cameraReset = function() {
    this.camera.position.set(0, 0.35, 0.75)
    this.orbitControls.target.set(0,0,0)
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
      self.outputAPC40 = midi.getOutputByName("Akai APC40")
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
        inputTouchOSC.addListener('noteon', "all", handleMidiNoteOn.bind(self))
        inputTouchOSC.addListener('noteoff', "all", handleMidiNoteOff)
        inputTouchOSC.addListener('controlchange', "all", handleMidiControlChangeTouchOSC)
      }

      if (self.outputAPC40) {
        self.apc.resetMainGridButtonLEDsToOffState(self.outputAPC40)
        self.apc.updateButtonLEDsForToggles(state, self, self.outputAPC40) // update LED state on init to make sure they properly represent current state
      }

      if (inputAudioAnalysis) {
        inputAudioAnalysis.addListener('controlchange', "all", (e) => {
          if (e.value) {
            let v = e.value / 127.0
            switch(e.controller.number) {
              case 0:
                state.audioAnalysisFilter1 = v * state.audioAnalysisFilter1Gain
                break
              case 1:
                state.audioAnalysisFilter2 = v * state.audioAnalysisFilter2Gain
                break
              case 2:
                state.audioAnalysisFilter3 = v * state.audioAnalysisFilter3Gain
                break
            }

            // console.log('[1]  ' + state.audioAnalysisFilter1 + '   [2]  ' + state.audioAnalysisFilter2 + '  [3]   ' +state.audioAnalysisFilter3)

            callbackForControlEvent('AUDIO_ANALYSIS_FILTER_UPDATE')
            if (state.audioAnalysisFilter1TriggerThresholdsEnabled) {
              updateAudioAnalysisTriggerThresholds.bind(this)()
            }
          }
        })
      }
    }, false)
  }

  function updateAudioAnalysisTriggerThresholds() {
    // TOFIX: DRY this up
    // filter 1
    if (!state.audioAnalaysisFilter1TriggerThresholdReached && (state.audioAnalysisFilter1 > state.audioAnalaysisFilter1TriggerThreshold)) {
      state.audioAnalaysisFilter1TriggerThresholdReached = true
      callbackForControlEvent('AUDIO_ANALYSIS_FILTER_1_TRIGGER_THRESHOLD_REACHED')
    } else if (state.audioAnalaysisFilter1TriggerThresholdReached && (state.audioAnalysisFilter1 < state.audioAnalaysisFilter1TriggerThreshold)) {
      state.audioAnalaysisFilter1TriggerThresholdReached = false
    }

    if (!state.audioAnalaysisFilter2TriggerThresholdReached && (state.audioAnalysisFilter2 > state.audioAnalaysisFilter2TriggerThreshold)) {
      state.audioAnalaysisFilter2TriggerThresholdReached = true
      callbackForControlEvent('AUDIO_ANALYSIS_FILTER_2_TRIGGER_THRESHOLD_REACHED')
    } else if (state.audioAnalaysisFilter2TriggerThresholdReached && (state.audioAnalysisFilter2 < state.audioAnalaysisFilter2TriggerThreshold)) {
      state.audioAnalaysisFilter2TriggerThresholdReached = false
    }

    if (!state.audioAnalaysisFilter3TriggerThresholdReached && (state.audioAnalysisFilter3 > state.audioAnalaysisFilter3TriggerThreshold)) {
      state.audioAnalaysisFilter3TriggerThresholdReached = true
      callbackForControlEvent('AUDIO_ANALYSIS_FILTER_3_TRIGGER_THRESHOLD_REACHED')
    } else if (state.audioAnalaysisFilter3TriggerThresholdReached && (state.audioAnalysisFilter3 < state.audioAnalaysisFilter3TriggerThreshold)) {
      state.audioAnalaysisFilter3TriggerThresholdReached = false
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
    // find out if it's from the APC or from TouchOSC, generate a unique name so no conflicts between controllers
    let noteNameAndChannel = e.note.name + e.channel.toString()
    // TOFIX: stupid hack to prevent collisions on button identifiers
    if (e.target._midiInput.name == "TouchOSC Bridge") {
      return "touchOSC-" + noteNameAndChannel + '-' + e.note.number.toString() // incredibly hacky way to uniquely identify midi controller buttons
    } else {
      return noteNameAndChannel
    }
  }

  function buttonPressed(buttonIdentifier) {
    // TOFIX: making immutable copies like this on input events may cause perf issues...
    let allInputSourcesEventIds = Object.assign({}, self.apc.buttonIdentifierToEventIdentifier)
        allInputSourcesEventIds = Object.assign({}, allInputSourcesEventIds, kb.buttonIdentifierToEventIdentifier)
        allInputSourcesEventIds = Object.assign({}, allInputSourcesEventIds, touchOSC.buttonIdentifierToEventIdentifier)

    // console.log('Handling button press: ' + buttonIdentifier + ' for event id: ' + allInputSourcesEventIds[buttonIdentifier])
    switch (allInputSourcesEventIds[buttonIdentifier]) {
      case events.SAVE_GARDEN_TO_PRESET_FILE:
        callbackForControlEvent(events.SAVE_GARDEN_TO_PRESET_FILE)
        break
      case events.LOAD_GARDEN_FROM_PRESET_FILE:
        callbackForControlEvent(events.LOAD_GARDEN_FROM_PRESET_FILE)
        break
      case events.GENERATE_NEW_RANDOM_GARDEN:
        callbackForControlEvent(events.GENERATE_NEW_RANDOM_GARDEN)
        break
      case events.GENERATE_NEW_PLANTS_TEXTURE_STYLES_TOGGLE:
        state.generateNewPlantsWithTextures = !state.generateNewPlantsWithTextures
        callbackForControlEvent(events.GENERATE_NEW_PLANTS_TEXTURE_STYLES_TOGGLE, {generateNewPlantsWithTextures: state.generateNewPlantsWithTextures})
        break
      case events.CAMERA_PRESETS_LEARN_TOGGLED:
        if (!state.gardenPresetModeEnabled) {
          state.cameraPresetsLearn = !state.cameraPresetsLearn
          callbackForControlEvent(events.CAMERA_PRESETS_LEARN_TOGGLED, {key: 'cameraPresetsLearn', value: state.cameraPresetsLearn})
          self.apc.resetMainGridButtonLEDsToOffState(self.outputAPC40)
          self.apc.updateButtonLEDsForToggles(state, self, self.outputAPC40) // update LED state on init to make sure they properly represent current state
        }
        break
      case events.XBOX_CONTROLLER_SELECTION_TOGGLED:
        self.xboxControllerSelected = !self.xboxControllerSelected
        if (self.xboxControllerSelected) {
          if (xboxController) {
            xboxJoystickCalibration.leftX = xboxController.axes[0]
            xboxJoystickCalibration.leftY = xboxController.axes[1]
            xboxJoystickCalibration.rightX = xboxController.axes[2]
            xboxJoystickCalibration.rightY = xboxController.axes[3]
          }
          resetCameraDeltas()
          callbackForControlEvent(events.XBOX_CONTROLLER_SELECTION_TOGGLED, {key: 'xboxControllerSelected', value: self.xboxControllerSelected})
        }
        break
      case events.CAMERA_CONTROLS_RESET:
        resetCameraDeltas()
        this.cameraReset.bind(this)()
        callbackForControlEvent(events.CAMERA_CONTROLS_RESET)
        break
      case events.GARDEN_PRESET_MODE_TOGGLED:
        callbackForControlEvent(events.GARDEN_PRESET_MODE_TOGGLED)
        self.apc.resetMainGridButtonLEDsToOffState(self.outputAPC40)
        self.apc.updateButtonLEDsForToggles(state, self, self.outputAPC40) // update LED state on init to make sure they properly represent current state
        break
      case events.GARDEN_PRESET_MODE_SAVE_NEXT_PRESET_TOGGLED:
        callbackForControlEvent(events.GARDEN_PRESET_MODE_SAVE_NEXT_PRESET_TOGGLED)
        // self.apc.updateButtonLEDsForToggles(state, self, self.outputAPC40)
        break
      case events.ADD_NEW_GARDEN_PRESET:
        callbackForControlEvent(events.ADD_NEW_GARDEN_PRESET)
        // self.apc.updateButtonLEDsForToggles(state, self, self.outputAPC40)
        break
      case events.DEBUGGER_PAUSE:
        callbackForControlEvent(events.DEBUGGER_PAUSE)
        break
      case events.TOGGLE_DAT_GUI:
        callbackForControlEvent(events.TOGGLE_DAT_GUI)
        break
      case events.EXPORT_STL:
        callbackForControlEvent(events.EXPORT_STL)
        break
      case events.AUDIO_ANALYSIS_CAN_UPDATE_CAMERA_Y_TOGGLE:
        state.audioAnalysisCanUpdateCamera = !state.audioAnalysisCanUpdateCamera
        break
      case 'p':
        debugger
        break
      default: {
          // handle garden presets save / load mode
        if (state.gardenPresetModeEnabled) {
          if (state.gardenPresetSaveNext) {
            state.gardenPresetSaveNext = false

            let index

            index = self.apc.indexOfButtonForIdentifier(buttonIdentifier)
            if (index == -1) {
              index = touchOSC.indexOfPresetHotkeyButtonForIdentifier(buttonIdentifier)
            }

            console.log('about to save preset index: ' + index)
            // TOFIX: this should be "next selected" preset and the index of the apc40 should correspond to the index of presets data
            // i should just initialize presets data with an array of empty objects so that the indexes are aligned?
            callbackForControlEvent(events.SAVE_GARDEN_TO_SELECTED_PRESET, {index: index})
          } else {
            let index = self.apc.indexOfButtonForIdentifier(buttonIdentifier)
            if (index == -1) {
              index = touchOSC.indexOfPresetHotkeyButtonForIdentifier(buttonIdentifier)
            }
            console.log('about to load preset index: ' + index)
            callbackForControlEvent(events.LOAD_GARDEN_FROM_SELECTED_PRESET, {index: index})
          }
        } else {
          // handle camera hotkey learn / trigger mode
          if (state.cameraPresetsLearn) {
            state.cameraPresetsLearn = false
            let data = {
              presetIdentifier: buttonIdentifier,
              controlsType: 'orbit',
              controlsOrbitMatrix: this.orbitControls.object.matrix.toArray(),
              controlsOrbitTarget: this.orbitControls.target.clone(),
              key: 'cameraPresetsLearn',  // TOFIX: sloppy hack to fix indicator updates
              value: state.cameraPresetsLearn
            }
            callbackForControlEvent(events.CAMERA_PRESET_LEARN, data)
          } else {
            let data = {
              presetIdentifier: buttonIdentifier
            }
            callbackForControlEvent(events.CAMERA_PRESET_TRIGGER, data)
            self.apc.lastCameraPresetIdentifier = buttonIdentifier
          }
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
    if (logControlSurfaceEvents) {
      console.log('Channel #: ' + e.channel + ' | Knob #: ' + e.controller.number + ' | Value: ' + e.value) // TOFIX: replace this with generic MIDI log function?
    }

    let v = e.value / 127.0

    // Camera, page 1
    if (e.channel == 1) {
      switch (e.controller.number) {
        case 0:
          if (!self.xboxControllerSelected) cameraRotationDeltaY = lerp(-0.5, 0.5, v)
          break
        case 1:
          if (!self.xboxControllerSelected) cameraRotationDeltaX = lerp(0.5, -0.5, v)
          break;
        case 2:
          if (!self.xboxControllerSelected) cameraPositionDeltaY = lerp(-0.5, 0.5, v)
          break;
        case 3:
          if (!self.xboxControllerSelected) cameraPositionDeltaX = lerp(0.5, -0.5, v)
          break;
        case 4:
          joystickSensitivity = lerp(0, 8.0, v)
          break
        case 5:
          cameraDollyDelta = lerp(1.0099, 0.986, v)
          break
        }
      // Textures, page 2
    } else if (e.channel == 3) {
      switch (e.controller.number) {
        case 7:
          state.textureUpdateSpeed = lerp(1.0, 10.0, v)
          break
        case 8:
          state.textureRepeatRange = lerp(1.0, 10.0, v)
          break
      } // Garden Presets
    } else if (e.channel == 4) {
      switch (e.controller.number) {
        case 0:
          presets.selectedStyleIndex = Math.floor(lerp(0, presets.styles.length - 1, v))
          break
        case 1:
          state.numPlantsForNextGeneration = Math.floor(lerp(0, 250, v))
          break
      }

    }

      // case 8:
      //   self.audioAnalaysisFilter3TriggerThreshold = lerp(0, 1.0, v)
      //   self.audioAnalaysisFilter3TriggerThresholdReached = false
      //   break
      // case 9:
      //   state.audioAnalysisFilter1Gain = lerp(0, 1.0, v)
      //   break
      // case 10:
      //   state.audioAnalysisFilter2Gain = lerp(0, 1.0, v)
      //   break
      // case 11:
      //   self.audioAnalysisFilter3Gain = lerp(0, 1.0, v)
      //   break
    //   case 15: {
    //     state.sameShaderForAllPlantsIndex = Math.floor(lerp(0, 14, v)) //TOFIX: keep this within bounds, pass in the shaders array length
    //     if (state.sameShaderForAllPlants) {
    //       callbackToUpdatePlantShaders(state.sameShaderForAllPlantsIndex)
    //     }
    //     break
    //   }
    //   default:
    // }
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
    // self.apc.updateButtonLEDsForToggles(state, self, self.outputAPC40)
  }

  function handleUnhandledMidiEvent(e) {
    // console.log('Unhandled MIDI event fired!')
    // console.log(e)
  }


  //////////////////////////////////////////
  // CALLBACK HELPERS

  function callbackToUpdatePlantShaders(shaderIndex) {
    if (state.sameShaderForAllPlants) {
      let data = {shaderIndex: shaderIndex}
      callbackForControlEvent(events.SET_SAME_SHADER_FOR_ALL_PLANTS, data)
    } else {
      callbackForControlEvent(events.RESET_SHADERS_TO_INITIAL_SHADER_FOR_ALL_PLANTS)
    }
  }

  // GOOOOOOOOOOOO!
  initializeMidi.bind(this)()
  document.body.addEventListener('keypress', handleKeyPress.bind(this))
  this.orbitControls = new THREE.OrbitControls(camera, elementForOrbitControls)
}


/////////////////////////////
// Public methods
// TOFIX: this reference

var interval = 0.001
Controls.prototype.update = function(state, presets) {
    this.updateCameraFromGamepadState()
    this.updateCameraWithOrbitControls()

    if (state.audioAnalysisCanUpdateCamera) {
      this.camera.position.set(this.camera.position.x, state.audioAnalysisFilter1,this.camera.position.z)
      // Update rotation with FFT MIDI data
      // let v = this.camera.rotation
      // this.camera.rotation.set(state.audioAnalysisFilter1 * state.audioAnalysisFilter1Gain, v.y, v.z)
    }

    this.updateMidiControllerLEDs(state, presets)
}

Controls.prototype.updateMidiControllerLEDs = function(state, presets) {
  // TOFIX: hack to not kill perf sending MIDI out too often
  interval++
  if (interval > 8.0) {
    if (this.outputAPC40) {
      if (state.gardenPresetModeEnabled) {
        this.apc.updateMainGridButtonLEDsForGardenPresetMode(presets, this.outputAPC40)
      } else {
        this.apc.updateMainGridButtonLEDsForCameraPresetMode(presets.selectedPresetCameraMap(), this.outputAPC40)
      }

      this.apc.updateButtonLEDsForToggles(state, this, this.outputAPC40)
    }
    interval = 0
  }
}

// TOFIX: sloppy, this tries to handle the conditions of setting camera preset for either first person or orbit controls
Controls.prototype.updateFromPresetData = function(data) {
  if (!data) {
    console.log('Expected there to be some camera preset data, but there wasnt! ******')
    return
  }
  var matrix = new THREE.Matrix4();
  matrix.fromArray(data.controlsOrbitMatrix)
  // apply position, quaternion, and scale from the matrix coming from presets to the camera using decompose()
  matrix.decompose(this.camera.position, this.camera.quaternion, this.camera.scale)
  // orbit controls needed the center property to be updated to properly position the camera after a pan, argh
  let updatedTarget = data.controlsOrbitTarget
  this.orbitControls.target.set(updatedTarget.x, updatedTarget.y, updatedTarget.z)
}

module.exports = Controls

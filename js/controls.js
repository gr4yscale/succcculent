function Controls(midi, camera, elementForOrbitControls, controlsEventCallback) {

  let self = this // fucking ES5 =\
  let lerp = require('./util.js').lerp
  let logControlSurfaceEvents = false
  let cameraPresetsLearn = false
  let cameraPositionUpdateX = 0.0
  let cameraPositionUpdateY = 0.0
  let cameraPositionUpdateZ = 0.0
  let cameraRotationDeltaX = 0.0
  let cameraRotationDeltaY = 0.0
  let cameraPositionDeltaX = 0.0
  let cameraPositionDeltaY = 0.0
  let joystickSensitivity = 1.0
  let cameraDollyDelta = 1.0

  this.orbitControls = new THREE.OrbitControls(camera, elementForOrbitControls)

  // This is only a member function because I don't want this references everywhere on the camera controls and etc variables
  this.updateCameraAndOrbitControlsState = function() {
    this.orbitControls.handleJoystickRotate(cameraRotationDeltaX * joystickSensitivity, cameraRotationDeltaY * joystickSensitivity)
    // this.orbitControls.scale += cameraDollyDelta
    this.orbitControls.handleJoystickDolly(cameraDollyDelta)
    this.orbitControls.handleJoystickPan(cameraPositionDeltaX * joystickSensitivity, cameraPositionDeltaY * joystickSensitivity)
    this.orbitControls.update()
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
      let inputTouchOSC = midi.getInputByName("TouchOSC Bridge")

      if (inputAPC40) {
        inputAPC40.addListener('noteoff', "all", handleUnhandledMidiEvent)
        inputAPC40.addListener('pitchbend', "all", handleUnhandledMidiEvent)
        inputAPC40.addListener('channelaftertouch', "all", handleUnhandledMidiEvent)
        inputAPC40.addListener('programchange', "all", handleUnhandledMidiEvent)
        inputAPC40.addListener('channelmode', "all", handleUnhandledMidiEvent)
        inputAPC40.addListener('noteon', "all", handleMidiNoteOn.bind(self))
        inputAPC40.addListener('controlchange', "all", handleMidiControlChange)
      }

      if (inputTouchOSC) {
        inputTouchOSC.addListener('noteoff', "all", handleUnhandledMidiEvent)
        inputTouchOSC.addListener('pitchbend', "all", handleUnhandledMidiEvent)
        inputTouchOSC.addListener('channelaftertouch', "all", handleUnhandledMidiEvent)
        inputTouchOSC.addListener('programchange', "all", handleUnhandledMidiEvent)
        inputTouchOSC.addListener('controlchange', "all", handleUnhandledMidiEvent)
        inputTouchOSC.addListener('noteon', "all", handleMidiNoteOn.bind(self))
        inputTouchOSC.addListener('channelmode', "all", handleMidiChannelMode)
      }
    })
  }

  function presetDataAcquiredCallback(matrix, target) {
    // apply position, quaternion, and scale from the matrix coming from presets to the camera using decompose()
    matrix.decompose(camera.position, camera.quaternion, camera.scale)
    // orbit controls needed the center property to be updated to properly position the camera after a pan, argh
    this.orbitControls.target.set(target.x, target.y, target.z)
  }

  function callbackForControlEvent(type, data) {
    let event = { type: type, data: data}
    controlsEventCallback(event)
  }

  function buttonIdentifierFromMidiEvent(e) {
    return e.note.name + e.channel.toString()
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
      case '/':
        cameraPresetsLearn = !cameraPresetsLearn
        break
      case 'p':
        debugger
        break
      default: {
        if (cameraPresetsLearn) {
          let data = {presetIdentifier: buttonIdentifier}
          callbackForControlEvent('CAMERA_PRESET_LEARN', data)
        } else {
          let data = {
            callback: presetDataAcquiredCallback.bind(this),
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
  function handleMidiChannelMode(e) {
    console.log('Knob #: ' + e.controller.number + ' | Value: ' + e.value) // TOFIX: replace this with generic MIDI log function?
    let v = e.value / 127.0

    switch (e.controller.number) {
      case 120:
        cameraRotationDeltaY = lerp(-0.5, 0.5, v)
        break
      case 121:
        cameraRotationDeltaX = lerp(0.5, -0.5, v)
        break;
      case 122:
        cameraPositionDeltaY = lerp(-2.0, 2.0, v)
        break;
      case 123:
        cameraPositionDeltaX = lerp(2.0, -2.0, v)
        break;
      case 124:
        cameraDollyDelta = lerp(1.01, 0.99, v)
      case 125:
        joystickSensitivity = lerp(0, 8.0, v)
      default:
    }
  }

  // MIDI - camera controls (APC40)
  function handleMidiControlChange(e) {
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

  function handleUnhandledMidiEvent(e) {
    console.log('Unhandled MIDI event fired!')
    console.log(e)
  }

  // GOOOOOOOOOOOO!
  initializeMidi()
  document.body.addEventListener('keypress', handleKeyPress.bind(this))
}


/////////////////////////////
// Public methods

Controls.prototype.update = function() {
  // TOFIX: update gamepad state
  this.updateCameraAndOrbitControlsState()
}

module.exports = Controls

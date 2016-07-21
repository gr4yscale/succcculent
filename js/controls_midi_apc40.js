let events = require('./events.js')
var apc = exports

// TOFIX: devise a scheme to maintain visual state of APC40 grid based on underlying state (presets, controls, etc)


// constants

// TOFIX: update APC lights state based on events, not on button identifiers
const buttonIdentifierToAPC40PacketPrefix = {
  // TOFIX: the right most column lights may not come on with MIDI out, if not then try other buttons
  'A#1' :  {0: 0x98, 1: 0x35},
  'F#8' :  {0: 0x98, 1: 0x36},
  'B1' :   {0: 0x98, 1: 0x37},
  '/'   :  {0: 0x97, 1: 0x35} // TOFIX: handling button identifiers from other controllers? hrm...DRY this up later
}

// public

apc.buttonIdentifierToEventIdentifier = {
  'A#1': events.CAMERA_PRESETS_LEARN_TOGGLED,
  'F#8': events.XBOX_CONTROLLER_SELECTION_TOGGLED,
  'B1': events.GENERATE_NEW_RANDOM_GARDEN,
  'C1': events.GENERATE_NEW_PLANTS_TEXTURE_STYLES_TOGGLE,
  'D1': events.CAMERA_CONTROLS_RESET
}

apc.updateAPC40ToggleButtonLEDs = function(state, controls, outputAPC) {
  updateAPC40Button('A#1', state.cameraPresetsLearn, false, outputAPC)
  updateAPC40Button('F#8', controls.xboxControllerSelected, false, outputAPC)
  // TOFIX: disable for now, we'll do a better job with updating the lights state
  // let button = buttonIdentifierToAPC40PacketPrefix[lastCameraPresetIdentifierPressed]
  // if (button) {
  //   updateAPC40Button(button, true, true, outputAPC)
  // }
}

// private

function updateAPC40Button(buttonIdentifier, illuminate, blink, outputAPC) {
  let map = buttonIdentifierToAPC40PacketPrefix[buttonIdentifier]
  if (!outputAPC || !map) return
  let lastByte = illuminate ? 0x01 : 0x00
  if (blink) lastByte = 0x02
  let packet = [map[0],map[1],lastByte]
  outputAPC40.send(0xFF, packet)
}

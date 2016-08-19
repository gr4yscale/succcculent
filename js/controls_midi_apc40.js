let events = require('./events.js')
var apc = exports

// init this with the stuff it needs (presets, controls, state, apc),
// make all LED update calls private and expose an update() func

// TOFIX: devise a scheme to maintain visual state of APC40 grid based on underlying state (presets, controls, etc)

// constants

// TOFIX: update APC lights state based on events, not on button identifiers
const buttonIdentifierToAPC40PacketPrefix = {
  // TOFIX: the right most column lights don't come on, investigate APC40 comm protocol
  '/'   :  {0: 0x97, 1: 0x35}, // TOFIX: handling button identifiers from other controllers? hrm...DRY this up later
  // TOFIX: these are wrong
  'F1' :   {0: 0x90, 1: 0x35},
  'F2' :   {0: 0x91, 1: 0x35},
  'F3' :   {0: 0x92, 1: 0x35},
  'F4' :   {0: 0x93, 1: 0x35},
  'F5' :   {0: 0x94, 1: 0x35},
  'F6' :   {0: 0x95, 1: 0x35},
  'F7' :   {0: 0x96, 1: 0x35},
  'F8' :   {0: 0x97, 1: 0x35},

  'F#1' :  {0: 0x90, 1: 0x36},
  'F#2' :  {0: 0x91, 1: 0x36},
  'F#3' :  {0: 0x92, 1: 0x36},
  'F#4' :  {0: 0x93, 1: 0x36},
  'F#5' :  {0: 0x94, 1: 0x36},
  'F#6' :  {0: 0x95, 1: 0x36},
  'F#7' :  {0: 0x96, 1: 0x36},
  'F#8' :  {0: 0x97, 1: 0x36},

  'G1' :   {0: 0x90, 1: 0x37},
  'G2' :   {0: 0x91, 1: 0x37},
  'G3' :   {0: 0x92, 1: 0x37},
  'G4' :   {0: 0x93, 1: 0x37},
  'G5' :   {0: 0x94, 1: 0x37},
  'G6' :   {0: 0x95, 1: 0x37},
  'G7' :   {0: 0x96, 1: 0x37},
  'G8' :   {0: 0x97, 1: 0x37},

  'G#1' :  {0: 0x90, 1: 0x38},
  'G#2' :  {0: 0x91, 1: 0x38},
  'G#3' :  {0: 0x92, 1: 0x38},
  'G#4' :  {0: 0x93, 1: 0x38},
  'G#5' :  {0: 0x94, 1: 0x38},
  'G#6' :  {0: 0x95, 1: 0x38},
  'G#7' :  {0: 0x96, 1: 0x38},
  'G#8' :  {0: 0x97, 1: 0x38},

  'A1' :   {0: 0x90, 1: 0x39},
  'A2' :   {0: 0x91, 1: 0x39},
  'A3' :   {0: 0x92, 1: 0x39},
  'A4' :   {0: 0x93, 1: 0x39},
  'A5' :   {0: 0x94, 1: 0x39},
  'A6' :   {0: 0x95, 1: 0x39},
  'A7' :   {0: 0x96, 1: 0x39},
  'A8' :   {0: 0x97, 1: 0x39},

  'E1' :   {0: 0x90, 1: 0x34},
  'E2' :   {0: 0x91, 1: 0x34},
  'E3' :   {0: 0x92, 1: 0x34},
  'E4' :   {0: 0x93, 1: 0x34},
  'E5' :   {0: 0x94, 1: 0x34},
  'E6' :   {0: 0x95, 1: 0x34},
  'E7' :   {0: 0x96, 1: 0x34},
  'E8' :   {0: 0x97, 1: 0x34}

}

const mainGridButtonIdentifiers = [
  'F1',   'F2',   'F3',   'F4',   'F5',   'F6',   'F7',   'F8',
  'F#1',  'F#2',  'F#3',  'F#4',  'F#5',  'F#6',  'F#7',  'F#8',
  'G1',   'G2',   'G3',   'G4',   'G5',   'G6',   'G7',   'G8',
  'G#1',  'G#2',  'G#3',  'G#4',  'G#5',  'G#6',  'G#7',  'G#8',
  'A1',   'A2',   'A3',   'A4',   'A5',   'A6',   'A7',   'A8'
]

const rightColumnNearMainGridIdentifiers = [
  'A#1', 'B1', 'C1', 'C#1', 'D1'
]

const bottomColumnDirectlyUnderMainGridIdentifiers = [
  'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8'
]

// public

apc.buttonIdentifierToEventIdentifier = {
  'E1': events.CAMERA_PRESETS_LEARN_TOGGLED,
  'xbox10': events.CAMERA_PRESETS_LEARN_TOGGLED, // TOFIX: stupid hack to map xbox controller left joystick to camera learn
  'E2': events.XBOX_CONTROLLER_SELECTION_TOGGLED,
  'E3': events.CAMERA_CONTROLS_RESET,
  'E5': events.GENERATE_NEW_PLANTS_TEXTURE_STYLES_TOGGLE,
  'A#1': events.GARDEN_PRESET_MODE_TOGGLED,
  'B1': events.ADD_NEW_GARDEN_PRESET,
  'C1': events.GENERATE_NEW_RANDOM_GARDEN,
  'C#1': events.GARDEN_PRESET_MODE_SAVE_NEXT_PRESET_TOGGLED
}

// TOFIX: should probably loop over APC buttons, not presets.data.length
apc.updateMainGridButtonLEDsForGardenPresetMode = function(presets, outputAPC) {
  for (var i = 0; i < presets.data.length; i++) {
    let id = mainGridButtonIdentifiers[i]
    // TOFIX: handle 'selected' state with a blink
    updateAPC40Button(id, true, false, outputAPC)
  }
}

apc.updateMainGridButtonLEDsForCameraPresetMode = function(map, outputAPC) {
  for (var i = 0; i< mainGridButtonIdentifiers.length; i++) {
    let state = 0 // off
    let id = mainGridButtonIdentifiers[i]
    if (map[id]) {
      state = 1 // on
    }
    // TOFIX: handle 'selected' state with a blink
    updateAPC40Button(id, (state == 1), (state == -1), outputAPC)
  }
}

apc.updateButtonLEDsForToggles = function(state, controls, outputAPC) {
  updateAPC40Button('E1', state.cameraPresetsLearn, false, outputAPC)
  updateAPC40Button('E2', controls.xboxControllerSelected, false, outputAPC)
  updateAPC40Button('E5', state.generateNewPlantsWithTextures, false, outputAPC)
  updateAPC40Button('C#1', state.gardenPresetSaveNext, false, outputAPC)
}

apc.resetMainGridButtonLEDsToOffState = function(outputAPC) {
  for (var i = 0; i< mainGridButtonIdentifiers.length; i++) {
    updateAPC40Button(mainGridButtonIdentifiers[i], false, false, outputAPC)
  }
}

apc.indexOfButtonForIdentifier = function(identifier) {
  return mainGridButtonIdentifiers.indexOf(identifier)
}

// private

function updateAPC40Button(buttonIdentifier, illuminate, blink, outputAPC) {
  let map = buttonIdentifierToAPC40PacketPrefix[buttonIdentifier]
  if (!outputAPC || !map) return
  let lastByte = illuminate ? 0x01 : 0x00
  if (blink) lastByte = 0x02
  let packet = [map[0],map[1],lastByte]
  outputAPC.send(0xFF, packet)
}

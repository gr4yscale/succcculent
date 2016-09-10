let events = require('./events.js')
var touchOSC = exports

// TOFIX: devise a scheme to maintain visual state of touchOSC40 grid based on underlying state (presets, controls, etc)

// constants

const presetHotkeyButtonIdentifiers = [
  'touchOSC-G#4-8', 'touchOSC-C4-12', 'touchOSC-E4-16', 'touchOSC-G#4-20', 'touchOSC-C4-24',
  'touchOSC-G4-7', 'touchOSC-B4-11', 'touchOSC-D#1-15', 'touchOSC-G4-19', 'touchOSC-B4-23',
  'touchOSC-F#4-6', 'touchOSC-A#4-10', 'touchOSC-D4-14', 'touchOSC-F#4-18', 'touchOSC-A#1-22',
  'touchOSC-F4-5', 'touchOSC-A4-9', 'touchOSC-C#4-13', 'touchOSC-F4-17', 'touchOSC-A4-21'
]

touchOSC.buttonIdentifierToEventIdentifier = {
  'touchOSC-G#1-20': events.CAMERA_PRESETS_LEARN_TOGGLED,
  // 'touchOSC-F1': events.XBOX_CONTROLLER_SELECTION_TOGGLED,
  'touchOSC-D#1-15': events.CAMERA_CONTROLS_RESET,
  'touchOSC-A#4-70': events.GENERATE_NEW_RANDOM_GARDEN,
  'touchOSC-C#4-73': events.GARDEN_PRESET_MODE_TOGGLED,
  'touchOSC-C4-72': events.GARDEN_PRESET_MODE_SAVE_NEXT_PRESET_TOGGLED,

  // 'C1': events.GENERATE_NEW_PLANTS_TEXTURE_STYLES_TOGGLE,
}

touchOSC.indexOfPresetHotkeyButtonForIdentifier = function(identifier) {
  return presetHotkeyButtonIdentifiers.indexOf(identifier)
}

// TODO:
// Map knob values to variables?

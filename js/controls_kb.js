let events = require('./events.js')
var kb = exports

kb.buttonIdentifierToEventIdentifier = {
  '/': events.CAMERA_PRESETS_LEARN_TOGGLED,
  '.': events.XBOX_CONTROLLER_SELECTION_TOGGLED,
  ',': events.GENERATE_NEW_RANDOM_GARDEN,
  'm': events.GENERATE_NEW_PLANTS_TEXTURE_STYLES_TOGGLE,
  'n': events.CAMERA_CONTROLS_RESET,
  's': events.SAVE_GARDEN_TO_PRESET_FILE,
  'q': events.LOAD_GARDEN_FROM_PRESET_FILE,
  ']': events.AUDIO_ANALYSIS_CAN_UPDATE_CAMERA_Y_TOGGLE
}

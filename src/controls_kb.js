var kb = exports

kb.buttonIdentifierToEventIdentifier = {
  '/': events.CAMERA_PRESETS_LEARN_TOGGLED,
  '.': events.XBOX_CONTROLLER_SELECTION_TOGGLED,
  ',': events.GENERATE_NEW_RANDOM_GARDEN,
  'm': events.GENERATE_NEW_PLANTS_TEXTURE_STYLES_TOGGLE,
  'n': events.CAMERA_CONTROLS_RESET,
  's': events.SAVE_GARDEN_TO_PRESET_FILE,
  'q': events.LOAD_GARDEN_FROM_PRESET_FILE
}

// Keyboard
function handleKeyPress(e) {
    buttonPressed(e.key) // TOFIX: Fucking ES5! Gotta move this over to ES6 soon...
}

document.body.addEventListener('keypress', handleKeyPress)

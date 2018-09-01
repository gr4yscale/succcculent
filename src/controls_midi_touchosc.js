let events = require('./events.js')
var touchOSC = exports

// TOFIX: devise a scheme to maintain visual state of touchOSC40 grid based on underlying state (presets, controls, etc)

// constants

touchOSC.buttonIdentifierToEventIdentifier = {
    'touchOSC-E1': events.CAMERA_PRESETS_LEARN_TOGGLED,
    'touchOSC-F1': events.XBOX_CONTROLLER_SELECTION_TOGGLED,
    'touchOSC-D#1': events.CAMERA_CONTROLS_RESET,
    'touchOSC-C3': events.GENERATE_NEW_PLANTS_TEXTURE_STYLES_TOGGLE
    // 'B1': events.GENERATE_NEW_RANDOM_GARDEN,
    // 'C1': events.GENERATE_NEW_PLANTS_TEXTURE_STYLES_TOGGLE,
}


// TODO:
// Map knob values to variables?

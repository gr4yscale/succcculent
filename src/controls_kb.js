import * as actionTypes from './redux/actions/actionTypes'
import {standard} from './redux/actions/index'

export default (domElement, store) => {
    console.log('initializing keyboard controls')
    domElement.addEventListener('keypress', (e) => {
        switch (e.key) {
            case '/':
                store.dispatch({type: actionTypes.CAMERA_PRESETS_LEARN_TOGGLED});
                break
            default:
                store.dispatch({
                    type: actionTypes.HOTKEY_PRESSED,
                    payload: e.key
                })
                break
        }
    })
}

// '/': events.CAMERA_PRESETS_LEARN_TOGGLED,
//     '.': events.XBOX_CONTROLLER_SELECTION_TOGGLED,
//     ',': events.GENERATE_NEW_RANDOM_GARDEN,
//     'm': events.GENERATE_NEW_PLANTS_TEXTURE_STYLES_TOGGLE,
//     'n': events.CAMERA_CONTROLS_RESET,
//     's': events.SAVE_GARDEN_TO_PRESET_FILE,
//     'q': events.LOAD_GARDEN_FROM_PRESET_FILE

import * as actionTypes from "../actions/actionTypes"

const initialState = {
    cameraLearnEnabled: false, //cameraPresetsLearn: false,
    // sameShaderForAllPlants: false,
    // sameShaderForAllPlantsIndex: 0
}

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CAMERA_PRESETS_LEARN_TOGGLED:
            return { ...state, cameraLearnEnabled: !state.cameraLearnEnabled }
        default:
            break
    }
    return state
}

// reducer behaviors to bring in here

//         case events.CAMERA_PRESETS_LEARN_TOGGLED:
//             if (!state.gardenPresetModeEnabled) {
//                 state.cameraPresetsLearn = !state.cameraPresetsLearn
//                 callbackForControlEvent(events.CAMERA_PRESETS_LEARN_TOGGLED, {key: 'cameraPresetsLearn', value: state.cameraPresetsLearn})
//                 apc.resetMainGridButtonLEDsToOffState(soutputAPC40)
//                 apc.updateButtonLEDsForToggles(state, self, outputAPC40) // update LED state on init to make sure they properly represent current state
//             }
//             break
//         case events.CAMERA_CONTROLS_RESET:
//             resetCameraDeltas()
//             this.cameraReset()
//             callbackForControlEvent(events.CAMERA_CONTROLS_RESET)
//             break
//         case events.GARDEN_PRESET_MODE_TOGGLED:
//             callbackForControlEvent(events.GARDEN_PRESET_MODE_TOGGLED)
//             self.apc.resetMainGridButtonLEDsToOffState(self.outputAPC40)
//             self.apc.updateButtonLEDsForToggles(state, self, self.outputAPC40) // update LED state on init to make sure they properly represent current state
//             break
//         case events.GARDEN_PRESET_MODE_SAVE_NEXT_PRESET_TOGGLED:
//             callbackForControlEvent(events.GARDEN_PRESET_MODE_SAVE_NEXT_PRESET_TOGGLED)
//             // self.apc.updateButtonLEDsForToggles(state, self, self.outputAPC40)
//             break
//         case events.ADD_NEW_GARDEN_PRESET:
//             callbackForControlEvent(events.ADD_NEW_GARDEN_PRESET)
//             // self.apc.updateButtonLEDsForToggles(state, self, self.outputAPC40)
//             break

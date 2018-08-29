import * as actionTypes from "../actions/actionTypes"

const initialState = {
    // modes / control surfaces
    cameraLearnEnabled: false, //cameraPresetsLearn: false,

    // camera
    cameraRotationDeltaX: 0.1,
    cameraRotationDeltaY: 0.0,
    cameraDollyDelta: 1.0,
    cameraDollySensitivity: 1.0,
    cameraPositionDeltaX: 0.0,
    cameraPositionDeltaY: 0.0,
    joystickSensitivity: 1.0,

    // shaders
    shaderTickerSpeed: 1000,

  // sameShaderForAllPlants: false,
  // sameShaderForAllPlantsIndex: 0
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CAMERA_UPDATE_ROTATION_DELTA:
      return {
        ...state,
        cameraRotationDeltaX: action.payload.x ? action.payload.x : state.cameraRotationDeltaX,
        cameraRotationDeltaY: action.payload.y ? action.payload.y : state.cameraRotationDeltaY,

      }
    case actionTypes.CAMERA_UPDATE_DOLLY_DELTA:
      return {
        ...state,
        cameraDollyDelta: action.payload.val
      }
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

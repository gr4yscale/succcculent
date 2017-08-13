import {routerReducer as routing} from 'react-router-redux'
import {combineReducers} from 'redux'
import * as actionTypes from '../actions/actionTypes'

const initialState = {
  // garden generation
  numPlantsForNextGeneration : 100,
  adHocGardenGenerationEnabled: false,
  adHocPlantParamsPetalCount: 36,
  adHocPlantParamsCurveAmountB: 0.13275223848488998,
  adHocPlantParamsCurveAmountC: 0.20827196143002302,
  adHocPlantParamsCurveAmountD: 0.36005163068644075,
  adHocPlantParamsLayers: 6,
  adHocPlantParamsPetalLength: 0.43796780893085985,
  adHocPlantParamsPetalWidth: 0.5438646263177942,

  // modes:
  gardenPresetModeEnabled: false,
  gardenPresetSaveNext: false,

  // camera presets learn
  cameraPresetsLearn: false,

  // same shaders
  sameShaderForAllPlants: false,
  sameShaderForAllPlantsIndex: 0,

  // texture mode
  generateNewPlantsWithTextures: false,
  textureRepeatRange: 1,
  textureUpdateSpeed: 0.5,
}



// const app = (state = {}, action) => {
//   // console.log('Handling control event of type: ' + e.type)
//   switch (action.type) {
//     case actionTypes.SAVE_GARDEN_TO_PRESET_FILE:
//       presets.save('plants.json')
//       break
//     case actionTypes.LOAD_GARDEN_FROM_PRESET_FILE:
//       loadFirstGardenFromPresetFile()
//       break
//     case actionTypes.GENERATE_NEW_RANDOM_GARDEN:
//       generateNewRandomGarden()
//       break
//     case actionTypes.GARDEN_PRESET_MODE_TOGGLED:
//       state.gardenPresetModeEnabled = !state.gardenPresetModeEnabled
//       break
//     case actionTypes.GARDEN_PRESET_MODE_SAVE_NEXT_PRESET_TOGGLED:
//       state.gardenPresetSaveNext = !state.gardenPresetSaveNext
//       console.log('preset save next : ' + state.gardenPresetSaveNext)
//       break
//     case actionTypes.ADD_NEW_GARDEN_PRESET:
//       presets.addNew()
//       break
//     case actionTypes.LOAD_GARDEN_FROM_SELECTED_PRESET:
//       presets.select(e.data.index)
//       loadGardenFromSelectedPreset()
//       break
//     case actionTypes.SAVE_GARDEN_TO_SELECTED_PRESET:
//       presets.select(e.data.index)
//       presets.saveLastGeneratedPresetForSelectedIndex()
//       break
//     case actionTypes.DEBUGGER_PAUSE:
//       debugger
//       break
//     case actionTypes.CAMERA_PRESETS_LEARN_TOGGLED: {
//       updateIndicators(e.data)
//       break
//     }
//     case actionTypes.CAMERA_PRESET_LEARN: {
//       let presetIdentifier = e.data.presetIdentifier
//       presets.updateCameraMap(presetIdentifier, camera, e.data)
//       // console.log('Updated camera presets for identifier: ' + presetIdentifier)
//       updateIndicators(e.data)
//       break
//     }
//     case actionTypes.CAMERA_PRESET_TRIGGER: {
//       // get the serialized matrix out of presets (which stores the matrix the matrix as an array for convenient persistence)
//       // use the callback that controls gives to let it update camera / orbitcontrols state
//       let presetIdentifier = e.data.presetIdentifier
//       let data = presets.selectedPresetCameraMap()
//       if (data) {
//         controls.updateFromPresetData(data[presetIdentifier])
//         // console.log('Triggered orbit controls and camera update using preset with identifier: ' + presetIdentifier)
//       } else {
//         console.log('There is no preset for identifier: ' + presetIdentifier + '!')
//       }
//       break
//     }
//     case actionTypes.CAMERA_CONTROLS_RESET:
//       break
//     case actionTypes.SET_SAME_SHADER_FOR_ALL_PLANTS: {
//       setSameShaderForAllPlants(e.data.shaderIndex)
//       break
//     }
//     case actionTypes.RESET_SHADERS_TO_INITIAL_SHADER_FOR_ALL_PLANTS:
//       resetShadersForAllPlants()
//       break
//     case actionTypes.GENERATE_NEW_PLANTS_TEXTURE_STYLES_TOGGLE: {
//       presets.generateNewPlantsWithTextures = e.data.generateNewPlantsWithTextures
//       console.log(e.data)
//       break
//     }
//     default:
//       // console.log('Received unknown control type! *******')
//       break
//   }
//   return state
// }

//
// const rootReducer = combineReducers({
//   routing, // updates this store with latest browser history state synced from react-router on route changes
//   app
// })

const dummy = (state = initialState, action) => {
  return state
}

const rootReducer = combineReducers({dummy})

export default rootReducer

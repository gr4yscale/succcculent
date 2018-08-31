// App
import Succulent from './succulent'
import Garden from './garden'

// React
import React from 'react'
import {render} from 'react-dom'
import Root from './components/Root'

// Redux
import configureStore from './redux/store/configureStore'
import {standard} from './redux/actions/index'
import * as actionTypes from './redux/actions/actionTypes'

import DebugGUI from './gui'

const THREE = window.THREE //todo assumes THREE script already loaded, yucky
const debugGUI = new DebugGUI()

let succulentBuilder = Succulent(THREE)                 //TODO rename SucculentBuilder
const garden = new Garden(THREE, succulentBuilder, debugGUI)
const store = configureStore(garden)

// let FirstPersonControls = require('./controls_first_person_deprecated.js')

setTimeout(() => garden.setup(store), 0.25)
setTimeout(() => garden.resize(), 1)

setTimeout(() => {
    store.dispatch(
        standard(actionTypes.GARDEN_GENERATE_PLANT_PARAMS)
    )
}, 1)

render(
  <Root store={store} />,
  document.getElementById('ReactRoot')
)

window.addEventListener('resize', garden.resize, false)



//
// const middleware = store => dispatch => action => {
//     if (action.type === 'FETCH') {
//         doSomethingDifferent()
//     }
//     dispatch(action)
// }


// function handleControlsEvent(e) {
//     // console.log('Handling control event of type: ' + e.type)
//     switch (e.type) {
//         case events.ADD_SUCCULENT_IN_RANDOM_POSITION:
//             console.log('add a succulent randomly (outside of the normal parameter loading/saving)')
//             console.log('will have to get random params, deal with this later....')
//             break
//         case events.SAVE_GARDEN_TO_PRESET_FILE:
//             presets.save('plants.json')
//             break
//         case events.LOAD_GARDEN_FROM_PRESET_FILE:
//             loadFirstGardenFromPresetFile()
//             break
//         case events.GENERATE_NEW_RANDOM_GARDEN:
//             generateNewRandomGarden()
//             break
//         case events.GARDEN_PRESET_MODE_TOGGLED:
//             state.gardenPresetModeEnabled = !state.gardenPresetModeEnabled
//             break
//         case events.GARDEN_PRESET_MODE_SAVE_NEXT_PRESET_TOGGLED:
//             state.gardenPresetSaveNext = !state.gardenPresetSaveNext
//             console.log('preset save next : ' + state.gardenPresetSaveNext)
//             break
//         case events.ADD_NEW_GARDEN_PRESET:
//             presets.addNew()
//             break
//         case events.LOAD_GARDEN_FROM_SELECTED_PRESET:
//             presets.select(e.data.index)
//             loadGardenFromSelectedPreset()
//             break
//         case events.SAVE_GARDEN_TO_SELECTED_PRESET:
//             presets.select(e.data.index)
//             presets.saveLastGeneratedPresetForSelectedIndex()
//             break
//         case events.DEBUGGER_PAUSE:
//             debugger
//             break
//         case events.CAMERA_PRESETS_LEARN_TOGGLED: {
//             updateIndicators(e.data)
//             break
//         }
//         case events.CAMERA_PRESET_LEARN: {
//             let presetIdentifier = e.data.presetIdentifier
//             presets.updateCameraMap(presetIdentifier, camera, e.data)
//             // console.log('Updated camera presets for identifier: ' + presetIdentifier)
//             updateIndicators(e.data)
//             break
//         }
//         case events.CAMERA_PRESET_TRIGGER: {
//             // get the serialized matrix out of presets (which stores the matrix the matrix as an array for convenient persistence)
//             // use the callback that controls gives to let it update camera / orbitcontrols state
//             let presetIdentifier = e.data.presetIdentifier
//             let data = presets.selectedPresetCameraMap()
//             if (data) {
//                 controls.updateFromPresetData(data[presetIdentifier])
//                 console.log('Triggered orbit controls and camera update using preset with identifier: ' + presetIdentifier)
//             } else {
//                 console.log('There is no preset for identifier: ' + presetIdentifier + '!')
//             }
//             break
//         }
//         case events.CAMERA_CONTROLS_RESET:
//             break
//         case events.SET_SAME_SHADER_FOR_ALL_PLANTS: {
//             setSameShaderForAllPlants(e.data.shaderIndex)
//             break
//         }
//         case events.RESET_SHADERS_TO_INITIAL_SHADER_FOR_ALL_PLANTS:
//             resetShadersForAllPlants()
//             break
//         case events.AUDIO_ANALYSIS_FILTER_UPDATE:
//             // console.log(e.data.filter1 + ' | ' + e.data.filter2 + ' | ' + e.data.filter3)
//             break
//         // cameraDollySensitivity events.AUDIO_ANALYSIS_FILTER_1_TRIGGER_THRESHOLD_REACHED: {
//         //     console.log('tried to trigger filter 1')
//         //     let map = presets.cameraMap['1']
//         //     if (map) {
//         //         console.log(map)
//         //         controls.updateFromPresetData(map)
//         //     }
//         //     break
//         // }
//         // case events.AUDIO_ANALYSIS_FILTER_2_TRIGGER_THRESHOLD_REACHED: {
//         //     console.log('tried to trigger filter 2')
//         //     let map = presets.cameraMap['2']
//         //     if (map) {
//         //         console.log(map)
//         //         controls.updateFromPresetData(map)
//         //     }
//         //     break
//         // }
//         case events.AUDIO_ANALYSIS_FILTER_3_TRIGGER_THRESHOLD_REACHED:
//             break
//         case events.GENERATE_NEW_PLANTS_TEXTURE_STYLES_TOGGLE: {
//             presets.generateNewPlantsWithTextures = e.data.generateNewPlantsWithTextures
//             console.log(e.data)
//             break
//         }
//         default:
//             // console.log('Received unknown control type! *******')
//             break
//     }
//

// import {browserHistory} from 'react-router'
// import {syncHistoryWithStore} from 'react-router-redux'
// import {requestInitialData} from './redux/actions' //TOFIX: trigger initial garden generation, perhaps


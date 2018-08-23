import * as actionTypes from "../actions/actionTypes"
import styles from './styles'
import { getRandomArbitrary } from "./util"

// TOFIX: move out of reducer probably
let fileReader = new FileReader()

const initialState = {
    selectedStyleIndex: 0,
    selectedPresetIndex: 0,
    data: [],
    lastGeneratedPresetData: {},
    generateNewPlantsWithTextures: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CAMERA_UPDATE_DOLLY_DELTA:
            return {
                ...state,
                cameraDollyDelta: action.payload.val
            }
        case events.SAVE_GARDEN_TO_SELECTED_PRESET:
            presets.select(e.data.index)
            presets.saveLastGeneratedPresetForSelectedIndex()
        default:
            break
    }
    return state
}

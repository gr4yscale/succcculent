import * as actionTypes from '../actions/actionTypes'

const middleware = garden => store => dispatch => action => {
    let state = store.getState()
    dispatch(action)

    switch (action.type) {
        case actionTypes.HOTKEY_PRESSED: {
            if (state.app.cameraLearnEnabled) {
                console.log('camera learn enabled')
                // saveCameraMatrix()
            } else {
                console.log('camera learn disabled')
                // garden.loadCameraMatrix()
                // loadCameraMatrix()
            }
            break
        }
        case actionTypes.CAMERA_LEARN_ENABLED: {
            // saveCameraMatrix()
            break
        }
        case actionTypes.CAMERA_PRESET_TRIGGER: {
            // get the serialized matrix out of presets (which stores the matrix the matrix as an array for convenient persistence)
            // use the callback that controls gives to let it update camera / orbitcontrols state
            // let presetIdentifier = e.data.presetIdentifier
            // let data = presets.selectedPresetCameraMap()
            // if (data) {
            //     controls.updateFromPresetData(data[presetIdentifier])
            //     console.log('Triggered orbit controls and camera update using preset with identifier: ' + presetIdentifier)
            // } else {
            //     console.log('There is no preset for identifier: ' + presetIdentifier + '!')
            // }
            break
        }
        default:
            break
    }
}

export default middleware

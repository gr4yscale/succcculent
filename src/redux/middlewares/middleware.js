import * as actionTypes from '../actions/actionTypes'

const middleware = garden => store => dispatch => action => {
    let state = store.getState()
    dispatch(action)

    switch (action.type) {
        case actionTypes.GARDEN_GENERATE_PLANT_PARAMS: {
            garden.reset()
        }
            break
        // TODO we could dispatch this from a middleware that is intercepting control surface actions, perhaps
        // TODO this is where we will want to map control surface-specific identifiers to something generic
        case actionTypes.HOTKEY_PRESSED: {
            const key = action.payload
            if (state.scene.cameraLearnEnabled) {
                console.log('Saving camera hotkey data')
                let data = {
                    //TODO map keyboard and APC40 the same - first two rows for each? shift on keyboard?
                    presetIdentifier: key,
                    matrix: garden.getCameraMatrix(),
                    deltas: {
                        // TODO break this out into a "scene" reducer
                        cameraRotationDeltaX: state.scene.cameraRotationDeltaX,
                        cameraRotationDeltaY: state.scene.cameraRotationDeltaY,
                        cameraDollyDelta: state.scene.cameraDollyDelta,
                        cameraDollySensitivity: state.scene.cameraDollySensitivity,
                        cameraPositionDeltaX: state.scene.cameraPositionDeltaX,
                        cameraPositionDeltaY: state.scene.cameraPositionDeltaY,
                        joystickSensitivity: state.scene.joystickSensitivity,
                    }
                }
                dispatch({type: actionTypes.SAVE_CAMERA_HOTKEY, payload: data})
                dispatch({type: actionTypes.CAMERA_PRESETS_LEARN_TOGGLED})
            } else {
                console.log('Loading camera hotkey data')
                let data = {}
                dispatch({type: actionTypes.LOAD_CAMERA_HOTKEY, payload: data})
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
                // garden.applyCameraMatrix()
            }
            break
        }
        default:
            break
    }
}

export default middleware

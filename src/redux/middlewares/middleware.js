import * as actionTypes from '../actions/actionTypes'
import {standard} from '../actions/index'

const middleware = garden => store => dispatch => action => {
    let state = store.getState()
    dispatch(action)

    switch (action.type) {
        case actionTypes.HOTKEY_PRESSED: { // TODO we could dispatch this from a middleware that is intercepting control surface actions, perhaps
            const key = action.payload // TODO this is where we will want to map control surface-specific identifiers to something generic
            if (state.app.cameraLearnEnabled) {
                console.log('camera learn enabled: saving matrix')
                let data = {
                    //TODO map keyboard and APC40 the same - first two rows for each? shift on keyboard?
                    presetIdentifier: key,
                    data: garden.getCameraMatrix()
                }
                dispatch(
                    standard(actionTypes.SAVE_CAMERA_HOTKEY, data)
                )
            } else {
                console.log('camera learn disabled: loading matrix')
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

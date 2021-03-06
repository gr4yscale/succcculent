import * as actionTypes from "../actions/actionTypes"

const initialState = {
    // camera
    cameraFov: 65,
    cameraRotationDeltaX: 0.1,
    cameraRotationDeltaY: 0.0,
    cameraDollyDelta: 1.0,
    cameraDollySensitivity: 1.0,
    cameraPositionDeltaX: 0.0,
    cameraPositionDeltaY: 0.0,
    joystickSensitivity: 1.0, //TODO rename
    // shaders
    shaderTickerSpeed: 1000,
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
                cameraDollyDelta: action.payload.val,
            }
        case actionTypes.DEBUG_VALUE_UPDATED:
            // TODO keep in sync with gui.js
            return {
                ...state,
                shaderTickerSpeed: action.payload.shaderTickerSpeed,
                cameraFov: action.payload.fov,
            }
        default:
            break
    }
    return state
}

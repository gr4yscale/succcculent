import * as actionTypes from './actionTypes'

export const standard = (type, payload) => ({type, payload})

// server API
export const requestLamps = () => ({type: actionTypes.REQUEST_LAMPS})
export const requestGroups = () => ({type: actionTypes.REQUEST_GROUPS})
export const requestFeaturesTypes = () => ({type: actionTypes.REQUEST_FEATURES_TYPES})
export const requestGeneratorTypes = () => ({type: actionTypes.REQUEST_GENERATOR_TYPES})
export const requestGeneratorsList = () => ({type: actionTypes.REQUEST_GENERATORS_LIST})
export const requestAddLampToGroup = () => ({type: actionTypes.ADD_LAMP_TO_GROUP_REQUEST})
export const updateLamp = (lampId, lampData) => ({type: actionTypes.UPDATE_LAMP, payload: {lampId, lampData}})

export const requestInitialData = () => standard(actionTypes.REQUEST_INITIAL_DATA)

export const requestGeneratorParameterUpdate = (generatorUUID, parameterShortName, value) => ({
  type: actionTypes.REQUEST_GENERATOR_PARAMETER_UPDATE,
  payload: {generatorUUID, parameterShortName, value}
})

export const requestGeneratorParams = (generatorUUID) => ({
  type: actionTypes.REQUEST_GENERATOR_PARAMS,
  payload: {generatorUUID}
})

// groups-lamps canvas shared actions
export const selectLamp = (lampId) => ({type: actionTypes.SELECT_LAMP, payload: {lampId}})


// patching
export const patchConnectLamp = (lampId) => ({type: actionTypes.PATCH_CONNECT_LAMP, payload: {lampId}})
export const patchConnectFinish = (lampId) => ({type: actionTypes.PATCH_CONNECT_FINISH})
export const updatePatchingMode = (mode) => ({type: actionTypes.PATCHING_MODE_UPDATE, payload: {mode}})


// content
export const contentGeneratorAttach = (generatorType, generatorUUID, isNewInstance, featureUUID, groupUUID) => ({
  type: actionTypes.CONTENT_GENERATOR_ATTACH,
  payload: {generatorType, generatorUUID, isNewInstance, featureUUID, groupUUID} // could have used the ...rest operator here, but lets be explicit about what parameters the action requires
})

export const contentGeneratorDetach = (generatorUUID) => ({
  type: actionTypes.CONTENT_GENERATOR_DETACH,
  payload: {generatorUUID}
})

export const requestSceneList = () => ({type: actionTypes.REQUEST_SCENE_LIST})

export const requestLoadScene = (sceneName) => ({
  type: actionTypes.REQUEST_LOAD_SCENE,
  payload: {sceneName}
})

export const requestSaveScene = (sceneName) => ({
  type: actionTypes.REQUEST_SAVE_SCENE,
  payload: {sceneName}
})

export const requestLivePreviewStart = () => ({type: actionTypes.CONTENT_LIVE_PREVIEW_START})
export const requestLivePreviewStop = () => ({type: actionTypes.CONTENT_LIVE_PREVIEW_STOP})

export const contentListItemGroupSelected = (group) => standard(actionTypes.CONTENT_LIST_ITEM_GROUP_SELECTED, group)
export const contentListItemGeneratorSelected = (generator) => standard(actionTypes.CONTENT_LIST_ITEM_GENERATOR_SELECTED, generator)
export const contentPaneSetVisibilityLeftOverlay = (visible) => standard(actionTypes.CONTENT_PANE_SET_VISIBILITY_LEFT_OVERLAY, visible)
export const contentPaneSetVisibilityGeneratorParams = (visible) => standard(actionTypes.CONTENT_PANE_SET_VISIBILITY_GENERATOR_PARAMS, visible)

//euroluce hack
export const contentDragging = () => standard(actionTypes.CONTENT_DRAGGING)
export const requestPresetPlayerPause = () => standard(actionTypes.REQUEST_PRESET_PLAYER_PAUSE)
export const requestPresetPlayerResume = () => standard(actionTypes.REQUEST_PRESET_PLAYER_RESUME)

export const contentFeatureSelected = (feature) => standard(actionTypes.CONTENT_FEATURE_SELECTED, feature)

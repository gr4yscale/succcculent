import * as actionTypes from '../actions/actionTypes'
import config from './../../config'
import throttle from 'lodash/throttle'

const uuidV1 = require('uuid/v1')

const serverCommandsToActionTypes = {           // map server command names to redux action types
  ReqLampList: actionTypes.UPDATE_ENTITY_LAMPS,
  ReqGroupList: actionTypes.UPDATE_ENTITY_GROUPS,
  ReqFeaturesTypes: actionTypes.UPDATE_ENTITY_FEATURES_TYPES,
  ReqGeneratorTypes: actionTypes.UPDATE_ENTITY_GENERATOR_TYPES,
  ReqGeneratorsList: actionTypes.UPDATE_ENTITY_GENERATORS,
  ReqSceneList: actionTypes.UPDATE_ENTITY_SCENES,
  ReqGeneratorParamUpdate: actionTypes.UPDATE_GENERATOR_PARAMS,
  ReqClientReadyForInitialData: actionTypes.UPDATE_INITIAL_DATA,
  EventSceneLoaded: actionTypes.UPDATE_LOAD_SCENE,
  EventPresetPlayerPaused: actionTypes.UPDATE_PRESET_PLAYER_PAUSED,
  EventPresetPlayerResumed: actionTypes.UPDATE_PRESET_PLAYER_RESUMED
}

let messageReceivedCallback                     // this is a total hack, it keeps a reference to the callback we need to fire after a socket message is received.
export const setMessageReceivedCallback = (cb) => {messageReceivedCallback = cb}


////////////////////////////////////////////////////////////////////////////////////////////////////
// Setup socket and its callbacks
// When messages come in, we dispatch a redux action to update the store with data from the message
////////////////////////////////////////////////////////////////////////////////////////////////////

const socket = new WebSocket('ws://localhost:9007')                                  //TODO make a config const for this

// socket.addEventListener('open', (event) => console.log(event))
// socket.addEventListener("error", (event) => console.log(event))

socket.addEventListener('message', (event) => {
  let data = JSON.parse(event.data)
  const type = serverCommandsToActionTypes[data.command]


  //TODO refactor
  if (!messageReceivedCallback) {
    console.log('ERROR: no callback for when server messages are received')
  }
  else if (data.command === 'LivePreview') {
    // live preview json
    messageReceivedCallback({type: actionTypes.UPDATE_LIVE_PREVIEW, payload: data})
  }
  else if (data.command === 'ReqGeneratorParamUpdate') {
    messageReceivedCallback({type: actionTypes.UPDATE_GENERATOR_PARAMS, payload: data})
  }
  else if (data.command === 'EventPresetPlayerStateChanged') {
    messageReceivedCallback({type: actionTypes.UPDATE_PRESET_PLAYER_STATE_CHANGED, payload: data})
  }
  else if (type) {
    // log for known response types
    if (config.logServerCalls) {
      console.log('Received response from server: ' + data.command)
      console.log(JSON.stringify(data, null, 4))
    }

    // TODO this looks like reducer behavior...
    const entityKeys = Object.keys(data).filter(key => !['command', 'msgUUID', 'timestamp', 'messages'].includes(key))

    let payload = {
      entityKeys,
      data
    }
    messageReceivedCallback({type, payload})
  }
  else if (config.logServerCalls) {
    console.error(`Received a socket message from the server, but this message isn't whitelisted, so no callback will be fired`)
    console.log(data.command)
  }
})

export const sendMessageToServer = (data) => {
  socket.send(JSON.stringify(data))
  if (config.logServerCalls) {
    console.log('Sending request to server: ' + data.command)
    console.log(JSON.stringify(data, null, 4))
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// API calls
// For now we can place requests for all models here, eventually this needs to get broken into smaller modules
////////////////////////////////////////////////////////////////////////////////////////////////////

const requestInitialDataFromServer = () => {
  const data = {
    clientName: 'ExternalClient',
    command: 'ReqClientReadyForInitialData',
    msgUUID: uuidV1()
  }
  sendMessageToServer(data)
  return {type: actionTypes.REQUEST_INITIAL_DATA}
}

const requestLampsFromServer = () => {
  const data = {
    clientName: 'ExternalClient',
    command: 'ReqLampList',
    msgUUID: uuidV1()
  }
  sendMessageToServer(data)
  return {type: actionTypes.REQUEST_LAMPS}
}

const requestGroupsFromServer = () => {
  const data = {
    clientName: 'ExternalClient',
    command: 'ReqGroupList',
    msgUUID: uuidV1()
  }
  sendMessageToServer(data)
  return {type: actionTypes.REQUEST_GROUPS}
}

const requestFeaturesTypesFromServer = () => {
  const data = {
    clientName: 'ExternalClient',
    command: 'ReqFeaturesTypes',
    msgUUID: uuidV1()
  }
  sendMessageToServer(data)
  return {type: actionTypes.REQUEST_FEATURES_TYPES}
}

const requestGeneratorTypesFromServer = () => {
  const data = {
    clientName: 'ExternalClient',
    command: 'ReqGeneratorTypes',
    msgUUID: uuidV1()
  }
  sendMessageToServer(data)
  return {type: actionTypes.REQUEST_GENERATOR_TYPES}
}

const requestGeneratorsListFromServer = () => {
  const data = {
    clientName: 'ExternalClient',
    command: 'ReqGeneratorsList',
    msgUUID: uuidV1()
  }
  sendMessageToServer(data)
  return {type: actionTypes.REQUEST_GENERATORS_LIST}
}

const requestAddLampToGroupFromServer = (lampIds) => {
  const lampList = []
  for (let i=0; i < lampIds.length; i++) {
    lampList.push({shortName: lampIds[i]})
  }

  const data = {
    clientName: 'ExternalClient',
    command: 'ReqAddLampToGroup',
    msgUUID: uuidV1(),
    groupToJoinUUID: uuidV1(),
    Lamps: lampList
  }
  sendMessageToServer(data)
  return {type: actionTypes.ADD_LAMP_TO_GROUP_REQUEST} // TODO do we really need to return the action definition here?
}

const requestUpdateLampFromServer = (lampId, lampData) => {
  const lamp = {
    shortName: lampId,
    posX: lampData.posX,
    posY: lampData.posY
  }

  const data = {
    clientName: 'ExternalClient',
    command: 'ReqLampUpdate',
    msgUUID: uuidV1(),
    groupToJoinUUID: uuidV1(),
    Lamps: [lamp],
  }
  sendMessageToServer(data)
  return {type: actionTypes.UPDATE_LAMP}
}

const requestGeneratorAttachFromServer = (payload) => {
  const {generatorType, isNewInstance, featureUUID, groupUUID} = payload
  let generatorUUID = isNewInstance ? uuidV1() : payload.generatorUUID

  const data = {
    clientName: 'ExternalClient',
    command: 'ReqAttachGeneratorToGroupFeature',
    msgUUID: uuidV1(),
    generatorType,
    generatorUUID,
    targetFeatureUUID: featureUUID,
    targetGroupUUID: groupUUID
  }
  sendMessageToServer(data)
  return {type: actionTypes.CONTENT_GENERATOR_ATTACH}
}

const requestGeneratorDetachFromServer = (payload) => {
  const data = {
    clientName: 'ExternalClient',
    command: 'ReqDetachGeneratorFromGroupFeature',
    msgUUID: uuidV1(),
    generatorUUID: payload.generatorUUID
  }
  sendMessageToServer(data)
  return {type: actionTypes.CONTENT_GENERATOR_DETACH}
}

const requestGeneratorParameterUpdateFromServer = (payload) => {
  const data = {
    clientName: 'ExternalClient',
    command: 'ReqGeneratorParamUpdate',
    msgUUID: uuidV1(),
    generatorUUID: payload.generatorUUID,
    shortName : payload.parameterShortName,
    value : payload.value
  }
  sendMessageToServer(data)
  return {type: actionTypes.REQUEST_GENERATOR_PARAMETER_UPDATE}
}

const requestGeneratorParamsFromServer = (payload) => {
  const data = {
    clientName: 'ExternalClient',
    command: 'ReqGeneratorParams',
    msgUUID: uuidV1(),
    shortName: payload.generatorUUID
  }
  sendMessageToServer(data)
  return {type: actionTypes.REQUEST_GENERATOR_PARAMS}
}

const requestSceneListFromServer = () => {
  const data = {
    clientName: 'ExternalClient',
    command: 'ReqSceneList',
    msgUUID: uuidV1()
  }
  sendMessageToServer(data)
  return {type: actionTypes.REQUEST_SCENE_LIST}
}

const requestLoadSceneFromServer = (payload) => {
  const data = {
    clientName: 'ExternalClient',
    command: 'ReqLoadScene',
    msgUUID: uuidV1(),
    sceneName: payload.sceneName
  }
  sendMessageToServer(data)
  return {type: actionTypes.REQUEST_LOAD_SCENE}
}

const requestSaveSceneFromServer = (payload) => {
  const data = {
    clientName: 'ExternalClient',
    command: 'ReqSaveScene',
    msgUUID: uuidV1(),
    sceneName: payload.sceneName
  }
  sendMessageToServer(data)
  return {type: actionTypes.REQUEST_SAVE_SCENE}
}

const requestLivePreviewStartFromServer = () => {
  const data = {
    clientName: 'ExternalClient',
    command: 'ReqLivePreviewStart',
    msgUUID: uuidV1()
  }
  sendMessageToServer(data)
  return {type: actionTypes.CONTENT_LIVE_PREVIEW_START}
}

const requestLivePreviewStopFromServer = () => {
  const data = {
    clientName: 'ExternalClient',
    command: 'ReqLivePreviewStop',
    msgUUID: uuidV1()
  }
  sendMessageToServer(data)
  return {type: actionTypes.CONTENT_LIVE_PREVIEW_STOP}
}

const requestPresetPlayerPauseFromServer = (seconds) => {
  let data = {
    clientName: 'ExternalClient',
    command: 'ReqPausePresetPlayer',
    msgUUID: uuidV1()
  }
  if (seconds) {
    data['secondsToPause'] = seconds
  }
  sendMessageToServer(data)
  return {type: actionTypes.REQUEST_PRESET_PLAYER_PAUSE}
}

//TODO euroluce hack
const requestPresetPlayerHoldTimeRestartForUserInteraction = throttle(() => {
  requestPresetPlayerPauseFromServer(60)
}, 500)

const requestPresetPlayerResumeFromServer = () => {
  const data = {
    clientName: 'ExternalClient',
    command: 'ReqResumePresetPlayer',
    msgUUID: uuidV1()
  }
  sendMessageToServer(data)
  return {type: actionTypes.REQUEST_PRESET_PLAYER_RESUME}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Redux middleware
// Pass all actions to the next middleware. This middleware just produces side effects in the
// Form of sending socket messages to request data from the server, based on what actions are being dispatched
// If an action is dispatched that doesn't concern requesting data from the server, we ignore it
////////////////////////////////////////////////////////////////////////////////////////////////////

// TODO figure out how to hook this up declaratively to prevent tedium:

const serverAPI = store => next => action => {
  next(action)

  switch (action.type) {
    case actionTypes.REQUEST_INITIAL_DATA: {
      requestInitialDataFromServer()
      break
    }
    case actionTypes.REQUEST_LAMPS: {
      requestLampsFromServer()
      requestLivePreviewStartFromServer()
      break
    }
    case actionTypes.REQUEST_GROUPS: {
      requestGroupsFromServer()
      break
    }
    case actionTypes.REQUEST_FEATURES_TYPES: {
      requestFeaturesTypesFromServer()
      break
    }
    case actionTypes.REQUEST_GENERATOR_TYPES: {
      requestGeneratorTypesFromServer()
      break
    }
    case actionTypes.REQUEST_GENERATORS_LIST: {
      requestGeneratorsListFromServer()
      break
    }
    case actionTypes.ADD_LAMP_TO_GROUP_REQUEST: {
      const lamps = store.getState().patching.lampsConnected
      requestAddLampToGroupFromServer(lamps)
      break
    }
    case actionTypes.UPDATE_LAMP: {
      let {lampId, lampData} = action.payload
      requestUpdateLampFromServer(lampId, lampData)
      break
    }
    case actionTypes.CONTENT_GENERATOR_ATTACH: {
      requestGeneratorAttachFromServer(action.payload)
      //TODO euroluce hacks
      requestPresetPlayerHoldTimeRestartForUserInteraction()
      // hide gen params visibility when a gen is attached
      next({type:actionTypes.CONTENT_PANE_SET_VISIBILITY_GENERATOR_PARAMS, payload: false})
      //TODO hack to sync groups and generators lists after the generator is attached
      // we should kick these actions off in response to the server messages in the socket callback
      setTimeout(() => {
        requestGeneratorsListFromServer()
        requestGroupsFromServer()
      }, 500)
      break
    }
    case actionTypes.CONTENT_GENERATOR_DETACH: {
      requestGeneratorDetachFromServer(action.payload)
      //TODO euroluce hack
      requestPresetPlayerHoldTimeRestartForUserInteraction()
      // hide gen params visibility when a gen is attached
      next({type:actionTypes.CONTENT_PANE_SET_VISIBILITY_GENERATOR_PARAMS, payload: false})
      //TODO hack to sync groups and generators lists after the generator is attached
      // we should kick these actions off in response to the server messages in the socket callback
      setTimeout(() => {
        requestGeneratorsListFromServer()
        requestGroupsFromServer()
      }, 500)
      break
    }
    case actionTypes.REQUEST_GENERATOR_PARAMETER_UPDATE: {
      requestGeneratorParameterUpdateFromServer(action.payload)
      //TODO euroluce hack
      requestPresetPlayerHoldTimeRestartForUserInteraction()
      break
    }
    case actionTypes.REQUEST_GENERATOR_PARAMS: {
      requestGeneratorParamsFromServer(action.payload)
      requestPresetPlayerHoldTimeRestartForUserInteraction()
      break
    }
    case actionTypes.REQUEST_SCENE_LIST: {
      requestSceneListFromServer()
      break
    }
    case actionTypes.REQUEST_LOAD_SCENE: {
      requestLoadSceneFromServer(action.payload)
      requestPresetPlayerHoldTimeRestartForUserInteraction()
      break
    }
    case actionTypes.REQUEST_SAVE_SCENE: {
      requestSaveSceneFromServer(action.payload)
      break
    }
    case actionTypes.CONTENT_LIVE_PREVIEW_START: {
      requestLivePreviewStartFromServer()
      break
    }
    case actionTypes.CONTENT_LIVE_PREVIEW_STOP: {
      requestLivePreviewStopFromServer()
      break
    }
    case actionTypes.REQUEST_PRESET_PLAYER_PAUSE: {
      requestPresetPlayerPauseFromServer()
      break
    }
    case actionTypes.REQUEST_PRESET_PLAYER_RESUME: {
      requestPresetPlayerResumeFromServer()
      break
    }
    //TODO euroluce hack... request that the presetPlayer doesnt start if a user recently interacts with the application
    case actionTypes.CONTENT_LIST_ITEM_GROUP_SELECTED:
    case actionTypes.CONTENT_LIST_ITEM_GENERATOR_SELECTED:
    case actionTypes.CONTENT_PANE_SET_VISIBILITY_LEFT_OVERLAY:
    case actionTypes.CONTENT_PANE_SET_VISIBILITY_GENERATOR_PARAMS:
    case actionTypes.CONTENT_DRAGGING: {
      requestPresetPlayerHoldTimeRestartForUserInteraction()
      break
    }
    case actionTypes.UPDATE_LOAD_SCENE: {
      //TODO euroluce hack...hide generator params panel when preset player for demo mode loads a scene
      next({type:actionTypes.CONTENT_PANE_SET_VISIBILITY_GENERATOR_PARAMS, payload: false})
      break
    }
    default:
        break
  }
}

export default serverAPI

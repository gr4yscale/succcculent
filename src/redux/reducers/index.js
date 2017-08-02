import {routerReducer as routing} from 'react-router-redux'
import {combineReducers} from 'redux'
import * as actionTypes from '../actions/actionTypes'

// entities

const lamps = (state, action) => {
  if (action.type === actionTypes.UPDATE_LIVE_PREVIEW) {
    return state.map(lamp => {
      const preview = action.payload.Data.find(obj => obj.shortName === lamp.shortName)
      return {...lamp, ...preview}
    })
  }
}

const generators = (state, action) => {
  if (action.type === actionTypes.UPDATE_GENERATOR_PARAMS) {
    let generator = state.find(gen => gen.shortName === action.payload.generatorUUID)

    if (!generator) {
      return state
    } else {
      generator.Params = action.payload.Params
      const index = state.indexOf(generator)
      // replace the generator, update state without mutatation (copy a new generator in)
      return [
        ...state.slice(0, index),
        generator,
        ...state.slice(index + 1)
      ]
    }
  }
}

const entitiesInitialState = {Lamps: [], Groups: [], Generators: [], FeaturesTypse: [], GeneratorTypes: [], LampTypes: [], Scenes: []}

const entities = (state = entitiesInitialState, action) => {
  // TODO being lazy here instead of using actionTypes as a filter, i check to see if we have an entityKeys key implying we are working with entity data
  if (action.payload && action.payload.entityKeys) {
    let entitiesUpdated = {}
    for (let i = 0; i < action.payload.entityKeys.length; i++) {
      const entityKey = action.payload.entityKeys[i]
      let entity = {}
      entity[entityKey] = action.payload.data[entityKey]

      entitiesUpdated = {
        ...entitiesUpdated,
        ...entity
      }
    }
    return {
      ...state,
      ...entitiesUpdated
    }
  }
  // handle it the right way from here on
  else {
    switch (action.type) {
      case actionTypes.UPDATE_LIVE_PREVIEW:
        return {
          ...state,
          Lamps: lamps(state.Lamps, action)
        }
      case actionTypes.UPDATE_GENERATOR_PARAMS:
        return {
          ...state,
          Generators: generators(state.Generators, action)
        }
      default:
        return state
    }
  }
}


const patchingInitialState = {
  mode: actionTypes.PATCHING_MODE_CONNECT,
  isPatching: false,
  lampsConnected: [],
  lastMouseX: 0,
  lastMouseY: 0,
  lastLampX: 0,
  lastLampY: 0,
  lastSelectedLampId: null,
  groupPopupVisible: false
}

// patching
const patching = (state = patchingInitialState, action) => {

  switch (action.type) {
    case actionTypes.PATCHING_MODE_UPDATE: {

      let groupPopupVisible = state.groupPopupVisible
      if (action.payload.mode === actionTypes.PATCHING_MODE_MOVE) {
        groupPopupVisible = false
      }

      return {
        ...state,
        mode: action.payload.mode,
        groupPopupVisible
      }
    }

    case actionTypes.PATCHING_CONNECT_SELECT: {
      if (!state.isPatching) return state

      const lampId = action.payload
      const lampAlreadyConnected = state.lampsConnected.includes(lampId)

      if (state.mode === actionTypes.PATCHING_MODE_CONNECT && !lampAlreadyConnected) {
        return {
          ...state,
          lampsConnected: [...state.lampsConnected, lampId],
          lastSelectedLampId: lampId
        }
      }
      else {
        return {...state, lastSelectedLampId: lampId}
      }
    }

    case actionTypes.SELECT_LAMP: {
      const lampId = action.payload.lampId
      return {...state, lastSelectedLampId: lampId}
    }

    case actionTypes.PATCHING_CONNECT_START: {
      const lampId = action.payload
      return {
        ...state,
        isPatching: true,
        lampsConnected: [lampId],
        lastSelectedLampId: lampId,
        groupPopupVisible: false
      }
    }

    case actionTypes.PATCHING_CONNECT_END: {
      return {
        ...state,
        isPatching: false,
        groupPopupVisible: state.lampsConnected.length > 1 ? true : false
      }
    }

    case actionTypes.PATCHING_CONNECT_END_AND_CLEAR: {
      return {
        ...state,
        isPatching: false,
        lampsConnected: [],
        groupPopupVisible: false
      }
    }

    case actionTypes.PATCHING_MOUSE_UPDATE: {
      return {...state,
        lastMouseX: action.payload.x,
        lastMouseY: action.payload.y
      }
    }

    // todo evaluate server interactions
    case actionTypes.ADD_LAMP_TO_GROUP_REQUEST: {
      return {
        ...state,
        groupPopupVisible: false,
        lampsConnected: []
      }
    }
    default:
      return state
  }
}


const contentInitialState = {selectedGroup: null, selectedGenerator: null, paneVisibilityLeftOverlay: false, paneVisibilityGeneratorParams: false, presetPlayerPaused: true}

const content = (state = contentInitialState, action) => {
  switch (action.type) {
    case actionTypes.CONTENT_LIST_ITEM_GROUP_SELECTED: {
      return {...state, selectedGroup: action.payload}
    }
    case actionTypes.CONTENT_LIST_ITEM_GENERATOR_SELECTED: {
      return {...state, selectedGenerator: action.payload}
    }
    case actionTypes.CONTENT_PANE_SET_VISIBILITY_LEFT_OVERLAY: {
      return {...state, paneVisibilityLeftOverlay: action.payload}
    }
    case actionTypes.CONTENT_PANE_SET_VISIBILITY_GENERATOR_PARAMS: {
      return {...state, paneVisibilityGeneratorParams: action.payload}
    }
    case actionTypes.UPDATE_PRESET_PLAYER_STATE_CHANGED: {
      return {...state, presetPlayerPaused: action.payload.isPlayerPaused}
    }
    case actionTypes.UPDATE_INITIAL_DATA: {
      return {...state, presetPlayerPaused: action.payload.data.PresetPlayer.isPaused}
    }
    case actionTypes.CONTENT_FEATURE_SELECTED: {
      return {...state, selectedFeature: action.payload}
    }
    default:
      return state
  }
}


const rootReducer = combineReducers({
  entities, // updates an entity cache in response to any action with response.entities.
  routing,   // updates this store with latest browser history state synced from react-router on route changes
  patching,
  content
})

export default rootReducer

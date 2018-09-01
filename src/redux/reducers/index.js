import {combineReducers} from 'redux'
import appReducer from './appReducer'
import sceneReducer from './sceneReducer'
import gardenGenerationReducer from './gardenGenerationReducer'
// import hotkeysReducer from './hotkeysReducer'

const rootReducer = combineReducers({
    app: appReducer,
    scene: sceneReducer,
    gardenGeneration: gardenGenerationReducer,
    // hotkeys: hotkeysReducer
})

export default rootReducer

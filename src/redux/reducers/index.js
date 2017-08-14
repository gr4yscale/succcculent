import {combineReducers} from 'redux'
import gardenReducer from './gardenReducer'
import appReducer from './appReducer'

const rootReducer = combineReducers({
  app: appReducer,
  garden: gardenReducer
})

export default rootReducer

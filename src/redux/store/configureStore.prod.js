import {createStore, applyMiddleware} from 'redux'
import rootReducer from '../reducers'
import middleware from '../middlewares/middleware.js'

const configureStore = () => {
  const store = createStore(
    rootReducer,
    applyMiddleware(middleware),
  )

  //TODO a hack to ensure the serverAPI has a reference to our store for its incoming socket messages callback. it's a hack, I dont like this...
  setMessageReceivedCallback(action => store.dispatch(action))

  return store
}

export default configureStore

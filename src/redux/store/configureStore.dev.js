import {createStore, applyMiddleware} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import serverAPI, {setMessageReceivedCallback} from '../middlewares/serverAPI'
import rootReducer from '../reducers'
import * as actionTypes from '../actions/actionTypes'

const middleware = [serverAPI]

// TODO: preloaded state can be injected into the store by passing it as a 2nd argument to createStore
// compose just lets us write deeply nested function transformations without the rightward drift of the code, helps write nicer code as the application increases in complexity

const configureStore = () => {
  // to get the redux devtools chrome extensio
  const composeEnhancers = composeWithDevTools({
    actionsBlacklist: [actionTypes.UPDATE_LIVE_PREVIEW, actionTypes.PATCHING_MOUSE_UPDATE],
    maxAge: 1000
  })

  const store = createStore(
    rootReducer,
    composeEnhancers(
      applyMiddleware(...middleware)
    )
  )

  //TODO a hack to ensure the serverAPI has a reference to our store for its incoming socket messages callback. it's a hack, I dont like this...
  setMessageReceivedCallback(action => store.dispatch(action))

  // webpack hot module replacement for reducers
  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

export default configureStore

import {createStore, applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import rootReducer from '../reducers'
import middleware from '../middlewares/middleware.js'

// TODO: preloaded state can be injected into the store by passing it as a 2nd argument to createStore

export default garden => {
  // get the redux devtools chrome extension
  // compose just lets us write deeply nested function transformations without the rightward drift of the code, helps write nicer code as the application increases in complexity
    const composeEnhancers = composeWithDevTools({
        maxAge: 1000,
        actionsBlacklist: ['GARDEN_UPDATE_PLANT_POSITION']
    })

  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(middleware(garden)))
  )

  // webpack hot module replacement for reducers
  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

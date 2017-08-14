import {createStore} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import rootReducer from '../reducers'

// TODO: preloaded state can be injected into the store by passing it as a 2nd argument to createStore

export default () => {
  // get the redux devtools chrome extension
  // compose just lets us write deeply nested function transformations without the rightward drift of the code, helps write nicer code as the application increases in complexity
  const composeEnhancers = composeWithDevTools({
    maxAge: 1000
  })

  const store = createStore(
    rootReducer,
    composeEnhancers()
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

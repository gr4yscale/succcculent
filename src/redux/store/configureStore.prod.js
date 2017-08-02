import {createStore, applyMiddleware} from 'redux'
import serverAPI, {setMessageReceivedCallback} from '../middlewares/serverAPI'
import rootReducer from '../reducers'

const middleware = [serverAPI]

const configureStore = () => {
  const store = createStore(
    rootReducer,
    applyMiddleware(...middleware),
  )

  //TODO a hack to ensure the serverAPI has a reference to our store for its incoming socket messages callback. it's a hack, I dont like this...
  setMessageReceivedCallback(action => store.dispatch(action))

  return store
}

export default configureStore

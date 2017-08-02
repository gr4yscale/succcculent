import React from 'react'
import {render} from 'react-dom'
import {browserHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import configureStore from './store/configureStore'
import {requestInitialData} from './actions'
import Root from './componentsReactive/Root'

const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)

//TODO hack to wait for socket to connect
setTimeout(() => {
  // store.dispatch({type: 'REQUEST_INITIAL_DATA'})
  store.dispatch(requestInitialData())
}, 400)

render(
  <Root store={store} history={history} />,
  document.getElementById('root')
)

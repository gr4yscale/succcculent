const THREE = window.THREE //todo assumes THREE script already loaded, yucky

import React from 'react'
import {render} from 'react-dom'
import Root from './components/Root'
import configureStore from './redux/store/configureStore'
import Succulent from './succulent'
import Garden from './garden'

import {standard} from './redux/actions/index'
import * as actionTypes from './redux/actions/actionTypes'

const store = configureStore()
const garden = new Garden(THREE, Succulent(THREE), store)

setTimeout(() => garden.setup(), 0.25)
setTimeout(() => garden.resize(), 1)
setTimeout(() => garden.resize(), 1)

setTimeout(() => {
    store.dispatch(
        standard(actionTypes.GARDEN_GENERATE_PLANT_PARAMS)
    )
}, 1)

render(
  <Root store={store} />,
  document.getElementById('ReactRoot')
)

window.addEventListener('resize', garden.resize, false)

// import {browserHistory} from 'react-router'
// import {syncHistoryWithStore} from 'react-router-redux'
// import {requestInitialData} from './redux/actions' //TOFIX: trigger initial garden generation, perhaps


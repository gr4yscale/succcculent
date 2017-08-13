import React, { PropTypes } from 'react'
import { Provider } from 'react-redux'
import routes from './routes'
import { Router } from 'react-router'

const Root = ({ store }) => (
  <Provider store={store}>
    <Router routes={routes} />
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}
export default Root

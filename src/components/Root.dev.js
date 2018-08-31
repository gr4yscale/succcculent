import React, {PropTypes} from 'react'
import {Provider} from 'react-redux'
import AppGUI from "./GUI"

const Root = ({ store }) => (
  <Provider store={store}>
      <AppGUI/>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired,
}

export default Root

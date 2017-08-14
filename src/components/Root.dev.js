import React, {PropTypes} from 'react'
import {Provider} from 'react-redux'
import GUI from "./GUI"

const Root = ({ store }) => (
  <Provider store={store}>
      <GUI/>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired,
}

export default Root

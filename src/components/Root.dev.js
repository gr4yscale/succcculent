import React, {PropTypes} from 'react'
import {Provider} from 'react-redux'
import ContainerTst from "./ContainerTst"

const Root = ({ store }) => (
  <Provider store={store}>
    <div>
      <ContainerTst/>
    </div>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired,
}

export default Root

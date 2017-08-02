import React from 'react'
import {Route, IndexRedirect} from 'react-router'
import App from './App'
import ContainerTst from './ContainerTst'

export default <Route path="/" component={App}>
                  <IndexRedirect to="/tst" />
                  <Route path="/tst" component={ContainerTst} />
               </Route>

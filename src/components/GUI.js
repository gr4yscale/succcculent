import React, { Component } from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {standard} from '../redux/actions/index'
import * as actionTypes from '../redux/actions/actionTypes'

const Container = styled.div`
  position: absolute;
  right:0px;
  bottom:0px;
  width: 400px;
  height: 50px;
  background-color: #00ff00;
`

class GUI extends Component {
  render() {
    return (
      <Container>
        <p
          onClick={() =>
            this.props.dispatch(
              standard(actionTypes.GARDEN_GENERATE_PLANT_PARAMS)
            )
          }
        >
          Give me a garden!
        </p>
      </Container>
    )
  }
}

export default connect()(GUI)


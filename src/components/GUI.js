import React, { Component } from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {standard} from '../redux/actions/index'
import * as actionTypes from '../redux/actions/actionTypes'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

const Container = styled.div`
  display: flex;
  position: absolute;
  right:0px;
  bottom:0px;
  width: 500px;
  background-color: transparent;
  color: #ffffff;
`
const ButtonGenGarden = styled.div`
  flex: 0.2;
  // display: flex;
  display: none;
`

const SliderContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 10px;
  margin-bottom: 8px;
`

const SliderText = styled.p`
  padding: 0px;
  margin: 0px;
  margin-top: 6px;
`

class GUI extends Component {
  render() {
    return (
      <Container>
        <ButtonGenGarden
          onClick={() =>
            this.props.dispatch(
              standard(actionTypes.GARDEN_GENERATE_PLANT_PARAMS)
            )
          }
        >
          Give me a garden!
        </ButtonGenGarden>

        <SliderContainer>
          <SliderText>Rotation X</SliderText>
          <Slider
            min={-1.0}
            max={1.0}
            step={0.005}
            onChange={(val) => {
              this.props.dispatch(
                standard(actionTypes.CAMERA_UPDATE_ROTATION_DELTA, {x: val})
              )
            }}
          />

          <SliderText>Rotation Y</SliderText>
          <Slider
            min={-1.0}
            max={1.0}
            step={0.005}
            onChange={(val) => {
              this.props.dispatch(
                standard(actionTypes.CAMERA_UPDATE_ROTATION_DELTA, {y: val})
              )
            }}
          />

          <SliderText>Dolly</SliderText>
          <Slider
            min={0.986}
            max={1.0099}
            step={0.00001}
            onChange={(val) => {
              this.props.dispatch(
                standard(actionTypes.CAMERA_UPDATE_DOLLY_DELTA, {val})
              )
            }}
          />
        </SliderContainer>

      </Container>
    )
  }
}

export default connect()(GUI)


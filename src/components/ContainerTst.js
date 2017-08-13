import React, { Component } from 'react'
import styled from 'styled-components'

const Tst = styled.div`
  position: absolute;
  left:100px;
  top:100px;
  width: 100px;
  height: 50px;
  background-color: #00ff00;
`

export default class ContainerTst extends Component {
  render() {
    return (<Tst><p>hiii from react</p></Tst>)
  }
}


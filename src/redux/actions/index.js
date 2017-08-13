import * as actionTypes from './actionTypes'

export const standard = (type, payload) => ({type, payload})

export const requestLamps = () => ({type: actionTypes.REQUEST_LAMPS})
export const updateLamp = (lampId, lampData) => ({type: actionTypes.UPDATE_LAMP, payload: {lampId, lampData}})
export const requestGeneratorParameterUpdate = (generatorUUID, parameterShortName, value) => ({
  type: actionTypes.REQUEST_GENERATOR_PARAMETER_UPDATE,
  payload: {generatorUUID, parameterShortName, value}
})

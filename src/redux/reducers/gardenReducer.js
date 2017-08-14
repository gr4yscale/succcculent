import * as actionTypes from '../actions/actionTypes'
import {getRandomArbitrary} from "../../util"
import styles from '../../styles'

const initialState = {
  selectedStyleIndex: 0, //todo unnecessary?
  selectedPresetIndex: 0,
  numPlantsForNextGeneration: 20,
  selectedStyle: styles[11],

  adHocGardenGenerationEnabled: false,
  adHocPlantParamsPetalCount: 36,
  adHocPlantParamsCurveAmountB: 0.13275223848488998,
  adHocPlantParamsCurveAmountC: 0.20827196143002302,
  adHocPlantParamsCurveAmountD: 0.36005163068644075,
  adHocPlantParamsLayers: 6,
  adHocPlantParamsPetalLength: 0.43796780893085985,
  adHocPlantParamsPetalWidth: 0.5438646263177942,

  // modes:
  gardenPresetModeEnabled: false,
  gardenPresetSaveNext: false,

  // texture mode options
  generateNewPlantsWithTextures: false,
  textureRepeatRange: 1,
  textureUpdateSpeed: 0.5,

  garden: null,
  sceneNeedsToReset: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GARDEN_GENERATE_PLANT_PARAMS:
      return {
        ...state,
        plantParams: generatePlantParams(state),
        sceneNeedsToReset: true
      }
      break
    case actionTypes.GARDEN_SCENE_IS_RESETTING:
      return {
        ...state,
        sceneNeedsToReset: false
      }
      break
    case actionTypes.GARDEN_UPDATE_PLANT_POSITION: {
      const plantParams = state.plantParams.map((item, index) => {
        if (index !== action.payload.plantIndex) {
          return item
        }
        return {
          ...item,
          positionX: action.payload.position.x,
          positionY: action.payload.position.y,
          positionZ: action.payload.position.z
        }
      })
      return {plantParams,...state}
    }
      break

    default:
      break
  }
  return state
}

const generatePlantParams = (state) => {
  let plantParams = []

  for (let i = 0; i < state.numPlantsForNextGeneration; i++) {
    let petalCount
    let curveAmountB
    let curveAmountC
    let curveAmountD
    let layers
    let petalLength
    let petalWidth

    if (state.adHocGardenGenerationEnabled) {
      petalCount = Math.floor(state.adHocPlantParamsPetalCount)
      petalLength = state.adHocPlantParamsPetalLength
      petalWidth = state.adHocPlantParamsPetalWidth
      curveAmountB = state.adHocPlantParamsCurveAmountB
      curveAmountC = state.adHocPlantParamsCurveAmountC
      curveAmountD = state.adHocPlantParamsCurveAmountD
      layers = Math.floor(state.adHocPlantParamsLayers)
    }
    else {
      let s = state.selectedStyle
      petalCount = Math.floor(getRandomArbitrary(s.petalCountMin, s.petalCountMax))
      petalLength = getRandomArbitrary(s.petalLengthMin, s.petalLengthMax)
      petalWidth = getRandomArbitrary(s.petalWidthMin, s.petalWidthMax)
      curveAmountB = getRandomArbitrary(s.curveAmountBMin, s.curveAmountBMax) // multiplier for log curvature
      curveAmountC = getRandomArbitrary(s.curveAmountCMin, s.curveAmountCMax) // initial curve amount
      curveAmountD = getRandomArbitrary(s.curveAmountDMin, s.curveAmountDMax)
      layers = Math.floor(getRandomArbitrary(s.layersMin, s.layersMax))
    }

    let textureFilename = ''
    let shaderIndex = -999

    if (state.selectedStyle.shaderIndexes) {
      let shaderStyleSelectionIndex = Math.floor(getRandomArbitrary(0, state.selectedStyle.shaderIndexes.length))
      shaderIndex = state.selectedStyle.shaderIndexes[shaderStyleSelectionIndex]
    } else {
      let textureStyleSelectionIndex = Math.floor(getRandomArbitrary(0, state.selectedStyle.textureNames.length))
      textureFilename = state.selectedStyle.textureNames[textureStyleSelectionIndex]
    }

    let params = {
      petalCount: petalCount,
      curveAmountB: curveAmountB,
      curveAmountC: curveAmountC,
      curveAmountD: curveAmountD,
      layers: layers,
      petalLength: petalLength,
      petalWidth: petalWidth,
      positionX: 'not_placed',
      positionY: 'not_placed',
      positionZ: 'not_placed',
    }

    if (state.generateNewPlantsWithTextures || textureFilename !== '') {
      params = Object.assign({}, params, {textureFileName: 'images/' + textureFilename}) // TOFIX: maybe making a copy isn't great from a perf standpoint...
    } else {
      params = Object.assign({}, params, {shaderIndex: shaderIndex})
    }
    plantParams.push(params)
  }

  return plantParams
}

let fileReader = new FileReader()

var Presets = function() {
  this.selectedStyleIndex = 1
  this.styles = require('./styles')
  this.data = []
  this.selectedPresetIndex = 0
  this.lastGeneratedPresetData = {}
  this.generateNewPlantsWithTextures = false
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function saveData(data, fileName) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    var json = JSON.stringify(data),
        blob = new Blob([json], {type: "octet/stream"}),
        url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
}

// TOFIX: load up the proper shader materials when we switch between presets
Presets.prototype.load = function(callback) {
  // hacky, assumes there's a dom element with id of filepicker. good thing that there is! ;p
  let selectedFile = document.getElementById('filepicker').files[0]
  console.log('Loading presets file: ' + selectedFile)
  let self = this // TOFIX: fucking ES5!

  fileReader.onload = function(e) {
    let data = JSON.parse(fileReader.result)
    let plantParams = data[0].plantParams;
    self.data = data
    // self.cameraMap = data[0].cameraMap
    callback(plantParams)
  }
  fileReader.readAsText(selectedFile)
}

// TOFIX: load up a specfic preset from a selectedPresetIndex
Presets.prototype.generatePlantParams = function(numberOfPlants, numberOfShaders, state) {

  let plantParams = []
  for (var i = 0; i < numberOfPlants; i++) {
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
    } else {
      let s = this.selectedStyle()
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

    if (this.selectedStyle().shaderIndexes) {
      let shaderStyleSelectionIndex = Math.floor(getRandomArbitrary(0, this.selectedStyle().shaderIndexes.length))
      shaderIndex = this.selectedStyle().shaderIndexes[shaderStyleSelectionIndex]
    } else {
      let textureStyleSelectionIndex = Math.floor(getRandomArbitrary(0, this.selectedStyle().textureNames.length))
      textureFilename = this.selectedStyle().textureNames[textureStyleSelectionIndex]
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

    if (this.generateNewPlantsWithTextures || textureFilename != '') {
      params = Object.assign({}, params, {textureFileName: 'images/' + textureFilename}) // TOFIX: maybe making a copy isn't great from a perf standpoint...
    } else {
      params = Object.assign({}, params, {shaderIndex: shaderIndex})
    }
    plantParams.push(params)
  }
  let preset = {
    plantParams: plantParams,
    cameraMap: {}
  }

  this.lastGeneratedPresetData = preset
  return preset
}

Presets.prototype.selectedPresetCameraMap = function() {
  let presetData = this.data[this.selectedPresetIndex]
  if (presetData) return presetData.cameraMap
}

Presets.prototype.plantParams = function(index) {
  if (!this.data[this.selectedPresetIndex]) {
    console.log('Error! Tried to get plant params, but they didnt exist for the selected preset index! ****')
    return
  } else {
    return this.data[this.selectedPresetIndex].plantParams[index]
  }
}

Presets.prototype.save = function(fileName) {
  saveData(this.data, fileName)
}

Presets.prototype.updateCameraMap = function(key, camera, data) {
  if (!this.data[this.selectedPresetIndex]) {
    console.log('Error! Tried to update camera map, but there was no data available for selected preset index! ****')
    return
  } else {
    let cameraMap = this.data[this.selectedPresetIndex].cameraMap
    cameraMap[key] = Object.assign({}, cameraMap[key], data)
  }
}

Presets.prototype.addNew = function() {
  this.data.push({'foo':'bar'})
  this.data[this.data.length - 1] = this.generatePlantParams()
}

Presets.prototype.saveLastGeneratedPresetForSelectedIndex = function() {
  this.data[this.selectedPresetIndex] = this.lastGeneratedPresetData
}

Presets.prototype.select = function(index) {
  this.selectedPresetIndex = index
}

Presets.prototype.selectedPresetData = function() {
  return this.data[this.selectedPresetIndex]
}

Presets.prototype.selectedStyle = function() {
  return this.styles[this.selectedStyleIndex]
}

module.exports = Presets

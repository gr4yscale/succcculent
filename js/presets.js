let fileReader = new FileReader()

// let selectedGeometryStyleForNewlyGeneratedPlants = {
//   petalCount: {min: 20, max: 40},
//   curveAmountB: {min: 0.08, 0.20},
//   curveAmountC: {min: 0.2, 0.6},
//   curveAmountD: {min: 0.08, 0.20},
//   layers: {min: 8, 10},
//   petalLength: {min: 0.1, max: 0.7},
//   petalWidth: {min: 0.4, max: 0.6}
// }

var Presets = function() {
  this.styles = require('./styles')
  this.data = []
  this.selectedPresetIndex = 0
  this.selectedStyleIndex = 0
  this.lastGeneratedPlantParams = {}
  this.selectedTextureStyleForNewlyGeneratedPlants = {
    shaderIndexes: [1, 2, 4],
    textureNames: ['c0d807dd3bd03e907959e64f60527504.jpg']
  }
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
Presets.prototype.generatePlantParams = function(numberOfPlants, numberOfShaders) {
  let plantParams = []
  for (var i = 0; i < numberOfPlants; i++) {
    let petalCount = Math.floor(getRandomArbitrary(20, 40))
    let curveAmountB = getRandomArbitrary(0.08, 0.20) // multiplier for log curvature
    let curveAmountC = getRandomArbitrary(0.2, 0.6) // initial curve amount
    let curveAmountD = getRandomArbitrary(0.2, 0.5)
    let layers = Math.floor(getRandomArbitrary(8, 10))
    let petalLength = getRandomArbitrary(0.1, 0.7)
    let petalWidth = getRandomArbitrary(0.4, 0.6)

    let shaderStyleSelectionIndex = Math.floor(getRandomArbitrary(0, this.selectedStyle().shaderIndexes.length))
    let shaderIndex = this.selectedStyle().shaderIndexes[shaderStyleSelectionIndex]

    let textureFilename = 'images/' + this.selectedTextureStyleForNewlyGeneratedPlants.textureNames[0]

    let params = {
      petalCount: petalCount,
      curveAmountB: curveAmountB,
      curveAmountC: curveAmountC,
      curveAmountD: curveAmountD,
      layers: layers,
      petalLength: petalLength,
      petalWidth: petalWidth,
      shaderIndex: shaderIndex,
      positionX: 'not_placed',
      positionY: 'not_placed',
      positionZ: 'not_placed',
    }

    if (this.generateNewPlantsWithTextures) {
      params = Object.assign({}, params, {textureFileName: textureFilename}) // TOFIX: maybe making a copy isn't great from a perf standpoint...
    }
    plantParams.push(params)
  }
  let r = {
    plantParams: plantParams,
    cameraMap: {}
  }
  this.data[this.selectedPresetIndex] = r
  console.log(r)
  return {
    plantParams: r
    // TOFIX: add camera stuff too
  }
}

Presets.prototype.selectPresetWithIndex = function(index) {
  self.selectedPresetIndex = index
}

Presets.prototype.selectedPresetCameraMap = function() {
  // debugger
  return this.data[this.selectedPresetIndex].cameraMap
}

Presets.prototype.plantParams = function(index) {
  if (!this.data[this.selectedPresetIndex]) return
  return this.data[this.selectedPresetIndex].plantParams[index]
}

// TOFIX: WRONG!
Presets.prototype.save = function(fileName) {
  let data = {
    plantParams: this.data,
    cameraMap: this.cameraMap
  }
  saveData(data, fileName)
}

Presets.prototype.updateCameraMap = function(key, camera, data) {
  let cameraMap = this.data[this.selectedPresetIndex].cameraMap
  cameraMap[key] = Object.assign({}, cameraMap[key], data)
}

Presets.prototype.selectedStyle = function() {
  return this.styles[this.selectedStyleIndex]
}
module.exports = Presets

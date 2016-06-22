let fileReader = new FileReader()

var Presets = function() {
  this.plantParams = []
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

Presets.prototype.load = function(callback) {
  // hacky, assumes there's a dom element with id of filepicker. good thing that there is! ;p
  let selectedFile = document.getElementById('filepicker').files[0]
  console.log(selectedFile)

  fileReader.onload = function(e) {
    this.plantParams = JSON.parse(fileReader.result);
    // console.log(fileReader.result)
    callback(this.plantParams)
  }
  fileReader.readAsText(selectedFile)
}

Presets.prototype.generatePlantParams = function(numberOfPlants, numberOfShaders) {
  this.plantParams = []
  for (var i = 0; i < numberOfPlants; i++) {
    let petalCount = Math.floor(getRandomArbitrary(20, 40))
    let curveAmountB = getRandomArbitrary(0.08, 0.20) // multiplier for log curvature
    let curveAmountC = getRandomArbitrary(0.2, 0.6) // initial curve amount
    let curveAmountD = getRandomArbitrary(0.2, 0.5)
    let layers = Math.floor(getRandomArbitrary(6, 10))
    let petalLength = getRandomArbitrary(0.1, 0.7)
    let petalWidth = getRandomArbitrary(0.4, 0.6)
    let shaderIndex = Math.floor(getRandomArbitrary(0, numberOfShaders));

    // wishing this were ES6 right now! no time for configuring babel at the moment...
    let preset = {
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
    this.plantParams.push(preset)
  }
  return this.plantParams
}

Presets.prototype.save = function(fileName) {
  saveData(this.plantParams, fileName)
}

module.exports = Presets

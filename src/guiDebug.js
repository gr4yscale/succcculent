
var dat = require('dat-gui');


var controlsGUI = new function () {
  this.bleachOpacity = 1;
  this.bleach = false;
  this.edgeDetect = false;
  this.edgeAspect = 512;
  this.FXAA = false;
  this.focus = false;
  this.sampleDistance = 0.94;
  this.waveFactor = 0.00125;
  this.screenWidth = window.innerWidth;
  this.screenHeight = window.innerHeight;

  this.colorR = 1;
  this.colorG = 1;
  this.colorB = 1;

  this.hue = 0;
  this.saturation = 0;

  this.onChange = function () {
    bleachFilter.enabled = controlsGUI.bleach;
    bleachFilter.uniforms.opacity.value = controlsGUI.bleachOpacity;
    edgeShader.enabled = controlsGUI.edgeDetect;
    edgeShader.uniforms.aspect.value = new THREE.Vector2(controlsGUI.edgeAspect, controlsGUI.edgeAspect);
    FXAAShader.enabled = controlsGUI.FXAA;
    FXAAShader.uniforms.resolution.value = new THREE.Vector2(1 / window.innerWidth, 1 / window.innerHeight);
    focusShader.enabled = controlsGUI.focus;
    focusShader.uniforms.screenWidth.value = controlsGUI.screenWidth;
    focusShader.uniforms.screenHeight.value = controlsGUI.screenHeight;
    focusShader.uniforms.waveFactor.value = controlsGUI.waveFactor;
    focusShader.uniforms.sampleDistance.value = controlsGUI.sampleDistance;

    // colorCorrectionShader.uniforms.mulRGB.value.set(controlsGUI.colorR, controlsGUI.colorG, controlsGUI.colorB)
    hueSaturationShader.uniforms.hue.value = controlsGUI.hue
    hueSaturationShader.uniforms.saturation.value = controlsGUI.saturation
  }
};


  let gui = new dat.GUI()

  let guiGardenGen = gui.addFolder("Ad-Hoc Garden Generation")
  guiGardenGen.add(state, 'numPlantsForNextGeneration', 1, 300).step(1).name("# Plants").onFinishChange(regenGardenIfAllowed)
  guiGardenGen.add(state, 'adHocGardenGenerationEnabled').name("Ad-Hoc Garden Gen").onFinishChange(regenGardenIfAllowed)
  guiGardenGen.add(state, 'adHocPlantParamsPetalCount', 4, 200).step(1).name("Petal Count").onFinishChange(regenGardenIfAllowed)
  guiGardenGen.add(state, 'adHocPlantParamsPetalLength', 0.01, 4.0).step(0.01).name("Petal Length").onFinishChange(regenGardenIfAllowed)
  guiGardenGen.add(state, 'adHocPlantParamsPetalWidth', 0.01, 4.0).step(0.01).name("Petal Width").onFinishChange(regenGardenIfAllowed)
  guiGardenGen.add(state, 'adHocPlantParamsCurveAmountB', 0.01, 3.0).step(0.01).name("Curve Amt B").onFinishChange(regenGardenIfAllowed)
  guiGardenGen.add(state, 'adHocPlantParamsCurveAmountC', 0.01, 3.0).step(0.01).name("Curve Amt C").onFinishChange(regenGardenIfAllowed)
  guiGardenGen.add(state, 'adHocPlantParamsCurveAmountD', 0.01, 3.0).step(0.01).name("Curve Amt D").onFinishChange(regenGardenIfAllowed)
  guiGardenGen.add(state, 'adHocPlantParamsLayers', 2, 40).step(1).name("# Layers").onFinishChange(regenGardenIfAllowed)



  gui.add(controlsGUI, 'bleach').onChange(controlsGUI.onChange);
  gui.add(controlsGUI, 'bleachOpacity', 0, 2).onChange(controlsGUI.onChange);
  gui.add(controlsGUI, 'edgeDetect').onChange(controlsGUI.onChange);
  gui.add(controlsGUI, 'edgeAspect', 128, 2048).step(128).onChange(controlsGUI.onChange);
  gui.add(controlsGUI, 'FXAA').onChange(controlsGUI.onChange);
  gui.add(controlsGUI, 'focus').onChange(controlsGUI.onChange);
  gui.add(controlsGUI, 'sampleDistance', 0, 2).step(0.01).onChange(controlsGUI.onChange);
  gui.add(controlsGUI, 'waveFactor', 0, 0.005).step(0.0001).onChange(controlsGUI.onChange);

  gui.add(controlsGUI, 'colorR', 0, 1).onChange(controlsGUI.onChange);
  gui.add(controlsGUI, 'colorG', 0, 1).onChange(controlsGUI.onChange);
  gui.add(controlsGUI, 'colorB', 0, 1).onChange(controlsGUI.onChange);

  gui.add(controlsGUI, 'hue', -1, 1).onChange(controlsGUI.onChange);
  gui.add(controlsGUI, 'saturation', -1, 1).onChange(controlsGUI.onChange);


  // dat.GUI.toggleHide()

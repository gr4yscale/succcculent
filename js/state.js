var state = exports

// garden generation params
state.numPlantsForNextGeneration = 100;
state.adHocGardenGenerationEnabled = false
state.adHocPlantParamsPetalCount = 36
state.adHocPlantParamsCurveAmountB = 0.13275223848488998
state.adHocPlantParamsCurveAmountC = 0.20827196143002302
state.adHocPlantParamsCurveAmountD = 0.36005163068644075
state.adHocPlantParamsLayers = 6
state.adHocPlantParamsPetalLength = 0.43796780893085985
state.adHocPlantParamsPetalWidth = 0.5438646263177942

// modes:
state.gardenPresetModeEnabled = false
state.gardenPresetSaveNext = false

// camera presets learn
state.cameraPresetsLearn = false

// same shaders
state.sameShaderForAllPlants = false
state.sameShaderForAllPlantsIndex = 0

// texture mode
state.generateNewPlantsWithTextures = false
state.textureRepeatRange = 1
state.textureUpdateSpeed = 1.0

// audio analysis (comes in as MIDI from VDMX)
self.audioAnalysisCanUpdateCamera = false
state.audioAnalysisFilter1 = 1.0
state.audioAnalysisFilter2 = 1.0
state.audioAnalysisFilter3 = 1.0
state.audioAnalysisFilter1Gain = 1.0
state.audioAnalysisFilter2Gain = 1.0
state.audioAnalysisFilter3Gain = 1.0
state.audioAnalaysisFilter1TriggerThreshold = 0.7
state.audioAnalaysisFilter2TriggerThreshold = 0.7
state.audioAnalaysisFilter3TriggerThreshold = 0.7
state.audioAnalaysisFilter1TriggerThresholdReached = false
state.audioAnalaysisFilter2TriggerThresholdReached = false
state.audioAnalaysisFilter3TriggerThresholdReached = false

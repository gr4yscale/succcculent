var state = exports

////////////////////////
// Modes:

// camera presets learn
state.cameraPresetsLearn = false

// same shaders
state.sameShaderForAllPlants = false
state.sameShaderForAllPlantsIndex = 0

// texture mode
state.generateNewPlantsWithTextures = false

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

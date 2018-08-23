
/////////////////////////////
//// NEW PURPOSE OF THIS FILE:
/////////////////////////////
////
//// Move all midi stuff to apc40 file
////
////


/////////////////////////////
//// PURPOSE OF THIS FILE:
//// initialize sub-controls: midi, keyboard
//// sub-controls: handle their own specific logic
//// keep a reference to state, so that we can update controls output from that
//// dispatch the correct redux actions when the events for subcontrols come through
//// log events from sub-controls callbacks
////
////
//// CURRENT SITUATION:
//// Seems like we are looking into these files to get the mappings of events to buttons, and that's it
////
////  TODO
////  implement keyboard controls first
////  remove need for scene, camera, and orbit controls
////////////////////////////////

// control surfaces
import apc from 'controls_midi_apc40'
import kb from 'controls_kb'
// let touchOSC = require('./controls_midi_touchosc')
// let FirstPersonControls = require('./controls_first_person.js')

// misc dependencies
import events from 'event'
import lerp from utils.lerp

// export default (store, midi) => {

export default (presets, state, midi, scene, _camera, elementForOrbitControls, controlsEventCallback) => {
    const logControlSurfaceEvents = true
    let interval = 0.001
    let outputAPC40

    // TOFIX
    let camera = _camera // TOFIX: refactor out
    // TOFIX: make these Vector3's probably
    let cameraRotationDeltaX = 0.0
    let cameraRotationDeltaY = 0.0
    let cameraPositionDeltaX = 0.0
    let cameraPositionDeltaY = 0.0
    let joystickSensitivity = 2.0
    let cameraDollyDelta = 1.0
    let cameraDollySensitivity = 1.0

    function callbackForControlEvent(type, data) {
        let event = { type: type, data: data}
        controlsEventCallback(event)
    }

    function setup() {
        midi.enable((err) => {
            if (err) {
                console.log('WebMidi could not be enabled.', err)
                console.log(err)
                return
            } else {
                console.log('WebMidi enabled! Inputs found: \n' + midi.inputs)
            }

            let inputAPC40 = midi.getInputByName("Akai APC40")
            outputAPC40 = midi.getOutputByName("Akai APC40")

            // let inputTouchOSC = midi.getInputByName("TouchOSC Bridge")
            // let inputAudioAnalysis = midi.getInputByName("From VDMX")

            if (inputAPC40) {
                inputAPC40.addListener('noteoff', "all", handleUnhandledMidiEvent)
                inputAPC40.addListener('pitchbend', "all", handleUnhandledMidiEvent)
                inputAPC40.addListener('channelaftertouch', "all", handleUnhandledMidiEvent)
                inputAPC40.addListener('programchange', "all", handleUnhandledMidiEvent)
                inputAPC40.addListener('channelmode', "all", handleUnhandledMidiEvent)
                inputAPC40.addListener('noteon', "all", handleMidiNoteOn)
                inputAPC40.addListener('noteoff', "all", handleMidiNoteOff)
                // inputAPC40.addListener('controlchange', "all", handleMidiControlChangeAPC)
            }

            if (outputAPC40) {
                apc.resetMainGridButtonLEDsToOffState(self.outputAPC40)
                apc.updateButtonLEDsForToggles(state, self, self.outputAPC40) // update LED state on init to make sure they properly represent current state
            }
        }

        document.body.addEventListener('keypress', handleKeyPress)
    }

    function update(state, presets) {
        this.updateCameraWithOrbitControls()

        // TOFIX: hack to not kill perf sending MIDI out too often
        interval++
        if (interval > 8.0) {
            if (outputAPC40) {
                if (state.gardenPresetModeEnabled) {
                    this.apc.updateMainGridButtonLEDsForGardenPresetMode(presets, outputAPC40)
                } else {
                    this.apc.updateMainGridButtonLEDsForCameraPresetMode(presets.selectedPresetCameraMap(), outputAPC40)
                }

                this.apc.updateButtonLEDsForToggles(state, this, outputAPC40)
            }
            interval = 0
        }
    }

    ////////////////////////////////////////////
    // Private methods
    ////////////////////////////////////////////
    function buttonPressed(buttonIdentifier) {
        // TOFIX: making immutable copies like this on input events may cause perf issues...
        let allInputSourcesEventIds = Object.assign({}, self.apc.buttonIdentifierToEventIdentifier)
        allInputSourcesEventIds = Object.assign({}, allInputSourcesEventIds, kb.buttonIdentifierToEventIdentifier)
        allInputSourcesEventIds = Object.assign({}, allInputSourcesEventIds, touchOSC.buttonIdentifierToEventIdentifier)

        console.log('Handling button press: ' + buttonIdentifier + ' for event id: ' + allInputSourcesEventIds[buttonIdentifier])
        switch (allInputSourcesEventIds[buttonIdentifier]) {
            case events.SAVE_GARDEN_TO_PRESET_FILE:
                callbackForControlEvent(events.SAVE_GARDEN_TO_PRESET_FILE)
                break
            case events.LOAD_GARDEN_FROM_PRESET_FILE:
                callbackForControlEvent(events.LOAD_GARDEN_FROM_PRESET_FILE)
                break
            case events.GENERATE_NEW_RANDOM_GARDEN:
                callbackForControlEvent(events.GENERATE_NEW_RANDOM_GARDEN)
                break
            case events.GENERATE_NEW_PLANTS_TEXTURE_STYLES_TOGGLE:
                state.generateNewPlantsWithTextures = !state.generateNewPlantsWithTextures
                callbackForControlEvent(events.GENERATE_NEW_PLANTS_TEXTURE_STYLES_TOGGLE, {generateNewPlantsWithTextures: state.generateNewPlantsWithTextures})
                break
            case events.CAMERA_PRESETS_LEARN_TOGGLED:
                if (!state.gardenPresetModeEnabled) {
                    state.cameraPresetsLearn = !state.cameraPresetsLearn
                    callbackForControlEvent(events.CAMERA_PRESETS_LEARN_TOGGLED, {key: 'cameraPresetsLearn', value: state.cameraPresetsLearn})
                    apc.resetMainGridButtonLEDsToOffState(soutputAPC40)
                    apc.updateButtonLEDsForToggles(state, self, outputAPC40) // update LED state on init to make sure they properly represent current state
                }
                break
            case events.CAMERA_CONTROLS_RESET:
                resetCameraDeltas()
                this.cameraReset()
                callbackForControlEvent(events.CAMERA_CONTROLS_RESET)
                break
            case events.GARDEN_PRESET_MODE_TOGGLED:
                callbackForControlEvent(events.GARDEN_PRESET_MODE_TOGGLED)
                self.apc.resetMainGridButtonLEDsToOffState(self.outputAPC40)
                self.apc.updateButtonLEDsForToggles(state, self, self.outputAPC40) // update LED state on init to make sure they properly represent current state
                break
            case events.GARDEN_PRESET_MODE_SAVE_NEXT_PRESET_TOGGLED:
                callbackForControlEvent(events.GARDEN_PRESET_MODE_SAVE_NEXT_PRESET_TOGGLED)
                // self.apc.updateButtonLEDsForToggles(state, self, self.outputAPC40)
                break
            case events.ADD_NEW_GARDEN_PRESET:
                callbackForControlEvent(events.ADD_NEW_GARDEN_PRESET)
                // self.apc.updateButtonLEDsForToggles(state, self, self.outputAPC40)
                break
            case 'p':
                debugger
                break
            default: {
                // handle garden presets save / load mode
                if (state.gardenPresetModeEnabled) {
                    if (state.gardenPresetSaveNext) {
                        state.gardenPresetSaveNext = false

                        let index = self.apc.indexOfButtonForIdentifier(buttonIdentifier)
                        console.log('about to save preset index: ' + index)
                        // TOFIX: this should be "next selected" preset and the index of the apc40 should correspond to the index of presets data
                        // i should just initialize presets data with an array of empty objects so that the indexes are aligned?
                        callbackForControlEvent(events.SAVE_GARDEN_TO_SELECTED_PRESET, {index: index})
                    } else {
                        let index = self.apc.indexOfButtonForIdentifier(buttonIdentifier)
                        console.log('about to load preset index: ' + index)
                        callbackForControlEvent(events.LOAD_GARDEN_FROM_SELECTED_PRESET, {index: index})
                    }
                } else {
                    // handle camera hotkey learn / trigger mode
                    if (state.cameraPresetsLearn) {
                        state.cameraPresetsLearn = false
                        let data = {
                            presetIdentifier: buttonIdentifier,
                            controlsType: 'orbit',
                            controlsOrbitMatrix: this.orbitControls.object.matrix.toArray(),
                            controlsOrbitTarget: this.orbitControls.target.clone(),
                            key: 'cameraPresetsLearn',  // TOFIX: sloppy hack to fix indicator updates
                            value: state.cameraPresetsLearn
                        }
                        callbackForControlEvent(events.CAMERA_PRESET_LEARN, data)
                    } else {
                        let data = {
                            presetIdentifier: buttonIdentifier
                        }
                        callbackForControlEvent(events.CAMERA_PRESET_TRIGGER, data)
                        self.apc.lastCameraPresetIdentifier = buttonIdentifier
                    }
                }
                break
            }
        }
    }

    return {
        update
    }

}



//////////////////////////////////////////////////////////////////////////////////////////////
// GRAVEYARD
//////////////////////////////////////////////////////////////////////////////////////////////

// MIDI - APC40 knobs (stub)
// function handleMidiControlChangeAPC(e) {
//     console.log('Knob #: ' + e.controller.number + ' | Value: ' + e.value) // TOFIX: replace this with generic MIDI log function?
//     let v = e.value / 127.0
//
//     switch (e.controller.number) {
//         case 48:
//
//             break
//         case 49:
//
//             break
//         case 50:
//
//             break
//         case 51:
//
//             break
//         default:
//     }
// }
//
//
// case 8:
//   self.audioAnalaysisFilter3TriggerThreshold = lerp(0, 1.0, v)
//   self.audioAnalaysisFilter3TriggerThresholdReached = false
//   break
// case 9:
//   state.audioAnalysisFilter1Gain = lerp(0, 1.0, v)
//   break
// case 10:
//   state.audioAnalysisFilter2Gain = lerp(0, 1.0, v)
//   break
// case 11:
//   self.audioAnalysisFilter3Gain = lerp(0, 1.0, v)
//   break
//   case 15: {
//     state.sameShaderForAllPlantsIndex = Math.floor(lerp(0, 14, v)) //TOFIX: keep this within bounds, pass in the shaders array length
//     if (state.sameShaderForAllPlants) {
//       callbackToUpdatePlantShaders(state.sameShaderForAllPlantsIndex)
//     }
//     break
//   }
//   default:
// }
//}
//
// // MIDI - camera controls (TouchOSC)
// function handleMidiControlChangeTouchOSC(e) {
//     if (logControlSurfaceEvents) {
//         console.log('Channel #: ' + e.channel + ' | Knob #: ' + e.controller.number + ' | Value: ' + e.value) // TOFIX: replace this with generic MIDI log function?
//     }
//
//     let v = e.value / 127.0
//
//     // Camera, page 1
//     if (e.channel == 1) {
//         switch (e.controller.number) {
//             case 0:
//                 if (!self.xboxControllerSelected) cameraRotationDeltaY = lerp(-0.5, 0.5, v)
//                 break
//             case 1:
//                 if (!self.xboxControllerSelected) cameraRotationDeltaX = lerp(0.5, -0.5, v)
//                 break;
//             case 2:
//                 if (!self.xboxControllerSelected) cameraPositionDeltaY = lerp(-0.5, 0.5, v)
//                 break;
//             case 3:
//                 if (!self.xboxControllerSelected) cameraPositionDeltaX = lerp(0.5, -0.5, v)
//                 break;
//             case 4:
//                 joystickSensitivity = lerp(0, 8.0, v)
//                 break
//             case 5:
//                 cameraDollyDelta = lerp(1.0099, 0.986, v)
//                 break
//         }
//         // Textures, page 2
//     } else if (e.channel == 3) {
//         switch (e.controller.number) {
//             case 7:
//                 state.textureUpdateSpeed = lerp(1.0, 10.0, v)
//                 break
//             case 8:
//                 state.textureRepeatRange = lerp(1.0, 10.0, v)
//                 break
//         } // Garden Presets
//     } else if (e.channel == 4) {
//         switch (e.controller.number) {
//             case 0:
//                 console.log('updating the selected style')
//                 presets.selectedStyleIndex = Math.floor(lerp(0, presets.styles.length - 1, v))
//                 break
//             case 1:
//                 state.numPlantsForNextGeneration = Math.floor(lerp(0, 250, v))
//                 break
//         }
//
//     }
//
// function callbackToUpdatePlantShaders(shaderIndex) {
//     if (state.sameShaderForAllPlants) {
//         let data = {shaderIndex: shaderIndex}
//         callbackForControlEvent(events.SET_SAME_SHADER_FOR_ALL_PLANTS, data)
//     } else {
//         callbackForControlEvent(events.RESET_SHADERS_TO_INITIAL_SHADER_FOR_ALL_PLANTS)
//     }
// }


import * as dat from 'dat.gui'
import Observable from './common/observable'

// Parameters
let params = {
    // scene
    fov: 65,
    // shaders
    bleachOpacity: 1,
    bleach: false,
    edgeDetect: false,
    edgeAspect: 512,
    FXAA: false,
    focusEnabled: false,
    sampleDistance: 0.94,
    waveFactor: 0.00125,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    mulR: 1,
    mulG: 1,
    mulB: 1,
    powR: 0.6,
    powG: 0.6,
    powB: 0.6,
    hue: 0,
    saturation: 0
}

export default class DebugGUI extends Observable {
    constructor() {
        super()

        const gui = new dat.GUI()
        const notify = () => { this.notify(params) }

        ///////////////////////////
        // Garden Generation
        gui.addFolder('Garden Generation')

        /////////////////////////////
        // Scene
        gui.addFolder('Scene')
        gui.add(params, 'fov', 0, 100).onChange(notify)

        /////////////////////////////
        // Shaders
        gui.addFolder('Shaders')
        gui.add(params, 'bleach').onChange(notify)
        gui.add(params, 'bleachOpacity', 0, 2).onChange(notify)
        gui.add(params, 'edgeDetect').onChange(notify)
        gui.add(params, 'edgeAspect', 128, 2048).step(128).onChange(notify)
        gui.add(params, 'FXAA').onChange(notify)
        gui.add(params, 'focusEnabled').onChange(notify)
        gui.add(params, 'sampleDistance', 0, 2).step(0.01).onChange(notify)
        gui.add(params, 'waveFactor', 0, 0.005).step(0.0001).onChange(notify)
        gui.add(params, 'mulR', 0, 1).onChange(notify)
        gui.add(params, 'mulG', 0, 1).onChange(notify)
        gui.add(params, 'mulB', 0, 1).onChange(notify)
        gui.add(params, 'powR', 0, 2).onChange(notify)
        gui.add(params, 'powG', 0, 2).onChange(notify)
        gui.add(params, 'powB', 0, 2).onChange(notify)
        gui.add(params, 'hue', -1, 1).onChange(notify)
        gui.add(params, 'saturation', -1, 1).onChange(notify)
    }
}

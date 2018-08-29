import * as dat from 'dat.gui'
const gui = new dat.GUI()

// THREE / Shaders
let composer, renderPass, copyShader
let bleach, edge, FXAA, focus, hueSaturation, colorCorrection

// Parameters
let params = {
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
    saturation: 0,
    fov: 65
}

// export default (THREE, renderer, camera, scene) => {
export default class PostFX {
    constructor(THREE, renderer, camera, scene) {
        let onChange = () => {
            bleach.uniforms.opacity.value = params.bleachOpacity;
            bleach.enabled = params.bleach;
            bleach.uniforms.opacity.value = params.bleachOpacity;
            edge.enabled = params.edgeDetect;
            edge.uniforms.aspect.value = new THREE.Vector2(params.edgeAspect, params.edgeAspect);
            FXAA.enabled = params.FXAA;
            FXAA.uniforms.resolution.value = new THREE.Vector2(1 / window.innerWidth, 1 / window.innerHeight);
            focus.enabled = params.focusEnabled;
            focus.uniforms.screenWidth.value = params.screenWidth;
            focus.uniforms.screenHeight.value = params.screenHeight;
            focus.uniforms.waveFactor.value = params.waveFactor;
            focus.uniforms.sampleDistance.value = params.sampleDistance;

            colorCorrection.uniforms.mulRGB.value.set(params.mulR, params.mulG, params.mulB)
            colorCorrection.uniforms.powRGB.value.set(params.powR, params.powG, params.powB)
            hueSaturation.uniforms.hue.value = params.hue
            hueSaturation.uniforms.saturation.value = params.saturation
            // camera.setFocalLength(params.fov)
            // camera.updateProjectionMatrix()
        }

        gui.add(params, 'bleach').onChange(onChange);
        gui.add(params, 'bleachOpacity', 0, 2).onChange(onChange);
        gui.add(params, 'edgeDetect').onChange(onChange);
        gui.add(params, 'edgeAspect', 128, 2048).step(128).onChange(onChange);
        gui.add(params, 'FXAA').onChange(onChange);
        gui.add(params, 'focusEnabled').onChange(onChange);
        gui.add(params, 'sampleDistance', 0, 2).step(0.01).onChange(onChange);
        gui.add(params, 'waveFactor', 0, 0.005).step(0.0001).onChange(onChange);

        gui.add(params, 'mulR', 0, 1).onChange(onChange);
        gui.add(params, 'mulG', 0, 1).onChange(onChange);
        gui.add(params, 'mulB', 0, 1).onChange(onChange);

        gui.add(params, 'powR', 0, 2).onChange(onChange);
        gui.add(params, 'powG', 0, 2).onChange(onChange);
        gui.add(params, 'powB', 0, 2).onChange(onChange);

        gui.add(params, 'hue', -1, 1).onChange(onChange);
        gui.add(params, 'saturation', -1, 1).onChange(onChange);
        gui.add(params, 'fov', 0, 100).onChange(onChange);

        bleach = new THREE.ShaderPass(THREE.BleachBypassShader);
        bleach.enabled = false;
        edge = new THREE.ShaderPass(THREE.EdgeShader);
        edge.enabled = false;
        FXAA = new THREE.ShaderPass(THREE.FXAAShader);
        FXAA.enabled = false;
        focus = new THREE.ShaderPass(THREE.FocusShader);
        focus.enabled = false;
        colorCorrection = new THREE.ShaderPass(THREE.ColorCorrectionShader);
        hueSaturation = new THREE.ShaderPass(THREE.HueSaturationShader);

        renderPass = new THREE.RenderPass(scene, camera);
        copyShader = new THREE.ShaderPass(THREE.CopyShader);
        copyShader.renderToScreen = true;

        composer = new THREE.EffectComposer(renderer);

        composer.addPass(renderPass);

        composer.addPass(bleach);
        composer.addPass(edge);
        composer.addPass(FXAA);
        composer.addPass(focus);
        composer.addPass(colorCorrection);
        composer.addPass(hueSaturation);

        composer.addPass(copyShader);
    }

    render() {
        composer.render();
    }
}

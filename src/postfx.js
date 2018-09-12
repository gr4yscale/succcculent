import EffectComposer, { RenderPass, ShaderPass, CopyShader } from 'three-effectcomposer-es6'
import EdgeShader from './shaders/postfx/EdgeShader'
import BleachBypassShader from './shaders/postfx/BleachBypassShader'
import FXAAShader from './shaders/postfx/FXAAShader'
import FocusShader from './shaders/postfx/FocusShader'
import HueSaturationShader from './shaders/postfx/HueSaturationShader'
import ColorCorrectionShader from './shaders/postfx/ColorCorrectionShader'


// THREE / Shaders
let composer, renderPass, copyShader
let bleach, edge, FXAA, focus, hueSaturation, colorCorrection


export default class PostFX {
    constructor(THREE, renderer, camera, scene, debugGUI) {

        debugGUI.subscribe(params => {
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
        })

        bleach = new ShaderPass(BleachBypassShader);
        bleach.enabled = false;
        edge = new ShaderPass(EdgeShader);
        edge.enabled = false;
        FXAA = new ShaderPass(FXAAShader);
        FXAA.enabled = false;
        focus = new ShaderPass(FocusShader);
        focus.enabled = false;
        colorCorrection = new ShaderPass(ColorCorrectionShader);
        hueSaturation = new ShaderPass(HueSaturationShader);

        renderPass = new RenderPass(scene, camera);
        copyShader = new ShaderPass(CopyShader);
        copyShader.renderToScreen = true;

        composer = new EffectComposer(renderer);

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

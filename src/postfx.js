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

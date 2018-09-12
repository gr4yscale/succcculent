import OrbitControls from 'orbit-controls-es6'

export default class JoystickOrbitControls extends OrbitControls {
    handleJoystickPan(deltaX, deltaY) {
        this.pan(deltaX, deltaY)
    }

    handleJoystickRotate(deltaX, deltaY) {
        // console.log( 'handleJoystickRotate' );
        this.rotateDelta.set(deltaX, deltaY)

        var element = this.scope.domElement === document ? this.scope.domElement.body : this.scope.domElement;
        // rotating across whole screen goes 360 degrees around
        this.rotateLeft(2 * Math.PI * this.rotateDelta.x / element.clientWidth * this.scope.rotateSpeed);
        // rotating up and down along whole screen attempts to go 360, but limited to 180
        this.rotateUp(2 * Math.PI * this.rotateDelta.y / element.clientHeight * this.scope.rotateSpeed);
    }

    handleJoystickDolly(zoomScale) {
        // console.log(zoomScale)
        if (zoomScale > 1.0) {
            this.scale = zoomScale
            // dollyOut( zoomScale );
        } else if (zoomScale < 1.0) {
            this.scale = zoomScale
            // dollyIn( zoomScale );
        }
    }
}



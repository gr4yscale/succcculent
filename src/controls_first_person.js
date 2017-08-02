// Custom camera controls for XBox360 controller.
// Left and Right finger trigger buttons adjust cameraY with a time-based deceleration

//TOFIX: hack
const THREE = window.THREE

module.exports = function (camera) {
  const decelerationRate = 0.1
  const decelerationDuration = 300.0
  const sensitivity = 0.003
  let cameraYaccelerationDelta = 0.0
  let prevTime = performance.now()

  let pitchObject = new THREE.Object3D()
  let yawObject = new THREE.Object3D()

	camera.rotation.set( 0, 0, 0 )
	pitchObject.add(camera)
	yawObject.position.y = camera.position.y
	yawObject.add(pitchObject)

  return {
    getObject: function() {
      return yawObject
    },
    update: function(positionX, positionZ, direction, rotationX, rotationY) {
      let time = performance.now()
			let accelerationDelta = (time - prevTime) / decelerationDuration

      cameraYaccelerationDelta -= cameraYaccelerationDelta * accelerationDelta

      if (direction == -1) {
        cameraYaccelerationDelta -= decelerationRate
      } else if (direction == 1) {
        cameraYaccelerationDelta += decelerationRate
      }

      yawObject.translateX(positionX * sensitivity)
      yawObject.translateY(cameraYaccelerationDelta * (sensitivity * 0.4))
      yawObject.translateZ(positionZ * sensitivity)
  		yawObject.rotation.y -= rotationX * sensitivity

  		pitchObject.rotation.x -= rotationY * sensitivity

      prevTime = time
  	}
  }
}

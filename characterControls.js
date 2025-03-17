function characterControls(){
let model, mixer, animationMap, orbitControl, camera, currentAction;

this.walkDirection = new THREE.Vector3()
this.rotateAngle = new THREE.Vector3(0, 1 ,0)
this.rotateQuaternion = new THREE.Quaternion()
this.cameraTarget = new THREE.Vector3()

this.toggleRun = true
this.model = model
this.mixer = mixer
this.animationmap = animationmap
this.animationmap.forEach( function( value,key ) {

    if( key == currentAction )
    {
        value.play()
    }
    
})
this.orbitControl = orbitControl
this.camera = camera



}

export default characterControls;
define(["three"], function(THREE){
    return {new: function(model, scene, camera){
        var Controller = {
            init: function(model, scene, camera){
                this.model = model;
                this.rotationGuide = this.buildRotationGuide();
                scene.add(this.rotationGuide);
            },

            updateRotation: function(mouseX, mouseY, dim){
                var actualPos = this.actualPos(mouseX, mouseY, dim),
                    deltaX = actualPos[0] - this.initialMouseX,
                    deltaY = actualPos[1] - this.initialMouseY,
                    rotateEndPoint = this.mapToSphere(deltaX, deltaY, dim),
                    rotateQuaternion = this.rotateQuaternion(this.rotateStartPoint, rotateEndPoint),
                    currQuaternion = this.model.quaternion;

                currQuaternion.multiplyQuaternions(rotateQuaternion, currQuaternion);
                currQuaternion.normalize();
                this.model.setRotationFromQuaternion(currQuaternion);
                this.rotationGuide.setRotationFromQuaternion(currQuaternion);
                this.initialMouseX = actualPos[0];
                this.initialMouseY = actualPos[1];
            },

            buildRotationGuide: function(){
                var sphereGeom =  new THREE.SphereGeometry(1.5, 8, 8),
                    wireframeMaterial = new THREE.MeshBasicMaterial(
                        {color: 0x333333, 
                         wireframe: true, 
                         transparent: true });
                return new THREE.Mesh(sphereGeom.clone(), wireframeMaterial);
            },

            screenCenter: function(dim){
                var width = dim.rightBound - dim.leftBound,
                    height = dim.topBound - dim.bottomBound;
                return [width/2, height/2];
            },

            startRotation: function(initialMousePos, dim){
                var actualPos = this.actualPos(initialMousePos[0], initialMousePos[1], dim);
                this.initialMouseX = actualPos[0];
                this.initialMouseY = actualPos[1];
                this.rotateStartPoint = this.mapToSphere(0,0, dim);
            },

            endRotation: function(){
            },

            actualPos: function(x, y, dim){
                return [(x - dim.leftBound), (y - dim.bottomBound)];
            },

            mapToSphere: function(x, y, dim){
                var screenCenter = this.screenCenter(dim);
                var pointOnSphere = new THREE.Vector3(x / screenCenter[0], -y / screenCenter[1], 0);
                pointOnSphere.clampScalar(-1, 1);

                var length = pointOnSphere.length();

                if(length >= 1){
                    pointOnSphere.normalize(); 
                } else {
                    pointOnSphere.z = Math.sqrt(1.0 - (length * length));
                }
                return pointOnSphere;
            },

            rotateQuaternion: function(rotateStart, rotateEnd){
                var axis = new THREE.Vector3(),
                    quaternion = new THREE.Quaternion(),
                    normalStart = new THREE.Vector3(),
                    normalEnd = new THREE.Vector3();
                normalStart.set(rotateStart.x, rotateStart.y, rotateStart.z).normalize();
                normalEnd.set(rotateEnd.x, rotateEnd.y, rotateEnd.z).normalize();
                quaternion.setFromUnitVectors(normalStart, normalEnd);
                return quaternion;
            },
        };
        Controller.init(model, scene, camera);
        return Controller;
    }};
});

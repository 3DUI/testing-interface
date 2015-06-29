define(["three", "src/mouse_to_world"], function(THREE, MouseToWorld){
    return {new: function(model, scene, camera){
        var Controller = {
            unhiddenOpacity: 0.25,
            radius: 1, // TODO: changing this introduces discontinuities!

            init: function(model, scene, camera){
                this.model = model;
                this.camera = camera;
                this.rotationGuide = this.buildRotationGuide();
                scene.add(this.rotationGuide);
            },

            /**
             * Create the sphere around the model
             */
            buildRotationGuide: function(){
                var sphereGeom =  new THREE.SphereGeometry(this.radius, 64, 64),
                    wireframeMaterial = new THREE.MeshBasicMaterial({
                        color: 0xd3d3d3,
                        opacity: this.unhiddenOpacity,
                        transparent: true});
                return new THREE.Mesh(sphereGeom.clone(), wireframeMaterial);
            },

            updateRotation: function(mouseX, mouseY, dim){
                var actualPos = this.actualPos(mouseX, mouseY, dim);
                    rotate = this.rotateQuaternion(
                        this.getSpherePointFromMouse(this.initialMouse, dim),
                        this.getSpherePointFromMouse(actualPos, dim));
                
                this.rotateModelByQuaternion(this.model, rotate); 
                this.rotateModelByQuaternion(this.rotationGuide, rotate); 
                this.initialMouse = actualPos;
            },

            rotateModelByQuaternion: function(model, rotate){
                currQuaternion = model.quaternion;
                currQuaternion.multiplyQuaternions(rotate, currQuaternion);
                currQuaternion.normalize();
                model.setRotationFromQuaternion(currQuaternion);
            },

            startRotation: function(initialMousePos, dim){
                this.initialMouse = this.actualPos(initialMousePos[0], initialMousePos[1], dim);
                this.rotateStartPoint = this.mapToSphere(0,0, dim);
            },

            hideGuide: function(hide){
                if(hide){
                    this.rotationGuide.material.opacity = 0;
                } else {
                    this.rotationGuide.material.opacity = this.unhiddenOpacity;
                }
            },

            endRotation: function(){

            },

            sizeFor: function(dim){
                var width = dim.rightBound - dim.leftBound,
                    height = dim.topBound - dim.bottomBound;
                return {width: width, height: height};
            },

            /**
             * Get the position of the mouse within the viewport rather than across the whole screen
             */
            actualPos: function(x, y, dim){
                return new THREE.Vector2(x - dim.leftBound, y - dim.bottomBound);
            },
            
            /**
             * Get the position of the mouse mapped onto a sphere in the plane
             */
            getSpherePointFromMouse: function(pos, dim){
                var size = this.sizeFor(dim),
                    worldPoint = MouseToWorld(pos.x, pos.y, size.width, size.height, this.camera);
                return this.mapToSphere(worldPoint.x, worldPoint.y, dim);
            },

            /**
             * Map the given position on a plane tangent to the sphere to a position on that sphere
             */
            mapToSphere: function(x, y, dim){
                var pointOnSphere = new THREE.Vector3(x, y, 0),
                    length = pointOnSphere.length();

                if(length >= this.radius){
                    pointOnSphere.normalize(); 
                } else {
                    pointOnSphere.z = Math.sqrt(1.0 - (length * length));
                }
                return pointOnSphere;
            },

            /**
             * Create a quaternion which will rotate a model orientated along the first vector
             * to be orientated along the second instead
             */
            rotateQuaternion: function(rotateStart, rotateEnd){
                var axis = new THREE.Vector3(),
                    rotate = new THREE.Quaternion(),
                    angle = Math.acos(rotateStart.dot(rotateEnd) / rotateStart.length() / rotateEnd.length());
                    if(angle){
                        axis.crossVectors(rotateStart, rotateEnd).normalize();
                        angle *= 0.5;
                        rotate.setFromAxisAngle(axis, angle);
                    }
                    return rotate;
            },
        };
        Controller.init(model, scene, camera);
        return Controller;
    }};
});

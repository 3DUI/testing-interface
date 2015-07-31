define(["three", "src/mouse_to_world", "src/rotation_helper"], function(THREE, MouseToWorld, RotationHelper){
    return {new: function(model, scene, camera){
        var Controller = {
            unhiddenOpacity: 0.3,
            rotatingOpacity: 0.5,
            radius: 4, // TODO: make this configurable 
            displayRadius: 4.50, 
            rotating: false,

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
                var realPos = RotationHelper.getRealPosition(mouseX, mouseY, dim, this.camera);
                if(this.shouldRotate(realPos)){ // disable rotating on z from the outside
                    var rotate = RotationHelper.rotateQuaternion(
                        RotationHelper.mapToSphere(this.initialMouse.x, this.initialMouse.y, this.radius),
                        RotationHelper.mapToSphere(realPos.x, realPos.y, this.radius));

                    RotationHelper.rotateModelByQuaternion(this.model, rotate); 
                    RotationHelper.rotateModelByQuaternion(this.rotationGuide, rotate); 
                } 
                this.initialMouse = realPos;
            },

            shouldRotate(realPos){
                return realPos.length() < this.displayRadius;
            },

            startRotation: function(initialMousePos, dim){
                this.rotating = true;
                this.initialMouse = RotationHelper.getRealPosition(initialMousePos[0], initialMousePos[1], dim, this.camera);
                this.setRotatingGuideOpacity(this.rotatingOpacity);
            },
            endRotation: function(){
                this.rotating = false;
                this.setRotatingGuideOpacity(this.unhiddenOpacity);
            },

            cursorType: function(mouseX, mouseY, dim){
                var realPos = RotationHelper.getRealPosition(mouseX, mouseY, dim, this.camera);
                if(this.rotating){
                    return "grabbing";
                }
                else if(this.shouldRotate(realPos)){
                    return "grab";
                } else {
                    return "";
                }
            },

            hideGuide: function(hide){
                if(hide){
                    this.setRotatingGuideOpacity(0);
                } else {
                    this.setRotatingGuideOpacity(this.unhiddenOpacity);
                }
            },

            setRotatingGuideOpacity: function(opacity){
                this.rotationGuide.material.opacity = opacity;
            },
        };
        Controller.init(model, scene, camera);
        return Controller;
    }};
});

define(["three", "src/mouse_to_world", "src/rotation_helper"], function(THREE, MouseToWorld, RotationHelper){
    return {new: function(model, scene, camera){
        var Controller = {
            unhiddenOpacity: 0.3,
            rotatingOpacity: 0.5,
            radius: 4, // TODO: make this configurable 

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
                if(realPos.length() < this.radius){ // disable rotating on z from the outside
                    var rotate = RotationHelper.rotateQuaternion(
                        RotationHelper.mapToSphere(this.initialMouse.x, this.initialMouse.y, this.radius),
                        RotationHelper.mapToSphere(realPos.x, realPos.y, this.radius));

                    RotationHelper.rotateModelByQuaternion(this.model, rotate); 
                    RotationHelper.rotateModelByQuaternion(this.rotationGuide, rotate); 
                } 
                this.initialMouse = realPos;
            },

            startRotation: function(initialMousePos, dim){
                this.initialMouse = RotationHelper.getRealPosition(initialMousePos[0], initialMousePos[1], dim, this.camera);
                this.setRotatingGuideOpacity(this.rotatingOpacity);
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

            endRotation: function(){
                this.setRotatingGuideOpacity(this.unhiddenOpacity);
            },

        };
        Controller.init(model, scene, camera);
        return Controller;
    }};
});

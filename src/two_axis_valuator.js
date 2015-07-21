define(["three", "src/rotation_helper"], function(THREE, RotationHelper){
    return {new: function(model, scene, camera){
        var Controller = {
            model: model,
            camera: camera,
            scene: scene,
            rotationGuideWidth: 2,
            radius: 4, // TODO: make this configurable
            rotationGuideColour: 0xffff00,
            rotationGuideColourRotating: 0xffffff,
            init: function(model, scene, camera){
                this.buildRotationGuides(scene);
            },

            buildRotationGuides: function(scene){
                    var segments = 64,
                    geometry = new THREE.CircleGeometry(this.radius, segments);
                geometry.vertices.shift(); // remove center

                this.rotationGuide = new THREE.Line(geometry, new THREE.LineBasicMaterial({
                        color: this.rotationGuideColour,
                        linewidth: this.rotationGuideWidth}));
                scene.add(this.rotationGuide);
            },

            rotateByAxis: function(realPos, axis){
                var rotationVec = RotationHelper.axes[axis],
                    angle = RotationHelper.sliderAngle(realPos, this.initialMouseReal, axis, this.radius);
                RotationHelper.rotateByAxisAngle(this.model, rotationVec, angle);
            },

            rotateByAxisSimple: function(realPos, axis){
                var rotationVec = RotationHelper.axes[axis],
                    angle = RotationHelper.sliderAngle(realPos, this.initialMouseReal, axis, this.radius);
                this.model.rotation[axis] += angle; 
            },

            updateRotation: function(mouseX, mouseY, dim){
                var realPos = RotationHelper.getRealPosition(mouseX, mouseY, dim, this.camera);
                if(realPos.length() >= this.radius){
                    this.rotateByAxis(realPos, "z");
                } else {
                    this.rotateByAxisSimple(realPos, "y");
                    this.rotateByAxisSimple(realPos, "x");
                }
                this.initialMouseReal = realPos;
            },

            startRotation: function(initialMousePos, dim){
                this.initialMouseReal = RotationHelper.getRealPosition(initialMousePos[0], initialMousePos[1], dim, this.camera);
                this.rotationGuide.material.color.setHex(this.rotationGuideColourRotating);
            },

            endRotation: function(){
                this.rotationGuide.material.color.setHex(this.rotationGuideColourRotating);
                this.rotationGuide.material.color.setHex(this.rotationGuideColour);
            },

            calcAngle: function(pos, initialPos, initialRot){
                return initialRot - ((initialPos - pos) * Math.PI * 2);
            }

        };
        Controller.init(model, scene, camera);
        return Controller;
    }};
});

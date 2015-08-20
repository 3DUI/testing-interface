define(["three", "dist/rotation_helper"], function(THREE, RotationHelper){
    return {new: function(model, scene, camera){
        var Controller = {
            model: model,
            camera: camera,
            scene: scene,
            rotationGuideWidth: 2,
            radius: 4, // TODO: make this configurable
            rotationGuideColour: 0xffff00,
            rotationGuideColourRotating: 0xffffff,
            rotating: false,
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
                    this.rotateByAxis(realPos, "y");
                    this.rotateByAxis(realPos, "x");
                }
                this.initialMouseReal = realPos;
            },

            cursorType: function(mouseX, mouseY, dim){
                if(this.rotating){
                    return "grabbing";
                } else {
                    return "grab";
                }
            },

            updateCursor: function(mouseX, mouseY, dim){
            },

            startRotation: function(initialMousePos, dim){
                this.rotating = true;
                this.initialMouseReal = RotationHelper.getRealPosition(initialMousePos[0], initialMousePos[1], dim, this.camera);
                this.rotationGuide.material.color.setHex(this.rotationGuideColourRotating);
            },

            endRotation: function(){
                this.rotating = false;
                this.rotationGuide.material.color.setHex(this.rotationGuideColourRotating);
                this.rotationGuide.material.color.setHex(this.rotationGuideColour);
            },
        };
        Controller.init(model, scene, camera);
        return Controller;
    }};
});

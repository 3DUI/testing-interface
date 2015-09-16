"use strict";

define(["three", "dist/rotation_helper"], function (THREE, RotationHelper) {
    return { "new": function _new(model, scene, camera) {
            var Controller = {
                model: model,
                camera: camera,
                scene: scene,
                rotationGuideWidth: 2,
                radius: 4, // TODO: make this configurable
                rotationGuideColour: 0xffff00,
                rotationGuideColourRotating: 0xffffff,
                rotating: false,
                init: function init(model, scene, camera) {
                    this.buildRotationGuides(scene);
                },

                buildRotationGuides: function buildRotationGuides(scene) {
                    var segments = 64,
                        geometry = new THREE.CircleGeometry(this.radius, segments);
                    geometry.vertices.shift(); // remove center

                    this.rotationGuide = new THREE.Line(geometry, new THREE.LineBasicMaterial({
                        color: this.rotationGuideColour,
                        linewidth: this.rotationGuideWidth }));
                    scene.add(this.rotationGuide);
                },

                rotateByAxis: function rotateByAxis(realPos, axis) {
                    var rotationVec = RotationHelper.axes[axis],
                        angle = RotationHelper.sliderAngle(realPos, this.initialMouseReal, axis, this.radius);
                    RotationHelper.rotateByAxisAngle(this.model, rotationVec, angle);
                },

                rotateByAxisSimple: function rotateByAxisSimple(realPos, axis) {
                    var rotationVec = RotationHelper.axes[axis],
                        angle = RotationHelper.sliderAngle(realPos, this.initialMouseReal, axis, this.radius);
                    this.model.rotation[axis] += angle;
                },

                updateRotation: function updateRotation(mouseX, mouseY, dim) {
                    var realPos = RotationHelper.getRealPosition(mouseX, mouseY, dim, this.camera);
                    if (realPos.length() >= this.radius) {
                        this.rotateByAxis(realPos, "z");
                    } else {
                        this.rotateByAxis(realPos, "y");
                        this.rotateByAxis(realPos, "x");
                    }
                    this.initialMouseReal = realPos;
                },

                cursorType: function cursorType(mouseX, mouseY, dim) {
                    if (this.rotating) {
                        return "grabbing";
                    } else {
                        return "grab";
                    }
                },

                updateCursor: function updateCursor(mouseX, mouseY, dim) {},

                startRotation: function startRotation(initialMousePos, dim) {
                    this.rotating = true;
                    this.initialMouseReal = RotationHelper.getRealPosition(initialMousePos[0], initialMousePos[1], dim, this.camera);
                    this.rotationGuide.material.color.setHex(this.rotationGuideColourRotating);
                },

                endRotation: function endRotation() {
                    this.rotating = false;
                    this.rotationGuide.material.color.setHex(this.rotationGuideColourRotating);
                    this.rotationGuide.material.color.setHex(this.rotationGuideColour);
                }
            };
            Controller.init(model, scene, camera);
            return Controller;
        } };
});
//# sourceMappingURL=two_axis_valuator.js.map

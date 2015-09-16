"use strict";

define(["three", "dist/mouse_to_world", "dist/rotation_helper"], function (THREE, MouseToWorld, RotationHelper) {
    return { "new": function _new(model, scene, camera) {
            var Controller = {
                unhiddenOpacity: 0.3,
                rotatingOpacity: 0.5,
                radius: 4, // TODO: make this configurable
                displayRadius: 5,
                rotating: false,

                init: function init(model, scene, camera) {
                    this.model = model;
                    this.camera = camera;
                    this.rotationGuide = this.buildRotationGuide();
                    scene.add(this.rotationGuide);
                },

                /**
                 * Create the sphere around the model
                 */
                buildRotationGuide: function buildRotationGuide() {
                    var sphereGeom = new THREE.SphereGeometry(this.radius, 64, 64),
                        wireframeMaterial = new THREE.MeshBasicMaterial({
                        color: 0xd3d3d3,
                        opacity: this.unhiddenOpacity,
                        transparent: true });
                    return new THREE.Mesh(sphereGeom.clone(), wireframeMaterial);
                },

                updateRotation: function updateRotation(mouseX, mouseY, dim) {
                    var realPos = RotationHelper.getRealPosition(mouseX, mouseY, dim, this.camera);
                    if (this.shouldRotate(realPos)) {
                        // disable rotating on z from the outside
                        var rotate = RotationHelper.rotateQuaternion(RotationHelper.mapToSphere(this.initialMouse.x, this.initialMouse.y, this.radius), RotationHelper.mapToSphere(realPos.x, realPos.y, this.radius));

                        RotationHelper.rotateModelByQuaternion(this.model, rotate);
                        RotationHelper.rotateModelByQuaternion(this.rotationGuide, rotate);
                    }
                    this.initialMouse = realPos;
                },

                shouldRotate: function shouldRotate(realPos) {
                    return realPos.length() < this.displayRadius;
                },

                startRotation: function startRotation(initialMousePos, dim) {
                    this.rotating = true;
                    this.initialMouse = RotationHelper.getRealPosition(initialMousePos[0], initialMousePos[1], dim, this.camera);
                    this.setRotatingGuideOpacity(this.rotatingOpacity);
                },
                endRotation: function endRotation() {
                    this.rotating = false;
                    this.setRotatingGuideOpacity(this.unhiddenOpacity);
                },

                cursorType: function cursorType(mouseX, mouseY, dim) {
                    var realPos = RotationHelper.getRealPosition(mouseX, mouseY, dim, this.camera);
                    if (this.rotating) {
                        return "grabbing";
                    } else if (this.shouldRotate(realPos)) {
                        return "grab";
                    } else {
                        return "";
                    }
                },

                hideGuide: function hideGuide(hide) {
                    if (hide) {
                        this.setRotatingGuideOpacity(0);
                    } else {
                        this.setRotatingGuideOpacity(this.unhiddenOpacity);
                    }
                },

                setRotatingGuideOpacity: function setRotatingGuideOpacity(opacity) {
                    this.rotationGuide.material.opacity = opacity;
                }
            };
            Controller.init(model, scene, camera);
            return Controller;
        } };
});
//# sourceMappingURL=arcball.js.map

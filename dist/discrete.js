"use strict";

define(["three", "dist/arcball", "dist/rotation_helper"], function (THREE, Arcball, RotationHelper) {
    return { "new": function _new(model, scene, camera) {
            var X_AXIS = "x";
            var Y_AXIS = "y";
            var Z_AXIS = "z";

            var Controller = {
                fudgeFactor: 0.1,
                radius: 4, //TODO: make this configurable

                fudgeZ: 0.95, // circles don't look like they touch due to perspective,
                // so we fudge the z a bit here
                displayRadius: 4.5,

                rotating: false,
                rotationGuideWidth: 2,

                init: function init(model, scene, camera) {
                    this.model = model;
                    this.camera = camera;
                    this.arcball = Arcball["new"](model, scene, camera);
                    this.arcball.hideGuide(true);
                    this.buildRotationGuides(scene);
                    this.rotationFunction = null;
                },

                /**
                 * Create the sphere around the model
                 */
                buildRotationGuides: function buildRotationGuides(scene) {
                    var segments = 64,
                        geometry = new THREE.CircleGeometry(this.radius, segments);
                    geometry.vertices.shift(); // remove center

                    this.rotationColour = {
                        x: 0xff0000,
                        y: 0x00ff00,
                        z: 0x0000ff
                    };

                    this.rotationGuides = {
                        y: new THREE.Line(geometry, new THREE.LineBasicMaterial({
                            color: this.rotationColour.y,
                            linewidth: this.rotationGuideWidth })),
                        x: new THREE.Line(geometry, new THREE.LineBasicMaterial({
                            color: this.rotationColour.x,
                            linewidth: this.rotationGuideWidth })),
                        z: new THREE.Line(geometry, new THREE.LineBasicMaterial({
                            color: this.rotationColour.z,
                            linewidth: this.rotationGuideWidth }))
                    };
                    scene.add(this.rotationGuides.x);
                    scene.add(this.rotationGuides.y);
                    scene.add(this.rotationGuides.z);

                    RotationHelper.rotateByAxisAngle(this.rotationGuides.y, RotationHelper.axes.x, Math.PI / 2);
                    RotationHelper.rotateByAxisAngle(this.rotationGuides.x, RotationHelper.axes.y, Math.PI / 2);
                    this.rotationGuides.z.position.z = this.fudgeZ;
                },

                iterateAlongAxis: function iterateAlongAxis(callback) {
                    [X_AXIS, Y_AXIS, Z_AXIS].forEach(callback);
                },

                updateRotation: function updateRotation(mouseX, mouseY, dim) {
                    var that = this;
                    if (this.rotating) {
                        this.rotationFunction(mouseX, mouseY, dim);
                    }
                },

                getRotateAlongAxisFn: function getRotateAlongAxisFn(axis) {
                    var that = this;

                    this.initialMouseReal = RotationHelper.snapToAxis(this.initialMouseReal, axis);
                    this.axisRotating = axis;
                    this.rotationGuides[axis].material.color.setHex(0xffffff);
                    return function (mouseX, mouseY, dim) {
                        var point = RotationHelper.getRealPosition(mouseX, mouseY, dim, that.camera);
                        var angle = RotationHelper.sliderAngle(point, that.initialMouseReal, axis, that.radius);
                        var rotationVec = RotationHelper.axes[axis];
                        RotationHelper.rotateByAxisAngle(that.model, rotationVec, angle);
                        that.initialMouseReal = point;
                    };
                },

                startRotation: function startRotation(initialMousePos, dim) {
                    this.initialMouseReal = RotationHelper.getRealPosition(initialMousePos[0], initialMousePos[1], dim, this.camera);
                    this.rotating = true;

                    // check whether they're clicking a slider
                    var cursorAxis = this.cursorOverAxis(this.initialMouseReal);
                    if (cursorAxis) {
                        this.rotationFunction = this.getRotateAlongAxisFn(cursorAxis);
                    } else {
                        this.arcball.startRotation(initialMousePos, dim);
                        this.arcball.hideGuide(false);
                        this.axisRotating = null;
                        this.rotationFunction = function (mouseX, mouseY, dim) {
                            return this.arcball.updateRotation(mouseX, mouseY, dim);
                        };
                    }
                },

                cursorOverAxis: function cursorOverAxis(realPos) {
                    if (RotationHelper.checkWithinFudge(realPos.x, this.fudgeFactor)) {
                        return X_AXIS;
                    } else if (RotationHelper.checkWithinFudge(realPos.y, this.fudgeFactor)) {
                        return Y_AXIS;
                    } else if (RotationHelper.checkWithinFudge(realPos.length() - this.displayRadius, 3 * this.fudgeFactor)) {
                        return Z_AXIS;
                    }
                    return null;
                },

                cursorOverArcball: function cursorOverArcball(realPos) {
                    return realPos.length() < this.displayRadius;
                },

                cursorType: function cursorType(mouseX, mouseY, dim) {
                    if (this.rotating) {
                        return "grabbing";
                    } else {
                        var realPos = RotationHelper.getRealPosition(mouseX, mouseY, dim, this.camera);
                        if (this.cursorOverAxis(realPos)) {
                            return "pointer";
                        } else if (this.cursorOverArcball(realPos)) {
                            return "grab";
                        } else {
                            return "";
                        }
                    }
                },

                endRotation: function endRotation() {
                    this.rotationFunction = null;
                    this.arcball.endRotation();
                    this.rotating = false;
                    if (this.axisRotating) {
                        this.rotationGuides[this.axisRotating].material.color.setHex(this.rotationColour[this.axisRotating]);
                        this.axisRotating = null;
                    }
                    this.arcball.hideGuide(true);
                }
            };
            Controller.init(model, scene, camera);
            return Controller;
        } };
});
//# sourceMappingURL=discrete.js.map

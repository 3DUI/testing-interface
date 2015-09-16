"use strict";

define(["three", "dist/mouse_to_world"], function (THREE, MouseToWorld) {
    return {
        epsilon: 0.000001,

        rotateModelByQuaternion: function rotateModelByQuaternion(model, rotate) {
            var currQuaternion = model.quaternion;
            currQuaternion.multiplyQuaternions(rotate, currQuaternion);
            currQuaternion.normalize();
            model.setRotationFromQuaternion(currQuaternion);
        },

        /**
         * Get the position of the mouse within the viewport rather than across the whole screen
         */
        actualPos: function actualPos(x, y, dim) {
            return new THREE.Vector2(x - dim.leftBound, y - dim.bottomBound);
        },

        sizeFor: function sizeFor(dim) {
            var width = dim.rightBound - dim.leftBound,
                height = dim.topBound - dim.bottomBound;
            return { width: width, height: height };
        },

        getRealPosition: function getRealPosition(mouseX, mouseY, dim, camera) {
            var actualPos = this.actualPos(mouseX, mouseY, dim),
                size = this.sizeFor(dim);
            return MouseToWorld(actualPos.x, actualPos.y, size.width, size.height, camera);
        },

        checkWithinRange: function checkWithinRange(val, min, max) {
            return val >= min && val <= max;
        },

        checkWithinFudge: function checkWithinFudge(val, fudgeFactor) {
            return this.checkWithinRange(val, -fudgeFactor, fudgeFactor);
        },

        axes: {
            x: new THREE.Vector3(1, 0, 0),
            y: new THREE.Vector3(0, 1, 0),
            z: new THREE.Vector3(0, 0, 1)
        },

        snapToAxis: function snapToAxis(pos, axis) {
            var point = new THREE.Vector2(pos.x, pos.y);
            if (axis == "y") {
                point.y = 0;
            } else if (axis == "x") {
                point.x = 0;
            } else {
                point.normalize();
            }
            return point;
        },

        positiveAngle: function positiveAngle(angle) {
            if (Math.sign(angle) == -1) {
                angle += Math.PI * 2;
            }
            return angle;
        },

        angleOfPointOnCircle: function angleOfPointOnCircle(point) {
            if (point.x === 0) {
                // either pi/2 or 3*pi/2
                if (point.y > 0) {
                    return Math.PI / 2;
                } else {
                    return Math.PI * 3 / 2;
                }
            } else {
                return Math.atan(point.y / point.x);
            }
        },

        // TODO: separate into different functions
        sliderAngle: function sliderAngle(point, initialPoint, axis, radius) {
            var angle = 0;
            point = this.snapToAxis(point, axis);
            initialPoint = this.snapToAxis(initialPoint, axis);
            if (axis == "x" || axis == "y") {
                var otherAxis = {
                    x: "y",
                    y: "x"
                };
                var delta = (initialPoint[otherAxis[axis]] - point[otherAxis[axis]]) / (radius * 2);
                angle = this.positiveAngle(Math.PI * delta);
                if (axis == "y") {
                    angle *= -1;
                }
            } else {
                var startAngle = this.angleOfPointOnCircle(initialPoint),
                    endAngle = this.angleOfPointOnCircle(point),
                    sign = Math.sign(endAngle - startAngle),
                    startPoint = new THREE.Vector3(initialPoint.x, initialPoint.y, 0),
                    endPoint = new THREE.Vector3(point.x, point.y, 0),
                    perp = new THREE.Vector3(),
                    dir;
                perp.crossVectors(startPoint, endPoint);
                dir = Math.sign(perp.dot(new THREE.Vector3(0, 0, 1)));
                if (this.equal(startAngle, endAngle)) {
                    window.log.debug("No change in angle found, setting angle to zero");
                    angle = 0;
                } else {
                    startPoint.normalize();
                    endPoint.normalize();
                    angle = Math.acos(startPoint.dot(endPoint));
                    if (dir == -1) {
                        // startAngle > endAngle => negative rotation
                        angle *= -1;
                    }
                }
            }
            if (!angle && angle !== 0) {
                window.log.warn("Angle not a number! Setting to 0");
                angle = 0;
            }
            return angle;
        },

        rotateByAxisAngle: function rotateByAxisAngle(model, axis, angle) {
            var quaternion = new THREE.Quaternion();
            quaternion.setFromAxisAngle(axis, angle);
            this.rotateModelByQuaternion(model, quaternion);
        },

        /**
         * Create a quaternion which will rotate a model orientated along the first vector
         * to be orientated along the second instead
         */
        rotateQuaternion: function rotateQuaternion(rotateStart, rotateEnd) {
            var axis = new THREE.Vector3(),
                rotate = new THREE.Quaternion(),
                angle = Math.acos(rotateStart.dot(rotateEnd) / rotateStart.length() / rotateEnd.length());
            if (angle) {
                axis.crossVectors(rotateStart, rotateEnd).normalize();
                rotate.setFromAxisAngle(axis, angle);
            }
            return rotate;
        },

        /**
         * Map the given position on a plane tangent to the sphere to a position on that sphere
         */
        mapToSphere: function mapToSphere(x, y, radius) {
            var pointOnSphere = new THREE.Vector3(x / radius, y / radius, 0),
                length = pointOnSphere.length();

            if (length >= 1) {
                pointOnSphere.normalize();
            } else {
                pointOnSphere.z = Math.sqrt(1.0 - length * length);
            }
            return pointOnSphere;
        },

        equal: function equal(a, b) {
            return this.checkWithinFudge(a - b, this.epsilon);
        }
    };
});
//# sourceMappingURL=rotation_helper.js.map

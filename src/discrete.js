define(["three", "src/arcball", "src/mouse_to_world"], function(THREE, Arcball, MouseToWorld){
    return {new: function(model, scene, camera){
        var Controller = {
            radius: 1.05,
            fudgeFactor: 0.1,
            rotating: false,

            init: function(model, scene, camera){
                this.model = model;
                this.camera = camera;
                this.arcball = Arcball.new(model, scene, camera);
                this.arcball.hideGuide(true);
                this.buildRotationGuides(scene);
                this.rotationFunction = null;
            },

            /**
             * Create the sphere around the model
             */
            buildRotationGuides: function(scene){
                    var segments = 64,
                    geometry = new THREE.CircleGeometry(this.radius, segments);
                geometry.vertices.shift(); // remove center

                this.rotationColour = {
                    x: 0xff0000,
                    y: 0x00ff00,
                    z: 0x0000ff 
                };

                this.rotationGuides = {
                    x: new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: this.rotationColour.x})),
                    y: new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: this.rotationColour.y})),
                    z: new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: this.rotationColour.z}))
                };
                // TODO: align rotation guides
                this.rotationGuides.x.rotation.x = Math.PI / 2;
                this.rotationGuides.y.rotation.y = Math.PI / 2;

                scene.add(this.rotationGuides.x);
                scene.add(this.rotationGuides.y);
                scene.add(this.rotationGuides.z);
            },

            updateRotation: function(mouseX, mouseY, dim){
                var that = this;
                if(this.rotating){
                    this.rotationFunction(mouseX, mouseY, dim);
                }
            },

            checkWithinRange: function(val, min, max){
                return val >= min && val <= max;
            },

            checkWithinFudge: function(val){
                return this.checkWithinRange(val, -this.fudgeFactor, this.fudgeFactor);
            },

            snapToAxis: function(pos, axis){
                if(axis == "x"){
                    pos.y = 0;
                } else if(axis == "y") {
                    pos.x = 0;
                } else {
                    pos.normalize(); 
                }
                return pos;
            },

            rotationVecs: {
                x: new THREE.Vector3(0,1,0),
                y: new THREE.Vector3(1,0,0),
                z: new THREE.Vector3(0,0,1)
            },

            getRotateAlongAxisFn: function(axis){
                var that = this;

                this.initialMouseReal = this.snapToAxis(this.initialMouseReal, axis);
                this.axisRotating = axis;
                this.rotationGuides[axis].material.color.setHex(0xffffff);
                return function(mouseX, mouseY, dim){
                    var point = that.snapToAxis(that.getRealPosition(mouseX, mouseY, dim), axis);
                    var delta = 0;
                    var rotationVec = that.rotationVecs[axis];
                    if(axis == "x" || axis == "y"){
                        delta = (that.initialMouseReal[axis] - point[axis])/that.radius;
                        window.log.debug("rotating x or y", delta, that.radius, that.initialMouseReal[axis], point[axis], that.initialMouseReal[axis] - point[axis]);
                    } else {
                        var startAngle = Math.atan(that.initialMouseReal.y / that.initialMouseReal.x),
                            endAngle = Math.atan(point.y / point.x);
                        delta = (endAngle - startAngle) / Math.PI;
                        window.log.debug(delta);
                    }
                    var angle = Math.PI * 2 * delta;
                    var quaternion = new THREE.Quaternion();
                    quaternion.setFromAxisAngle(rotationVec, angle);
                    that.arcball.rotateModelByQuaternion(that.model, quaternion);
                    that.initialMouseReal = point;
                };
            },

            getRealPosition: function(mouseX, mouseY, dim){
                var actualPos = this.arcball.actualPos(mouseX, mouseY, dim),
                    size = this.arcball.sizeFor(dim);
                return MouseToWorld(actualPos.x, actualPos.y, size.width, size.height, this.camera);
            },

            startRotation: function(initialMousePos, dim){
                this.initialMouseReal = this.getRealPosition(initialMousePos[0], initialMousePos[1], dim);
                // check that mouse is within an acceptable distance of the sliders
                if(this.initialMouseReal.length() > this.radius + this.fudgeFactor){
                    return;
                }

                this.rotating = true; 
                this.arcball.hideGuide(false);

                // check whether they're clicking a slider
                if(this.checkWithinFudge(this.initialMouseReal.y)){
                    this.rotationFunction = this.getRotateAlongAxisFn("x");
                    window.log.debug("ROTATING WITH Y"); 
                } else if (this.checkWithinFudge(this.initialMouseReal.x)){
                    this.rotationFunction = this.getRotateAlongAxisFn("y");
                    window.log.debug("ROTATING WITH X");
                } else if (this.checkWithinFudge(this.initialMouseReal.length() - this.radius)){
                    this.rotationFunction = this.getRotateAlongAxisFn("z");
                    window.log.debug("ROTATING WITH Z");
                } else {
                    this.arcball.startRotation(initialMousePos, dim);
                    this.axisRotating = null;
                    this.rotationFunction = function(mouseX, mouseY, dim){
                        return this.arcball.updateRotation(mouseX, mouseY, dim);
                    };
                    window.log.debug("ROTATING WITH ARCBALL");
                }
            },

            endRotation: function(){
                this.rotationFunction = null;
                this.arcball.endRotation();
                this.rotating = false;
                if(this.axisRotating){
                    this.rotationGuides[this.axisRotating].material.color.setHex(
                        this.rotationColour[this.axisRotating]
                    );
                    this.axisRotating = null;
                }
                this.arcball.hideGuide(true);
            },
        };
        Controller.init(model, scene, camera);
        return Controller;
    }};
});

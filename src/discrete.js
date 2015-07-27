define(["three", "src/arcball", "src/rotation_helper"], function(THREE, Arcball, RotationHelper){
    return {new: function(model, scene, camera){
        var Controller = {
            radius: 4, //TODO: make this configurable
            fudgeFactor: 0.1,
            fudgeZ: 0.95, // circles don't look like they touch due to perspective,
                         // so we fudge the z a bit here
            fudgeRadius: 0.50, 
            rotating: false,
            rotationGuideWidth: 2,

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
                    y: new THREE.Line(geometry, new THREE.LineBasicMaterial({
                        color: this.rotationColour.y,
                        linewidth: this.rotationGuideWidth})),
                    x: new THREE.Line(geometry, new THREE.LineBasicMaterial({
                        color: this.rotationColour.x,
                        linewidth: this.rotationGuideWidth})),
                    z: new THREE.Line(geometry, new THREE.LineBasicMaterial({
                        color: this.rotationColour.z,
                        linewidth: this.rotationGuideWidth})),
                };
                scene.add(this.rotationGuides.x);
                scene.add(this.rotationGuides.y);
                scene.add(this.rotationGuides.z);

                RotationHelper.rotateByAxisAngle(this.rotationGuides.y, RotationHelper.axes.x, Math.PI/2);
                RotationHelper.rotateByAxisAngle(this.rotationGuides.x, RotationHelper.axes.y, Math.PI/2);
                this.rotationGuides.z.position.z = this.fudgeZ;
            },

            iterateAlongAxis: function(callback){
                ["x", "y", "z"].forEach(callback);
            },

            updateRotation: function(mouseX, mouseY, dim){
                var that = this;
                if(this.rotating){
                    this.rotationFunction(mouseX, mouseY, dim);
                }
            },

            getRotateAlongAxisFn: function(axis){
                var that = this;

                this.initialMouseReal = RotationHelper.snapToAxis(this.initialMouseReal, axis);
                this.axisRotating = axis;
                this.rotationGuides[axis].material.color.setHex(0xffffff);
                return function(mouseX, mouseY, dim){
                    var point = RotationHelper.getRealPosition(mouseX, mouseY, dim, that.camera);
                    var angle = RotationHelper.sliderAngle(point, that.initialMouseReal, axis, that.radius);
                    var rotationVec = RotationHelper.axes[axis];
                    RotationHelper.rotateByAxisAngle(that.model, rotationVec, angle);
                    that.initialMouseReal = point;
                };
            },

            startRotation: function(initialMousePos, dim){
                this.initialMouseReal = RotationHelper.getRealPosition(initialMousePos[0], initialMousePos[1], dim, this.camera);
                this.rotating = true; 

                // check whether they're clicking a slider
                if(RotationHelper.checkWithinFudge(this.initialMouseReal.x, this.fudgeFactor)){
                    this.rotationFunction = this.getRotateAlongAxisFn("x");
                } else if (RotationHelper.checkWithinFudge(this.initialMouseReal.y, this.fudgeFactor)){
                    this.rotationFunction = this.getRotateAlongAxisFn("y");
                } else if (RotationHelper.checkWithinFudge(this.initialMouseReal.length() - this.radius - this.fudgeRadius, 3 * this.fudgeFactor)){
                    this.rotationFunction = this.getRotateAlongAxisFn("z");
                } else {
                    this.arcball.startRotation(initialMousePos, dim);
                    this.arcball.hideGuide(false);
                    this.axisRotating = null;
                    this.rotationFunction = function(mouseX, mouseY, dim){
                        return this.arcball.updateRotation(mouseX, mouseY, dim);
                    };
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

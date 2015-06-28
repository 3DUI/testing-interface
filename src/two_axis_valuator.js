define(["three"], function(THREE){
    return {new: function(model){
        var Controller = {
            model: model,
            updateRotation: function(mouseX, mouseY, dim){
                var normalised = this.normalise(mouseX, mouseY, dim);
                this.model.rotation.x = this.calcAngle(normalised[1], this.initialMouseY, this.initialXRot);
                this.model.rotation.y = this.calcAngle(normalised[0], this.initialMouseX, this.initialYRot);
            },

            startRotation: function(initialMousePos, dim){
                var normalised = this.normalise(initialMousePos[0], initialMousePos[1], dim);
                this.initialMouseX = normalised[0];
                this.initialMouseY = normalised[1];
                this.initialXRot = this.model.rotation.x;
                this.initialYRot = this.model.rotation.y;
            },

            endRotation: function(){
                this.initialXRot = 0;
                this.initialYRot = 0;
                this.initialMouseX = 0;
                this.initialMouseY = 0;
            },

            normalise: function(x, y, dim){
                var width = dim.rightBound - dim.leftBound,
                    height = dim.topBound - dim.bottomBound;
                return [(x - dim.leftBound)/width, (y - dim.bottomBound)/height];
            },

            calcAngle: function(pos, initialPos, initialRot){
                return initialRot - ((initialPos - pos) * Math.PI * 2);
            }

        };
        return Controller;
    }};
});

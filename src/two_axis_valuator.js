define(["three"], function(THREE){
    return {new: function(model){
        var Controller = {
            model: model,
            updateRotation: function(mouseX, mouseY, dim){
                var width = dim.rightBound - dim.leftBound,
                    height = dim.topBound - dim.bottomBound,
                    x = (mouseX - dim.leftBound)/width, // normalised co-ordinates
                    y = (mouseY - dim.bottomBound)/height, 
                    distX = this.initialMouseX - x, // distance from intial point
                    distY = this.initialMouseY - y, 
                    angX = distX * Math.PI * 2, // reduced according to scale
                    angY = distY * Math.PI * 2;
                this.model.rotation.x = this.initialXRot - angY;
                this.model.rotation.y = this.initialYRot - angX;
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
            },

            normalise: function(x, y, dim){
                var width = dim.rightBound - dim.leftBound,
                    height = dim.topBound - dim.bottomBound;
                return [(x - dim.leftBound)/width, (y - dim.bottomBound)/height];
            }

        };
        return Controller;
    }};
});

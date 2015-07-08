define(function(){
    return {new: function(model){
        var Controller = {
            model: model,
            updateRotation: function(mouseX, mouseY, dim){
            },

            startRotation: function(initialMousePos, dim){
            },

            endRotation: function(){
            },

            normalise: function(x, y, dim){
            },

            calcAngle: function(pos, initialPos, initialRot){
            }
        };
        return Controller;
    }};
});

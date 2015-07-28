define(function(){
    return {new: function(model){
        var Controller = {
            model: model,
            updateRotation: function(mouseX, mouseY, dim){
            },

            startRotation: function(initialMousePos, dim){
            },

            cursorType: function(mouseX, mouseY, dim){
                return null;
            },

            endRotation: function(){
            },
        };
        return Controller;
    }};
});

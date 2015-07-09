define(["three"], function(THREE){
    return {new: function(model, inputBus, rotationHandlerMaker){
        var ModelController = {
            rotationHandler: undefined,

           init: function(scene, camera){
               this.model = model;
               scene.add(this.model);
               this.rotationHandler = rotationHandlerMaker.new(this.model, scene, camera);
               camera.position.z = 10; // TODO: make configurable
           },
           inBounds: function(x, y){
               return x >= this.leftBound && x <= this.rightBound && 
                       y >= this.bottomBound && y <= this.topBound;
           },
           render: function(scene, camera, dim){
               this.leftBound = dim.scene.left;
               this.rightBound = this.leftBound + dim.scene.width; 
               this.bottomBound = dim.scene.bottom;
               this.topBound = this.bottomBound + dim.scene.height; 
           },
           mouseDownHandler: function(name, event){
               if(this.inBounds(event.clientX, event.clientY)){
                   this.mouseDown = true;
                   this.downMousePos = [event.clientX, event.clientY];
                   this.rotationHandler.startRotation(this.downMousePos, this.dim());
               }
           },
           mouseUpHandler: function(name, event){
               this.mouseDown = false;
               this.rotationHandler.endRotation();
           },
           mouseMoveHandler: function(name, event){
               if(this.mouseDown){
                   this.rotationHandler.updateRotation(event.clientX, event.clientY, this.dim()); 
               }
           },
           dim: function(){
               return {
                   leftBound: this.leftBound,
                   rightBound: this.rightBound,
                   bottomBound: this.bottomBound,
                   topBound: this.topBound,
               };
           },
           registerMouseHandlers: function(inputBus){
               var that = this;
               this.mouseDown = false;
               this.downMousePos = [0,0];
               inputBus.registerConsumer("down", this.modelId+"_rotateModelMouseDown", function(name, event){
                  that.mouseDownHandler(name, event); 
               });
               inputBus.registerConsumer("up", this.modelId+"_rotateModelMouseUp", function(name, event){
                  that.mouseUpHandler(name, event); 
               });
               inputBus.registerConsumer("move", this.modelId+"_rotateModelMouseMove", function(name, event){
                  that.mouseMoveHandler(name, event); 
               });
           },
        };

        var modelId = Math.floor(Math.random()*100000)
        ModelController.modelId = modelId;

        ModelController.registerMouseHandlers(inputBus); 

        return ModelController;
    }};
});

define(["three"], function(THREE){
    return {new: function(inputBus){
        var ModelController = {
           buildModel: function(id){
               if(id === 0){
                   var geometry = new THREE.BoxGeometry( 1, 1, 1 );
                   var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
                   return new THREE.Mesh( geometry, material );
               } else if (id === 1){
                    var cubeMaterialArray = [];
                    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff3333 } ) );
                    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff8800 } ) );
                    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xffff33 } ) );
                    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x33ff33 } ) );
                    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x3333ff } ) );
                    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x8833ff } ) );
                    var cubeMaterials = new THREE.MeshFaceMaterial( cubeMaterialArray );
                    var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
                    return new THREE.Mesh( cubeGeometry, cubeMaterials );
               }
           },
           init: function(scene, camera){
               this.model = this.buildModel(1);
               this.rotationHandler = {updateRotation:function(){}};
               scene.add( this.model );
               camera.position.z = 5;
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
               inputBus.registerConsumer("down", "rotateModelMouseDown", function(name, event){
                  that.mouseDownHandler(name, event); 
               });
               inputBus.registerConsumer("up", "rotateModelMouseUp", function(name, event){
                  that.mouseUpHandler(name, event); 
               });
               inputBus.registerConsumer("move", "rotateModelMouseMove", function(name, event){
                  that.mouseMoveHandler(name, event); 
               });
           },
           setRotationHandler: function(maker){
                this.rotationHandler = maker.new(this.model);
           },
        };

        ModelController.registerMouseHandlers(inputBus); 

        return ModelController;
    }};
});

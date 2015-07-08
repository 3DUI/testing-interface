define(["three", "src/build_scene", "src/model_rotation_controller"], function(THREE, SceneBuilder, ModelController){
    return function(){
        return {
            setId: function(id){this.loopId = id; return this;},
            setModelUrl: function(modelUrl){this.modelUrl = modelUrl; return this;},
            setInputBus: function(inputBus){this.inputBus = inputBus; return this;},
            setRotationBuilder: function(rotationBuilder){this.rotationBuilder = rotationBuilder; return this;},
            setView: function(view){this.view = view; return this;},
            setRenderLoop: function(renderLoop){this.renderLoop = renderLoop; return this;},
            fields: function(){
                return {
                    "loopId":this.loopId,
                    "modelUrl":this.modelUrl,
                    "inputBus":this.inputBus,
                    "rotationBuilder ":this.rotationBuilder,
                    "view":this.view,
                    "renderLoop":this.renderLoop,
                };
            },
            build: function(){
                var fields = this.fields();
                for(key in fields){
                    if(fields.hasOwnProperty(key)){
                        var value = fields[key];
                        if(value === undefined){
                            window.log.error("Not all fields defined in Build Rotation Scene", this.fields())
                            throw new Error("Not all fields defined.")
                        }
                    }
                }

                var that = this;
                var loader = new THREE.JSONLoader();
                loader.load(this.modelUrl, function(geometry, materials) {
                    var material = new THREE.MeshFaceMaterial(materials);
                    var model = new THREE.Mesh(geometry, material)
                    var controller = ModelController.new(model, that.inputBus, that.rotationBuilder);
                    var sceneBuilder = SceneBuilder.new();
                    sceneBuilder.init(that.view, controller);
                    that.renderLoop.addView(that.loopId, sceneBuilder);
                    window.log.debug("Fields", that.fields());
                });
            },
        };
    }
});

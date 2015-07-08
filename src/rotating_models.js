define(["src/render_loop", "src/mouse_input_bus", "src/two_axis_valuator", "src/arcball", "src/discrete", "src/dummy_rotation_handler", "src/build_rotation_scene"], function(RenderLoop, MouseInputBus, TwoAxisValuator, Arcball, Discrete, DummyRotationHandler, RotationSceneBuilder){
    return function(){
        var views = [{left:0,
                      btttom:0, 
                      width:0.5, 
                      height:1.0, 
                      background:new THREE.Color().setRGB( 0.5, 0.5, 0.7 )},
                     {left:0.5, 
                      bottom:0, 
                      width:0.5, 
                      height:1.0, 
                      background:new THREE.Color().setRGB( 0.5, 0.5, 0.5 )},
                     {left:0,
                      bottom:0,
                      height:1,
                      width:1,
                      background:new THREE.Color().setRGB( 0.7, 0.5, 0.7 )},
                      ];
        RenderLoop.init({widthScale: 1, heightScale:1, widthOffset:0, heightOffset:0},document.body);
        var inputBus = MouseInputBus("body");

        var setupScene = function(id, rotationBuilder){
            var builder = RotationSceneBuilder();
            builder.setModelUrl('mrt_model.json').setInputBus(inputBus).setRenderLoop(RenderLoop);
            builder.setId(id).setView(views[id]).setRotationBuilder(rotationBuilder).build();
        }
        setupScene(0, DummyRotationHandler);
        setupScene(1, Discrete);
        RenderLoop.start();
    };
});

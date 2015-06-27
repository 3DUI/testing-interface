define(["src/build_scene", "src/render_loop", "src/basic_model_rotation_controller", "src/mouse_input_bus", "src/two_axis_valuator"], function(SceneBuilder, RenderLoop, ModelController, MouseInputBus, TwoAxisValuator){
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
        var sceneBuilders = [];
        var inputBus = MouseInputBus("body");
        for(var i = 0; i < 2; i++){
            var view = views[i];
            var sceneBuilder = SceneBuilder.new();
            var controller = ModelController.new(inputBus);
            sceneBuilder.init(view, controller);
            sceneBuilders.push(sceneBuilder);
            RenderLoop.addView(i, sceneBuilder);
        }

        sceneBuilders[1].controller.setRotationHandler(TwoAxisValuator);

        RenderLoop.start();
    };
});

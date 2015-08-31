define(["dist/build_scene", "dist/render_loop", "dist/basic_cube_controller", "dist/mouse_input_bus"], function(SceneBuilder, RenderLoop, CubeController, MouseInputBus){
    return function(){
        var views = [{left:0,
                      bottom:0, 
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
        for(var i = 0; i < 2; i++){
            var view = views[i];
            var sceneBuilder = SceneBuilder.new();
            var controller = CubeController.new();
            sceneBuilder.init(view, controller);
            sceneBuilders.push(sceneBuilder);
            RenderLoop.addView(i, sceneBuilder);
        }

        var render_single = function(){
            RenderLoop.removeView(1);
            sceneBuilders[0].changeView(views[2]);
            setTimeout(render_split, 10000);
        };

        var render_split = function(){
            RenderLoop.addView(1, sceneBuilders[1]);
            sceneBuilders[0].changeView(views[0]);
            setTimeout(render_single, 10000);
        };

        RenderLoop.start();
        render_single();

        var inputBus = MouseInputBus("body");

        var mouseDownListener = function(name, event){
        };

        inputBus.registerConsumer("down", "saveLog", mouseDownListener);
    };
});

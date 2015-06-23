requirejs(["src/build_scene", "src/render_loop", "src/basic_cube_controller"], function(SceneBuilder, RenderLoop, CubeController){
    var views = [{left:0,
                  bottom:0, 
                  width:0.5, 
                  height:1.0, 
                  background:new THREE.Color().setRGB( 0.5, 0.5, 0.7 )},
                 {left:0.5, 
                  bottom:0, 
                  width:0.5, 
                  height:1.0, 
                  background:new THREE.Color().setRGB( 0.5, 0.5, 0.5 )}]

    RenderLoop.init(RenderLoop.buildUpdateSizeFn(1,1,0,0), document.body);

    for(var i = 0; i < 2; i++){
        var view = views[i];
        var sceneBuilder = SceneBuilder.new();
        var controller = CubeController.new();
        sceneBuilder.init(view, controller);
        RenderLoop.addView(i, sceneBuilder)
    }

    RenderLoop.start();
});

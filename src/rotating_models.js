define(["jquery", "src/render_loop", "src/mouse_input_bus", "src/two_axis_valuator", "src/arcball", "src/discrete", "src/dummy_rotation_handler", "src/build_rotation_scene"], function($, RenderLoop, MouseInputBus, TwoAxisValuator, Arcball, Discrete, DummyRotationHandler, RotationSceneBuilder){
    return function(){


        var views = {ref: {left:0,
                      bottom:0, 
                      width:0.5, 
                      height:1.0, 
                      background:new THREE.Color().setRGB( 0.5, 0.5, 0.7 )},
                     player: {left:0.5, 
                      bottom:0, 
                      width:0.5, 
                      height:1.0, 
                      background:new THREE.Color().setRGB( 0.5, 0.5, 0.5 )},
                     full: {left:0,
                      bottom:0,
                      height:1,
                      width:1,
                      background:new THREE.Color().setRGB( 0.7, 0.5, 0.7 )},
                      };

        var inputBus = MouseInputBus("body"),
            setupScene = function(id, rotationBuilder, task){
               inputBus.deregisterConsumer("down", id+"_rotateModelMouseDown");
               inputBus.deregisterConsumer("up", id+"_rotateModelMouseUp");
               inputBus.deregisterConsumer("move", id+"_rotateModelMouseMove");           
                var builder = RotationSceneBuilder();
                builder.setModelUrl('models/mrt_model.json').setInputBus(inputBus).setRenderLoop(RenderLoop);
                return builder.setId(id).setView(views[id]).setRotationBuilder(rotationBuilder).build(
                    function(controller){
                        var rot = controller.model.rotation;
                        rot.x = task[id + "_orientation"][0]
                        rot.y = task[id + "_orientation"][1]
                        rot.z = task[id + "_orientation"][2]
                    }
                );
            },
            setupScenes = function(i, tasks){
               var task = tasks[i];
               RenderLoop.removeView("ref");
               RenderLoop.removeView("player");
               setupScene("ref", DummyRotationHandler, task);
               setupScene("player", Discrete, task);
            },

            nextTask = function(i, tasks){
                console.log("next task", i, tasks);
                if(i != tasks.length){
                    setupScenes(i, tasks);
                    setTimeout(function(){
                        nextTask(i+1, tasks)
                    }, 1000);
                }
            };
            
        RenderLoop.init({widthScale: 1, heightScale:1, widthOffset:0, heightOffset:0},document.body);
        RenderLoop.start();

        $.getJSON("tasks/orientation_tasks.json", function(data) {
            nextTask(0, data);
        });
    };
});

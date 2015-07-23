// TODO: break this up into smaller modules
define(["jquery", "src/render_loop", "src/mouse_input_bus", "src/two_axis_valuator", "src/arcball", "src/discrete", "src/dummy_rotation_handler", "src/build_rotation_scene", "src/user_feedback"], function($, RenderLoop, MouseInputBus, TwoAxisValuator, Arcball, Discrete, DummyRotationHandler, RotationSceneBuilder, UserFeedback){
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
        var playerController = Discrete,
            playerControllerName = "Discrete",
            inputBus = MouseInputBus("body"),
            setupScene = function(id, rotationBuilder, task, view){
               inputBus.deregisterConsumer("down", id+"_rotateModelMouseDown");
               inputBus.deregisterConsumer("up", id+"_rotateModelMouseUp");
               inputBus.deregisterConsumer("move", id+"_rotateModelMouseMove");           
                var builder = RotationSceneBuilder();
                builder.setModelUrl(task.model).setInputBus(inputBus).setRenderLoop(RenderLoop);
                return builder.setId(id).setView(view).setRotationBuilder(rotationBuilder).build(
                    function(controller){
                        var rot = controller.model.rotation;
                        rot.x = task[id + "_orientation"][0];
                        rot.y = task[id + "_orientation"][1];
                        rot.z = task[id + "_orientation"][2];
                        controllers[id] = controller;
                    }
                );
            },
            setupScenes = function(i, tasks){
               var task = tasks[i];
               RenderLoop.removeView("ref");
               RenderLoop.removeView("player");
               if(task.type === "orientation"){
                   setupScene("ref", DummyRotationHandler, task, views.ref);
                   setupScene("player", playerController, task, views.player);
               } else if(task.type === "inspection"){
                   setupScene("player", playerController, task, views.full);
               }
            },

            controllers = {},
            i = 0,

            loadTask = function(tasks){
                if(i < tasks.length){
                    console.log("next task", i, tasks);
                    setupScenes(i, tasks);
                    UserFeedback(i, tasks, playerControllerName);
                    return true;
                }
                return false;
            },
    
            nextTask = function(tasks){
                i++;
                if(i == tasks.length){
                    i = 0; // TODO: have a dialogue here rather than just looping
                }
                loadTask(tasks);
            },

            loadRotationController = function(controller, name, tasks){
                playerController = controller;
                playerControllerName = name;
                loadTask(tasks);
            };

            
        RenderLoop.init({widthScale: 1, heightScale:1, widthOffset:0, heightOffset:0}, document.getElementById("three"));
        RenderLoop.start();

        $.getJSON("tasks/mixed_tasks.json", function(data) {
            $("#save").click(function(){
                var rotation = controllers.player.model.rotation;
                window.log.saveLog("saving user task", JSON.stringify(data[i]), JSON.stringify([rotation.x, rotation.y, rotation.z]));
                nextTask(data);
            });
            $("#reload").click(function(){
                window.log.debug("reload","task", data[i], "orientation", controllers.player.model.rotation);
                loadTask(data);
            });
            // TODO: only show these via flags
            $("#discrete").click(function(){
                loadRotationController(Discrete, "Discrete Sliders", data);
            });
            $("#two-axis").click(function(){
                loadRotationController(TwoAxisValuator, "Two Axis Valuator", data);
            });
            $("#arcball").click(function(){
                loadRotationController(Arcball, "Arcball", data);
            });
            loadTask(data);
        });
    };
});
// TODO: define all HTML on page with react components

// TODO: break this up into smaller modules
define(["jquery", "dist/render_loop", "dist/mouse_input_bus", "dist/two_axis_valuator", "dist/arcball", "dist/discrete", "dist/dummy_rotation_handler", "dist/build_rotation_scene", "dist/user_feedback", "dist/timer", "react"], function($, RenderLoop, MouseInputBus, TwoAxisValuator, Arcball, Discrete, DummyRotationHandler, RotationSceneBuilder, UserFeedback, Timer, React){
    return function(callback){
        $("#experiment").show();
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
        var playerController,
            playerControllerName,
            timer = new Timer("#timer"),
            inputBus = MouseInputBus("#three"),
            controllers = {},
            i = 0,

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
            showLabels = function(showOrientation){
                var hideId,
                    showId,
                    orientation = "#orientation-labels",
                    inspection = "#inspection-labels";
                if(showOrientation){
                    hideId = inspection;
                    showId = orientation;
                } else {
                    hideId = orientation;
                    showId = inspection;
                }
                $(hideId).hide();
                $(showId).show();
            },
            setupScenes = function(i, tasks){
               var task = tasks[i];
               RenderLoop.removeView("ref");
               RenderLoop.removeView("player");
               if(task.type === "orientation"){
                   setupScene("ref", DummyRotationHandler, task, views.ref);
                   setupScene("player", playerController, task, views.player);
                   showLabels(true);
               } else if(task.type === "inspection"){
                   setupScene("player", playerController, task, views.full);
                   showLabels(false);
               }
            },


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
                    teardown();
                    callback();
                }
                loadTask(tasks);
            },

            loadRotationController = function(rotationController, tasks){
                playerController = rotationController.controller;
                playerControllerName = rotationController.name;
                enable_buttons();
                disable_button(rotationController);
                if(tasks){
                    loadTask(tasks);
                }
            },
            rotationControllers = {
                discrete: {id:"#discrete", controller: Discrete, name: "Discrete Sliders"},
                twoaxis: {id:"#two-axis", controller: TwoAxisValuator, name: "Two Axis Valuator"},
                arcball: {id:"#arcball", controller: Arcball, name: "Arcball"}
            },
            enable_buttons = function(){
                for(var key in rotationControllers){
                    if(rotationControllers.hasOwnProperty(key)){
                        $(rotationControllers[key].id).prop("disabled", false);
                    }
                }
            },
            disable_button = function(rotationController){
                $(rotationController.id).prop("disabled", true);
            },
            teardown = function(){
               React.render(
                 <h1>Hello, world!</h1>,
                 document.getElementById('experiment')
               );
            };
        loadRotationController(rotationControllers.discrete);

        RenderLoop.init({widthScale: 1, heightScale:0.7, widthOffset:0, heightOffset:0}, document.getElementById("three"));
        RenderLoop.start();
        timer.start();
        $.getJSON("tasks/mixed_tasks.json", function(data) {
            $("#save").click(function(){
                timer.stop();
                var rotation = controllers.player.model.rotation;
                window.log.saveLog("saving user task", JSON.stringify(data[i]), JSON.stringify([rotation.x, rotation.y, rotation.z]), timer.time);
                nextTask(data);
                timer.start();
            });
            $("#reload").click(function(){
                window.log.debug("reload","task", data[i], "orientation", controllers.player.model.rotation);
                loadTask(data);
            });
            // TODO: only show these via flags
            for(var key in rotationControllers){
                if(rotationControllers.hasOwnProperty(key)){
                    (function(key){
                        var rotationController = rotationControllers[key]
                        $(rotationController.id).click(function(){
                            loadRotationController(rotationController, data);
                        });
                    })(key)
                }
            }
            loadTask(data);
        });
    };
});
// TODO: define all HTML on page with react components

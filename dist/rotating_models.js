// TODO: break this up into smaller modules
// TODO: make this a react component
"use strict";

define(["jquery", "dist/render_loop", "dist/mouse_input_bus", "dist/two_axis_valuator", "dist/arcball", "dist/discrete", "dist/dummy_rotation_handler", "dist/build_rotation_scene", "dist/user_feedback", "dist/timer", "react", "dist/experiment_ui", "dist/name_map"], function ($, RenderLoop, MouseInputBus, TwoAxisValuator, Arcball, Discrete, DummyRotationHandler, RotationSceneBuilder, UserFeedback, Timer, React, ExperimentUI, NameMap) {
    return function (callback, experiment) {
        React.render(React.createElement(ExperimentUI, {
            timed: experiment.limit ? "true" : "false",
            title: experiment.title }), document.getElementById("content"));
        var views = { ref: { left: 0,
                bottom: 0,
                width: 0.5,
                height: 1.0,
                background: new THREE.Color().setRGB(0.5, 0.5, 0.7) },
            player: { left: 0.5,
                bottom: 0,
                width: 0.5,
                height: 1.0,
                background: new THREE.Color().setRGB(0.5, 0.5, 0.5) },
            full: { left: 0,
                bottom: 0,
                height: 1,
                width: 1,
                background: new THREE.Color().setRGB(0.7, 0.5, 0.7) }
        };
        var playerController,
            highlightedColour = 0xff0000,
            playerControllerName,
            inputBus = MouseInputBus("#three"),
            controllers = {},
            i = 0,
            // TODO: remove
        totalTasksCompleted = 0,
            totalTasks = 0,
            currentGroup = -1,
            currentIndex,
            possibleIndices = [],
            // TODO

        setupScene = function setupScene(id, rotationBuilder, task, view) {
            inputBus.deregisterConsumer("down", id + "_rotateModelMouseDown");
            inputBus.deregisterConsumer("up", id + "_rotateModelMouseUp");
            inputBus.deregisterConsumer("move", id + "_rotateModelMouseMove");
            var builder = RotationSceneBuilder();
            builder.materialsCallback = function (materials) {
                return materials;
            };
            builder.setModelUrl(task.type === "orientation" ? experiment.orientationModelUrl : task.model).setInputBus(inputBus).setRenderLoop(RenderLoop);
            return builder.setId(id).setView(view).setRotationBuilder(rotationBuilder).build(function (controller) {
                var rot = controller.model.rotation;
                rot.x = task[id + "_orientation"][0];
                rot.y = task[id + "_orientation"][1];
                rot.z = task[id + "_orientation"][2];
                controllers[id] = controller;
                if (task.type === "inspection") {
                    controller.drawCrosshairs();
                }
            });
        },
            showLabels = function showLabels(showOrientation) {
            var hideId,
                showId,
                orientation = "#orientation-labels",
                inspection = "#inspection-labels";
            if (showOrientation) {
                hideId = inspection;
                showId = orientation;
            } else {
                hideId = orientation;
                showId = inspection;
            }
            $(hideId).hide();
            $(showId).show();
        },
            //TODO: set this to state in the react component
        setupScenes = function setupScenes(task) {
            RenderLoop.removeView("ref");
            RenderLoop.removeView("player");
            if (task.type === "orientation") {
                setupScene("ref", DummyRotationHandler, task, views.ref);
                setupScene("player", playerController, task, views.player);
                showLabels(true);
            } else if (task.type === "inspection") {
                setupScene("player", playerController, task, views.full);
                showLabels(false);
            }
        },
            loadTask = function loadTask(tasks, group, index) {
            window.log.debug("Loading tasks", tasks, group, index);
            // TODO: MAKE IT SO WE DON'T HAVE TO DO THIS
            if (group == -1) {
                return nextTask(tasks, true);
            }
            var task;
            if (group < tasks.length && index < tasks[group].length) {
                task = tasks[group][index];
                setupScenes(task);
                UserFeedback(experiment.title, task, totalTasksCompleted, totalTasks, playerControllerName);
                return true;
            }
            return false;
        },
            shuffle = function shuffle(arr) {
            for (var i = arr.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
            return arr;
        },
            nextTask = function nextTask(tasks, notCompleted) {
            if (!notCompleted) {
                totalTasksCompleted++;
            }
            if (possibleIndices.length == 0) {
                currentGroup++;
                if (currentGroup == tasks.length) {
                    if (experiment.limit) {
                        totalTasksCompleted = 0;
                        currentGroup = 0;
                    } else {
                        teardown();
                        return;
                    }
                }
                var numTasks = tasks[currentGroup].length,
                    indices = [];
                for (var i = 0; i < numTasks; i++) {
                    indices.push(i);
                }
                possibleIndices = shuffle(indices);
                window.log.debug("Set possible indices to", possibleIndices);
            }
            currentIndex = possibleIndices.pop();
            loadTask(tasks, currentGroup, currentIndex);
        },
            loadRotationController = function loadRotationController(rotationController, tasks) {
            playerController = rotationController.controller;
            playerControllerName = rotationController.name;
            enable_buttons();
            disable_button(rotationController);
            if (tasks) {
                loadTask(tasks, currentGroup, currentIndex);
            }
        },
            rotationControllers = {
            discrete: { id: "#discrete", controller: Discrete, name: NameMap("discrete") },
            twoaxis: { id: "#two-axis", controller: TwoAxisValuator, name: NameMap("twoaxis") },
            arcball: { id: "#arcball", controller: Arcball, name: NameMap("arcball") }
        },
            enable_buttons = function enable_buttons() {
            for (var key in rotationControllers) {
                if (rotationControllers.hasOwnProperty(key)) {
                    $(rotationControllers[key].id).prop("disabled", false);
                }
            }
        },
            disable_button = function disable_button(rotationController) {
            $(rotationController.id).prop("disabled", true);
        },
            // TODO: have this as logic in the buttons react component thing
        teardown = function teardown() {
            timer.stop();
            React.unmountComponentAtNode(document.getElementById('content'));
            inputBus.teardown();
            callback();
        },
            countAndSetTotal = function countAndSetTotal(tasks) {
            for (var i = 0; i < tasks.length; i++) {
                for (var j = 0; j < tasks[i].length; j++) {
                    totalTasks++;
                }
            }
        },
            limitCallback = experiment.limit ? teardown : undefined,
            timer = new Timer("#timer", experiment.limit, limitCallback);

        // SETUP UI;
        loadRotationController(rotationControllers[experiment.controllerKey]);

        RenderLoop.init({ widthScale: 1, heightScale: 0.7, widthOffset: 0, heightOffset: 0 }, document.getElementById("three"));
        RenderLoop.start();
        timer.start();
        $.getJSON(experiment.taskUrl, function (data) {
            countAndSetTotal(data);
            $("#save").click(function () {
                var rotation = controllers.player.model.rotation;
                var quaternion = controllers.player.model.quaternion;
                window.log.saveLog("saving user task", currentGroup, currentIndex, [rotation.x, rotation.y, rotation.z], [quaternion.x, quaternion.y, quaternion.z, quaternion.w], timer.time);
                nextTask(data);
            });
            $("#reload").click(function () {
                window.log.debug("reload", "task", data[i], "orientation", controllers.player.model.rotation);
                loadTask(data, currentGroup, currentIndex);
            });
            for (var key in rotationControllers) {
                if (rotationControllers.hasOwnProperty(key)) {
                    (function (key) {
                        var rotationController = rotationControllers[key];
                        $(rotationController.id).click(function () {
                            loadRotationController(rotationController, data);
                        });
                    })(key);
                }
            }
            loadTask(data, currentGroup, currentIndex);
        });
    };
});
//# sourceMappingURL=rotating_models.js.map

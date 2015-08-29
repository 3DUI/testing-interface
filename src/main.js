requirejs(["dist/logger", "dist/capture_participant_details", "dist/uuid", "dist/before_unload", "dist/generate_task","dist/pipeline","dist/rotating_models","dist/confirm_ready", "jquery", "dist/render_manual", "dist/final_screen"], function(Logger, CaptureParticipantDetails, generateUUID, BeforeUnloadController, GenerateTask, Pipeline, RotatingModels, ConfirmReady, $, RenderManual, FinalScreen){
    window.log = Logger;
    window.log.header = "3DUI";
    window.log.meta.uuid = generateUUID();
    if (document.location.hostname !== "localhost"){
       BeforeUnloadController.stopUnload();
    }

    var addExperiment = function(index, experimentConfig){
        (function(experimentIndex, config){
            Pipeline.add(function(callback){
                var experiment = window.log.meta.experimentDesign,
                    controllers = experiment.controllers,
                    models = experiment.models;
                RotatingModels(callback,{
                    title: config.title, 
                    taskUrl: config.taskUrl,
                    orientationModelUrl: models[experimentIndex],
                    inspectionModelUrl: "models/ico_sphere_model.json",
                    controllerKey: controllers[experimentIndex],
                    limit: config.limit})});
        })(index, experimentConfig);
    }

    var addConfirmation = function(i){
        (function(index){
            Pipeline.add(function(callback){
               ConfirmReady(window.log.meta.experimentDesign.controllers[index], callback);   
            });
        })(i);
    }

    var addControllerManual = function(i){
        var manual = {
            discrete: "documentation/discrete.md",
            twoaxis: "documentation/two_axis.md",
            arcball: "documentation/arcball.md"
        };
        (function(index){
            Pipeline.add(function(callback){
                var controllerName = window.log.meta.experimentDesign.controllers[index],
                    manualUrl = manual[controllerName];
                $.get(manualUrl, function( data ) {
                   RenderManual(data, callback); 
                });
            });
        })(i);
    }

    var addManual = function(manualUrl){
        Pipeline.add(function(callback){
            $.get(manualUrl, function(data){
                RenderManual(data, callback);
            });
        });
    }

    Pipeline.finalNode = FinalScreen;
    Pipeline.add(CaptureParticipantDetails);
    addManual("documentation/experiment.md");
    addManual("documentation/controllers.md");
    for(var i = 0; i < 3; i++){
        addControllerManual(i);
        addExperiment(i, 
            {title: "Training",
             taskUrl:"tasks/training_tasks.json",
             limit: 10000});
        addConfirmation(i);
        addExperiment(i, 
            {title: "Evaluation",
             taskUrl:"tasks/mixed_tasks.json",
             limit: undefined});
    }
    Pipeline.runNext();
    window.genTask = GenerateTask;
});

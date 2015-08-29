requirejs(["dist/logger", "dist/capture_participant_details", "dist/uuid", "dist/before_unload", "dist/generate_task","dist/pipeline","dist/rotating_models","dist/confirm_ready"], function(Logger, CaptureParticipantDetails, generateUUID, BeforeUnloadController, GenerateTask, Pipeline, RotatingModels, ConfirmReady){
    window.log = Logger;
    window.log.header = "3DUI";
    window.log.meta.uuid = generateUUID();
    if (document.location.hostname !== "localhost"){
       BeforeUnloadController.stopUnload();
    }
    Pipeline.add(CaptureParticipantDetails);

    var addExperiment = function(index, experimentConfig){
        (function(experimentIndex, config){
            Pipeline.add(function(callback){
                var experiment = window.log.meta.experimentDesign,
                    controllers = experiment.controllers,
                    models = experiment.models;
                RotatingModels(callback,{
                    title: config.title, 
                    taskUrl: "tasks/mixed_tasks.json", // TODO: USE DIFFERENT TASKS
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

    for(var i = 0; i < 3; i++){
        addExperiment(i, 
            {title: "Training",
             limit: 5000});
        addConfirmation(i)
        addExperiment(i, 
            {title: "Evaluation",
             limit: undefined});
    }
    Pipeline.runNext();
    window.genTask = GenerateTask;
});

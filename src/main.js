requirejs(["dist/logger", "dist/capture_participant_details", "dist/uuid", "dist/before_unload", "dist/generate_task","dist/pipeline","dist/rotating_models"], function(Logger, CaptureParticipantDetails, generateUUID, BeforeUnloadController, GenerateTask, Pipeline, RotatingModels){
    window.log = Logger;
    window.log.header = "3DUI";
    window.log.meta.uuid = generateUUID();
    if (document.location.hostname !== "localhost"){
       BeforeUnloadController.stopUnload();
    }
    Pipeline.add(CaptureParticipantDetails);
    for(var i = 0; i < 3; i++){
        var configs = [
            {title: "Training",
             limit: 10000},
            {title: "Evaluation",
             limit: undefined}
        ];
        for(var j = 0; j < 2; j++){
            (function(experimentIndex, configIndex){
                Pipeline.add(function(callback){
                    var config = configs[configIndex],
                        experiment = window.log.meta.experimentDesign,
                        controllers = experiment.controllers,
                        models = experiment.models;
                    RotatingModels(callback,{
                        title: config.title, 
                        taskUrl: "tasks/mixed_tasks.json", // TODO: USE DIFFERENT TASKS
                        orientationModelUrl: models[experimentIndex],
                        inspectionModelUrl: "models/ico_sphere_model.json",
                        controllerKey: controllers[experimentIndex],
                        limit: config.limit})});
            })(i,j);
        }
    }
    Pipeline.runNext();
    window.genTask = GenerateTask;
});

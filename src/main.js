requirejs(["dist/logger", "dist/capture_participant_details", "dist/uuid", "dist/before_unload", "dist/generate_task","dist/pipeline","dist/rotating_models"], function(Logger, CaptureParticipantDetails, generateUUID, BeforeUnloadController, GenerateTask, Pipeline, RotatingModels){
    window.log = Logger;
    window.log.header = "3DUI";
    window.log.meta.uuid = generateUUID();
    if (document.location.hostname !== "localhost"){
       BeforeUnloadController.stopUnload();
    }
    Pipeline.add(CaptureParticipantDetails);
    Pipeline.add(function(callback){ RotatingModels(callback, "Training for Discrete", "tasks/mixed_tasks.json", "discrete", 10000)});
    Pipeline.add(function(callback){ RotatingModels(callback, "Evaluating Discrete", "tasks/mixed_tasks.json", "discrete")});
    Pipeline.runNext();
    window.genTask = GenerateTask;
});

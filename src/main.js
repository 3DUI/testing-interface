requirejs(["src/logger", "src/capture_participant_details", "src/uuid", "src/before_unload", "src/generate_task","src/pipeline","src/rotating_models"], function(Logger, CaptureParticipantDetails, generateUUID, BeforeUnloadController, GenerateTask, Pipeline, RotatingModels){
    window.log = Logger;
    window.log.header = "3DUI";
    window.log.meta.uuid = generateUUID();
    if (document.location.hostname !== "localhost"){
       BeforeUnloadController.stopUnload();
    }
    Pipeline.add(CaptureParticipantDetails);
    Pipeline.add(RotatingModels)
    Pipeline.runNext();
    window.genTask = GenerateTask;
});

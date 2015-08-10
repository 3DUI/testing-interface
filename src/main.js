requirejs(["src/logger", "src/capture_participant_details", "src/uuid", "src/before_unload", "src/generate_task"], function(Logger, CaptureParticipantDetails, generateUUID, BeforeUnloadController, GenerateTask){
    window.log = Logger;
    window.log.header = "3DUI";
    window.log.meta.uuid = generateUUID();
    if (document.location.hostname !== "localhost"){
       BeforeUnloadController.stopUnload();
    }
    CaptureParticipantDetails();
    window.genTask = GenerateTask;
});

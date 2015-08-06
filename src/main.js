requirejs(["src/logger", "src/capture_participant_details", "src/uuid", "src/before_unload"], function(Logger, CaptureParticipantDetails, generateUUID, BeforeUnloadController){
    window.log = Logger;
    window.log.header = "3DUI";
    window.log.meta.uuid = generateUUID();
    if (document.location.hostname !== "localhost"){
       BeforeUnloadController.stopUnload();
    }
    CaptureParticipantDetails();
});

requirejs(["src/logger", "src/capture_participant_details", "src/uuid"], function(Logger, CaptureParticipantDetails, generateUUID){
    window.log = Logger;
    window.log.header = "3DUI";
    window.log.meta.uuid = generateUUID();
    CaptureParticipantDetails();
});

requirejs(["dist/logger", "dist/uuid", "dist/before_unload", "dist/generate_task", "Keypress", "dist/experimental_pipeline"], function(Logger, generateUUID, BeforeUnloadController, GenerateTask, Keypress, ExperimentalPipeline){
    window.log = Logger;
    window.log.header = "3DUI";
    window.log.meta.uuid = generateUUID();
    if (document.location.hostname !== "localhost"){
       BeforeUnloadController.stopUnload();
    }

    window.genTask = GenerateTask;

    var listener = new Keypress.Listener();
    listener.simple_combo("control shift c", function() {
        window.log.saveLog("Report issued");
    });

    listener.simple_combo("control shift v", function() {
        window.log.saveLog("Timer killed");
        window.timer.kill();
    });
    
    console.log("main",ExperimentalPipeline)
    var experimentalPipeline = new ExperimentalPipeline();
    experimentalPipeline.start();
});

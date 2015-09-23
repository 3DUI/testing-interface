requirejs(["dist/logger", "dist/uuid", "dist/before_unload", "dist/generate_task", "Keypress", "dist/experimental_pipeline", "three"], function(Logger, generateUUID, BeforeUnloadController, GenerateTask, Keypress, ExperimentalPipeline, THREE){
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

    function eulerToQuat(euler){
        console.log("CONVERTING", euler);
    }

    var urls = ["tasks/mixed_tasks.json"]
    for(var i = 0; i < urls.length; i++){
        var url = urls[i];

        $.getJSON(url, function(data) {
            for(var group = 0; group < data.length; group++){
                for(var index = 0; index < data[group].length; index++){
                    var ref = data[group][index].ref_orientation;
                    if(ref){
                        var euler = new THREE.Euler(ref[0], ref[1], ref[2]);
                        var quaternion = new THREE.Quaternion();
                        quaternion.setFromEuler(euler);
                        quaternion.normalize();
                        console.log(group + "_" + index + ": [" + quaternion.x + "," + quaternion.y + "," + quaternion.z + "," + quaternion.w + "]");
                    }
                }
            }
        });
    }
});

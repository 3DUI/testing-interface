requirejs(["dist/logger", "dist/capture_participant_details", "dist/uuid", "dist/before_unload", "dist/generate_task","dist/pipeline","dist/rotating_models","dist/confirm_ready", "jquery", "dist/render_manual", "dist/final_screen", "Keypress", "dist/mrt_1", "dist/mrt_2", "dist/mrt_test"], function(Logger, CaptureParticipantDetails, generateUUID, BeforeUnloadController, GenerateTask, Pipeline, RotatingModels, ConfirmReady, $, RenderManual, FinalScreen, Keypress, MRT1, MRT2, MRTTest){
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
   // addManual("documentation/experiment.md");
    Pipeline.add(MRT1);
    Pipeline.add(MRT2);
    addManual("documentation/mrt_instructions.md");
    Pipeline.add(MRTTest);
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

    var listener = new Keypress.Listener();
    listener.simple_combo("shift r", function() {
        window.log.debug("Report issued"); // TODO: have this be more comprehensive
    });
});

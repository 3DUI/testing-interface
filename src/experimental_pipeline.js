define(["dist/capture_participant_details", "dist/pipeline","dist/rotating_models","dist/confirm_ready", "dist/render_manual", "dist/final_screen", "dist/mrt_1", "dist/mrt_2", "dist/mrt_test", "dist/sus", "dist/reset_page", "dist/experiment_design", "dist/local_object"], function(CaptureParticipantDetails, Pipeline, RotatingModels, ConfirmReady, RenderManual, FinalScreen, MRT1, MRT2, MRTTest, SUS, ResetPage, ExperimentDesign, LocalObject){
    function ExperimentalPipeline(){
        this.pipeline = new Pipeline("pipeline", FinalScreen, ResetPage, false);
        this.pipeline.add(CaptureParticipantDetails);
        this.addManual("documentation/experiment.md");
        this.pipeline.add(MRT1);
        this.pipeline.add(MRT2);
        this.addManual("documentation/mrt_instructions.md");
        this.pipeline.add(MRTTest);
        this.addManual("documentation/controllers.md");
        for(var i = 0; i < 3; i++){
            this.addControllerManual(i);
            this.addExperiment(i, 
                {title: "Training",
                 taskUrl:"tasks/training_tasks.json",
                 limit: 10000});
            this.addConfirmation(i);
            this.addExperiment(i, 
                {title: "Evaluation",
                 taskUrl:"tasks/mixed_tasks.json",
                 limit: undefined});
           this.addSUS(i);
        }
    }

    ExperimentalPipeline.prototype.start = function(){
        this.pipeline.start();
    }

    ExperimentalPipeline.prototype.currentExperiment = function(){
        var partipantNumber = new LocalObject("participant_number"),
            num = partipantNumber.get("val");
        if(num === undefined){
            return num;
        }
        return ExperimentDesign(num);
    }

    ExperimentalPipeline.prototype.addExperiment = function(index, experimentConfig){
        var that = this;
        (function(experimentIndex, config){
            that.pipeline.add(function(callback){
                var experiment = that.currentExperiment(),
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

    ExperimentalPipeline.prototype.addConfirmation = function(i){
        var that = this;
        (function(index){
            that.pipeline.add(function(callback){
               ConfirmReady(that.currentExperiment().controllers[index], callback);   
            });
        })(i);
    }

    ExperimentalPipeline.prototype.addControllerManual = function(i){
        var that = this;
        var manual = {
            discrete: "documentation/discrete.md",
            twoaxis: "documentation/two_axis.md",
            arcball: "documentation/arcball.md"
        };
        (function(index){
            that.pipeline.add(function(callback){
                var controllerName = that.currentExperiment().controllers[index],
                    manualUrl = manual[controllerName];
                $.get(manualUrl, function( data ) {
                   RenderManual(data, callback); 
                });
            });
        })(i);
    }

    ExperimentalPipeline.prototype.addManual = function(manualUrl){
        this.pipeline.add(function(callback){
            $.get(manualUrl, function(data){
                RenderManual(data, callback);
            });
        });
    }

    ExperimentalPipeline.prototype.addSUS = function(i){
        var that = this;
        (function(index){
            that.pipeline.add(function(callback){
                var controllerName = that.currentExperiment().controllers[index];
                SUS(controllerName, callback);
            });
        })(i);
    }
    console.log(ExperimentalPipeline);

    return ExperimentalPipeline;
});

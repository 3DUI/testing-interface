"use strict";

define(function () {
    return function (num) {
        var controllerOptions = [["discrete", "twoaxis", "arcball"], ["discrete", "arcball", "twoaxis"], ["twoaxis", "discrete", "arcball"], ["twoaxis", "arcball", "discrete"], ["arcball", "discrete", "twoaxis"], ["arcball", "twoaxis", "discrete"]],
            modelOptions = [["models/mrt_model.json", "models/mrt_model_16a.json", "models/mrt_model_23a.json"], ["models/mrt_model.json", "models/mrt_model_23a.json", "models/mrt_model_16a.json"], ["models/mrt_model_16a.json", "models/mrt_model.json", "models/mrt_model_23a.json"], ["models/mrt_model_16a.json", "models/mrt_model_23a.json", "models/mrt_model.json"], ["models/mrt_model_23a.json", "models/mrt_model.json", "models/mrt_model_16a.json"], ["models/mrt_model_23a.json", "models/mrt_model_16a.json", "models/mrt_model.json"]],
            controllerChoiceNum = num % controllerOptions.length,
            modelChoiceNum = Math.floor(num / modelOptions.length) % modelOptions.length,
            controllerChoice = controllerOptions[controllerChoiceNum],
            modelChoice = modelOptions[modelChoiceNum],
            experimentSpec = {
            controllerGroup: controllerChoiceNum,
            controllers: controllerChoice,
            modelGroup: modelChoiceNum,
            models: modelChoice
        };

        return experimentSpec;
    };
});
//# sourceMappingURL=experiment_design.js.map

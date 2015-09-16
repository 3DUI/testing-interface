"use strict";

define(["dist/rotating_models", "dist/confirm_ready"], function (RotatingModels, ConfirmReady) {
    return function (name, experiment, callback) {
        ConfirmReady(name, function () {
            RotatingModels(callback, experiment);
        });
    };
});
//# sourceMappingURL=experiment_task.js.map

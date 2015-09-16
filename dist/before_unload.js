"use strict";

define(function () {
    var BeforeUnloadController = {
        stopUnload: function stopUnload() {
            window.onbeforeunload = function () {
                return "Closing this window may result in losing experimental results. Are you sure you want to exit?";
            };
        },

        allowUnload: function allowUnload() {
            window.onbeforeunload = null;
        }
    };
    return BeforeUnloadController;
});
//# sourceMappingURL=before_unload.js.map

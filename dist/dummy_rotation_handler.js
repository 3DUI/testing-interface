"use strict";

define(function () {
    return { "new": function _new(model) {
            var Controller = {
                model: model,
                updateRotation: function updateRotation(mouseX, mouseY, dim) {},

                startRotation: function startRotation(initialMousePos, dim) {},

                cursorType: function cursorType(mouseX, mouseY, dim) {
                    return null;
                },

                endRotation: function endRotation() {}
            };
            return Controller;
        } };
});
//# sourceMappingURL=dummy_rotation_handler.js.map

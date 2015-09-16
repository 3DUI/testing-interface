// TODO: absorb into experimental_ui
"use strict";

define(["jquery"], function ($) {
    return function (title, task, i, totalTasks, methodOfRotationName) {
        var explanation;
        $("#header-tasks").html(title + ": " + methodOfRotationName + " controller, Task " + (i + 1) + " of " + totalTasks);
        if (task.type == "orientation") {
            explanation = "Orientation Task: Rotate the object on the right to match the object on the left";
        } else if (task.type == "inspection") {
            explanation = "Inspection Task: Rotate the object until the black circle is on the red patch";
        }
        $("#header-explanation").html(explanation);
    };
});
//# sourceMappingURL=user_feedback.js.map

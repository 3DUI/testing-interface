// TODO: absorb into experimental_ui
"use strict";

define(["jquery"], function ($) {
    return function (title, task, i, totalTasks, methodOfRotationName) {
        var explanation;
        $("#header-tasks").html(title + ": " + methodOfRotationName + " controller, Task " + (i + 1) + " of " + totalTasks);
        if (task.type == "orientation") {
            explanation = "Orientation Task: Rotate the object on the right to match the object on the left";
        } else if (task.type == "inspection") {
            explanation = "Inspection Task: Rotate the object until you find the side containing only 'i'. Then, position the red circle is over the dot of the 'i'.";
        }
        $("#header-explanation").html(explanation);
    };
});
//# sourceMappingURL=user_feedback.js.map

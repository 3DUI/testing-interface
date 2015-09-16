// TODO: absorb into experimental_ui
define(["jquery"], function($){
    return function(title, task, i, totalTasks, methodOfRotationName){
        var explanation;
        $("#header-tasks").html(title + ": " + methodOfRotationName + " controller, Task " + (i + 1) + " of " + totalTasks);
        if(task.type == "orientation"){
            explanation = "Orientation Task: Rotate the object on the right to match the object on the left";
        } else if(task.type == "inspection"){
            explanation = "Inspection Task: Rotate the object until you find the side containing only 'i'. Then, position the red circle is over the dot of the 'i'. Do not worry about clockwise orientation.";
        }
        $("#header-explanation").html(explanation);
    };
});

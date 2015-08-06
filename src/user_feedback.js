define(["jquery"], function($){
    return function(i, tasks, methodOfRotationName){
        var task = tasks[i],
            explanation;
        $("#header-tasks").html(methodOfRotationName + " controller, Task " + (i + 1) + " of " + tasks.length);
        if(task.type == "orientation"){
            explanation = "Orientation Task: Rotate the object on the right to match the object on the left";
        } else if(task.type == "inspection"){
            explanation = "Inspection Task: Rotate the object until you find the red patch.";
        }
        $("#header-explanation").html(explanation);
    };
});

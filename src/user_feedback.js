define(["jquery"], function($){
    return function(i, tasks, methodOfRotationName){
        var task = tasks[i],
            explanation;
        $("#header-tasks").html("Task " + (i + 1) + " of " + tasks.length);
        if(task.type == "orientation"){
            explanation = "Rotate the object on the right to match the object on the left";
        } else if(task.type == "inspection"){
            explanation = "Rotate the object until you find the red patch.";
        }
        $("#header-explanation").html(explanation);
        $("#header-rotation-method").html("Controller: " + methodOfRotationName);
    };
});

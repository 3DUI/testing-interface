define(["dist/name_map", "dist/next_screen"], function(NameMap, NextScreen){
    return function(name, callback){
        var headerText = "Start the evaluation?",
            buttonText = "Confirm",
            text = "Are you ready to start the evaluation of " + NameMap(name) +"? Once you click confirm, the evaluation will start immediately. \n Please complete all tasks quickly and accurately.";
        NextScreen(headerText, text, buttonText, callback)
    }
});

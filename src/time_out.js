define(["dist/next_screen"], function(NextScreen){
    return function(callback){
        var headerText = "Time's up!",
            buttonText = "Continue",
            text = "The timer for this stage has completed. Please press the button below when you are ready to continue to the next stage";
        NextScreen(headerText, text, buttonText, callback)
    }
});

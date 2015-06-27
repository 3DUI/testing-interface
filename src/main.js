requirejs(["src/logger", "src/rotating_models"], function(Logger, RotatingModels){
    Logger.header = "3DUI";
    window.log = Logger;
    RotatingModels();
});

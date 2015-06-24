requirejs(["src/logger", "src/changing_cubes"], function(Logger, ChangingCubes){
    Logger.header = "3DUI";
    window.log = Logger;
    ChangingCubes();
});

define(function(){
    return function(name){
        return {
            discrete: "Discrete Sliders",
            twoaxis:  "Two Axis Valuator",
            arcball: "Arcball"}[name];
    };
});

define(function(){
    function Pipeline(){
    
    }
    Pipeline.prototype.index = -1;
    Pipeline.prototype.nodes = [];
    Pipeline.prototype.finalNode = null;
    Pipeline.prototype.add = function(runFn){
        var that = this;
        this.nodes.push(function(){
            runFn(function(){that.runNext()});
        });
    };

    Pipeline.prototype.runNext = function(){
        var node = this.nodes[++this.index];
        if(node){
            node();
        } else {
            this.finalNode();
        }
    };
    console.log("pipeline", Pipeline);
    return Pipeline;
});

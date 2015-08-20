define(function(){
    return {
        nodes: [],
        /**
         * Takes a function which accepts one argument - a callback, to be called when the function has finished running
         */
        add: function(runFn){
            var that = this;
            this.nodes.push(function(){
                runFn(function(){that.runNext()});
            });
        },
        runNext: function(){
            var node = this.nodes.shift();
            node();
        }
    };
});

define(["jquery"], function($){
    return function(domElement){
        var MouseInputBus = {
            consumersForAction: {"all":{}, "move":{}, "down":{}, "up":{}, "mousewheel":{}},
            verbose: false,
            publishActionFn: function(name){
                var that = this;
                return function(event){
                    var context = this;
                    return that.publishAction(name, event, context);
                };
            },
            publishAction: function(name, event, context){
                var consumers = [];
                var keys = [name, "all"];
                if(this.verbose){
                    window.log.debug("Fired event", event, "with name", name, "and context" + context);
                }
                for(var i = 0; i < keys.length; i++){
                    var consumersObject = this.consumersForAction[keys[i]];
                    for(var key in consumersObject){
                        if(consumersObject.hasOwnProperty(key)){
                            consumers.push(consumersObject[key]);
                        }
                    }
                }

                event.actualX = event.pageX - $(domElement).offset().left;
                event.actualY = event.pageY - $(domElement).offset().top;

                for(i = 0; i < consumers.length; i++){
                    consumers[i](name, event);
                }
            },
            registerConsumer: function(name, key, consumer){
                this.consumersForAction[name][key] = consumer;
            },
            deregisterConsumer: function(name, key){
                if(key in this.consumersForAction[name]){
                    delete this.consumersForAction[name][key];
                    return true;
                }
                return false;
            }
        };

        $("body").mousemove(MouseInputBus.publishActionFn("move"));
        $("body").mousedown(MouseInputBus.publishActionFn("down"));
        $("body").mouseup(MouseInputBus.publishActionFn("up"));
        
        return MouseInputBus;
    };
});

define(["jquery"], function($){
    return function(domElement){
        var ELM = $("body");
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
                var consumers = this.getConsumers(name);
                if(this.verbose){
                    window.log.debug("Fired event", event, "with name", name, "and context" + context);
                }

                event.actualX = event.pageX - $(domElement).offset().left;
                event.actualY = event.pageY - $(domElement).offset().top;

                for(var i = 0; i < consumers.length; i++){
                    consumers[i](name, event);
                }
            },
            getConsumers: function(name){
                var consumers = [];
                var keys = [name, "all"];
                for(var i = 0; i < keys.length; i++){
                    var consumersObject = this.consumersForAction[keys[i]];
                    for(var key in consumersObject){
                        if(consumersObject.hasOwnProperty(key)){
                            consumers.push(consumersObject[key]);
                        }
                    }
                }
                return consumers;
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
            },
            deregisterAllConsumers: function(){
                for(var name in this.consumersForAction){
                    if(this.consumersForAction.hasOwnProperty(name)){
                        var consumerGroup = this.consumersForAction[name];
                        for(var key in consumerGroup){
                            if(consumerGroup.hasOwnProperty(key)){
                                this.deregisterConsumer(name, key)
                            }
                        }
                    }
                }
            },
            removeMouseEvents: function(){
                ELM.off('mousemove');
                ELM.off('mousedown');
                ELM.off('mouseup');
            },
            teardown: function(){
                this.deregisterAllConsumers();
                this.removeMouseEvents();
            },
        };

        ELM.mousemove(MouseInputBus.publishActionFn("move"));
        ELM.mousedown(MouseInputBus.publishActionFn("down"));
        ELM.mouseup(MouseInputBus.publishActionFn("up"));
        
        return MouseInputBus;
    };
});

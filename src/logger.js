define(function(){
    var LOCAL_STORAGE_KEY = "logger_log_key_3dui";
    var Logger = {
        header: "",
        meta: {},
        priorityToName: {0: "debug", 
                         1: "info",
                         2: "warn",
                         3: "error"},
                         
        debug: function(){this.log(0, arguments);},
        info: function(){this.log(1, arguments);},
        warn: function(){this.log(2, arguments);},
        error: function(){this.log(3, arguments);},

        argsToArray: function(arr, args){
            for(var i = 0; i < args.length; i++){
                arr.push(args[i]);
            }
            return arr;
        },

        log: function(priority, logArguments) {
            var logMsg = this.header + " - " + this.priorityToName[priority];
            console.log.apply(console, this.argsToArray([logMsg], arguments));
        },

        getRawSavedLogs: function(){
            return localStorage.getItem(LOCAL_STORAGE_KEY);
        },

        getSavedLogs: function() {
            return JSON.parse(this.getRawSavedLogs()) || [];
        },

        clearLogs: function(){
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
        },

        saveLog: function() {
           var logs = this.getSavedLogs(),
               msgComponents = this.argsToArray([this.header, new Date(), this.meta], arguments);
           this.debug("Saving",msgComponents);
           logs.push(msgComponents);
           localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs));
        },

        outputSavedLogs: function() {
            var logs = this.getSavedLogs();
            for(var i = 0; i < logs.length; i++){
                console.log(logs[i]);            
            }
        }
    };
    return Logger;
});

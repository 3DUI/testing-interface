"use strict";

define(function () {
    var LOCAL_STORAGE_KEY = "logger_log_key_3dui";
    var Logger = {
        header: "",
        meta: {},
        priorityToName: { 0: "debug",
            1: "info",
            2: "warn",
            3: "error" },

        debug: function debug() {
            this.log(0, arguments);
        },
        info: function info() {
            this.log(1, arguments);
        },
        warn: function warn() {
            this.log(2, arguments);
        },
        error: function error() {
            this.log(3, arguments);
        },

        argsToArray: function argsToArray(arr, args) {
            for (var i = 0; i < args.length; i++) {
                arr.push(args[i]);
            }
            return arr;
        },

        log: function log(priority, logArguments) {
            var logMsg = this.header + " - " + this.priorityToName[priority];
            console.log.apply(console, this.argsToArray([logMsg], arguments));
        },

        getRawSavedLogs: function getRawSavedLogs() {
            return localStorage.getItem(LOCAL_STORAGE_KEY);
        },

        getSavedLogs: function getSavedLogs() {
            return JSON.parse(this.getRawSavedLogs()) || [];
        },

        clearLogs: function clearLogs() {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
        },

        saveLog: function saveLog() {
            var logs = this.getSavedLogs(),
                msgComponents = this.argsToArray([this.header, new Date(), this.meta], arguments);
            this.debug("Saving", msgComponents);
            logs.push(msgComponents);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs));
        },

        outputSavedLogs: function outputSavedLogs() {
            var logs = this.getSavedLogs();
            for (var i = 0; i < logs.length; i++) {
                console.log(logs[i]);
            }
        }
    };
    return Logger;
});
//# sourceMappingURL=logger.js.map

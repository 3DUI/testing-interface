define(function(){
        // Based off of code from StackOverflow [1]. Propertedly RFC4122 compliant.
        // [1] Community Wiki: Briguy37 (http://stackoverflow.com/users/508537). Create GUID / UUID in JavaScript?. URL (retrieved: 2015-07-21): http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
        return function(){
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
            return uuid;
        };
});

define(["dist/mini_daemon", "jquery"], function(MiniDaemon, $){
    function Timer(divId){
      if (!(this && this instanceof Timer)) { throw "Did not instantiate timer object"; }
      this.divId = divId;
      this.div = $(divId);
      this.rate = 100;
      this.time = 0;
      this.daemon = null;
    }

    Timer.prototype.writeTime = function(timeInMilli){
        var seconds = Math.floor((timeInMilli/1000) % 60);
        var minutes = Math.floor((timeInMilli/60000) % 60);
        this.div.html("Time taken: " + this.formatTime(minutes) + ":" + this.formatTime(seconds));
    };

    Timer.prototype.callback = function(index, length, backwards){
        var timeInMilli = index * this.rate;
        this.time = timeInMilli;
        this.writeTime(timeInMilli);
    };

    Timer.prototype.restart = function(){
        this.stop();
        this.start();
    };

    Timer.prototype.formatTime = function(val){
        if(val < 10){
            return "0" + val;
        }
        return "" + val;
    };

    Timer.prototype.start = function(){
        if(!this.daemon){
            this.daemon = new MiniDaemon(this, this.callback, this.rate);
            this.time = 0;
        }
        this.daemon.start();
    };

    Timer.prototype.pause = function(){
        this.daemon.pause();
    };

    Timer.prototype.stop = function(){
        this.daemon.pause();
        this.daemon = null;
    };
    return Timer;
});

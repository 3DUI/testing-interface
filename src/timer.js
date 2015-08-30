define(["dist/mini_daemon", "jquery"], function(MiniDaemon, $){
    function Timer(divId, limit, callback){
      if (!(this && this instanceof Timer)) { throw "Did not instantiate timer object"; }
      this.divId = divId;
      this.div = $(divId);
      this.rate = 100;
      this.time = 0;
      this.limit = limit;
      this.limitCallback = callback;
      this.daemon = null;
    }

    Timer.prototype.writeTime = function(timeInMilli){
        var seconds,
            minutes,
            header;
        
        if(this.limit){
            header = "Time left: "
            timeInMilli = this.limit - timeInMilli;
        } else { 
            header = "Time taken: "
        }
        seconds = Math.floor((timeInMilli/1000) % 60);
        minutes = Math.floor((timeInMilli/60000) % 60);
        this.div.html(header + this.formatTime(minutes) + ":" + this.formatTime(seconds));
    };

    Timer.prototype.callback = function(index, length, backwards){
        var timeInMilli = index * this.rate;
        this.time = timeInMilli;
        this.writeTime(timeInMilli);
        if(this.limit && this.limitCallback){
            if(this.time > this.limit){
                this.limitCallback();
                this.stop();
            }
        }
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
        if(this.daemon){
            this.daemon.pause();
            return true;
        } else {
            return false;
        }
    };

    Timer.prototype.stop = function(){
        if(this.daemon){
            this.daemon.pause();
            this.daemon = null;
            return true;
        } else {
            return false;
        }
    };
    return Timer;
});

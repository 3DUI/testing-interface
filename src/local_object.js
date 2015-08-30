define(function(){
    function LocalObject(id, overwrite){
      if (!(this && this instanceof LocalObject)) { return; }
      if (arguments.length < 1) { throw new TypeError("LocalObject - not enough arguments"); }
      this.id = id;
      if(overwrite){
        this.clear();
      } else {
        var fetchedItem = this.fetch();
        if(fetchedItem){
            this.object = fetchedItem;
        } else {
            this.object = {};
        }
      }
    }

    LocalObject.prototype.key = function(){
        return "local_object_3dui_object" + id;
    }

    LocalObject.prototype.fetch = function(){
        var item = localStorage.getItem(this.key());        
        if(!item){
            return item;
        }
        return JSON.parse(item);
    }

    LocalObject.prototype.write = function(){
        return localStorage.setItem(this.key(), JSON.stringify(this.object));
    }

    LocalObject.prototype.clear = function(){
        this.object = {};
        return this.write();
    }

    LocalObject.prototype.get = function(prop){
        return this.object[prop];
    }

    LocalObject.prototype.set = function(prop, val){
        this.object[prop] = val;
        return this.write(); // TODO: see if this is a performance problem
    }

    return LocalObject;
});

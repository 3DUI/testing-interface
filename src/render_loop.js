define(["three"], function(THREE){
    return {
        // Instance variables
        init: function(size, domElement){
            this.domElement = domElement;
            this.size = size;

            this.views = {};
            this.rendering = false;
            this.animationFrameId = null; // set on start

            this.renderer = new THREE.WebGLRenderer(); 
            this.updateSize();
            this.domElement.appendChild( this.renderer.domElement );
        },

        // Add and remove views from being rendered. A view is anything
        // with a render method that takes a renderer, a width and a height
        addView: function(name, renderer){
            this.views[name] = renderer;
        },

        removeView: function(name){
            if(this.views.hasOwnProperty(name)){
                delete this.views[name];
                return true;
            }
            return false;
        },

        // Update the size of the renderer
        updateSize: function(){
            var size = [(this.size.widthScale * window.innerWidth) - this.size.widthOffset, 
                        (this.size.heightScale * window.innerHeight) - this.size.heightOffset];
            this.renderer.setSize(size[0], size[1]);
            return size;
        },
        
        // Start and stop rendering
        start: function(){
            this.rendering = true;
            var that = this;
            var render = function(){
                if(that.rendering){
                    var size = that.updateSize();
                    that.animationFrameId = requestAnimationFrame(render);
                    for(var viewName in that.views){
                        if(that.views.hasOwnProperty(viewName)){
                            that.views[viewName].render(that.renderer, size[0], size[1]);
                        }
                    }
                }
            };
            render();
        },

        stop: function(){
            this.rendering = false;
            cancelAnimationFrame(this.animationFrameId);
        }
    };
});

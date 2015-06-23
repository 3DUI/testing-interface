define(function(){
    return {
        // Build objects needed
        buildRenderer: function(updateSizeFn){
            var renderer = new THREE.WebGLRenderer(),
                size = updateSizeFn();
            renderer.setSize(size[0], size[1]);
            return renderer;
        },
        buildUpdateSizeFn: function(widthScale, heightScale, widthOffset, heightOffset){
            return function(){
                return [(widthScale * window.innerWidth) - widthOffset, 
                        (heightScale * window.innerHeight) - heightOffset];
            }
        },

        // Instance variables

        init: function(updateSizeFn, domElement){
            this.domElement = domElement;
            this.updateSizeFn = updateSizeFn

            this.views = {};
            this.rendering = false;

            this.renderer = this.buildRenderer(this.updateSizeFn)
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
            var size = this.updateSizeFn();
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
                    requestAnimationFrame(render);
                    for(viewName in that.views){
                        if(that.views.hasOwnProperty(viewName)){
                            that.views[viewName].render(that.renderer, size[0], size[1]);
                        }
                    }
                }
            }
            render();
        },

        stop: function(){
            this.rendering = false;
        }
    }
});

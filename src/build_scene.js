define(["three"], function(THREE){
    return {new: function(){
        return {
            // Initialize a scene
            init: function(view, controller){
                // Instance variables
                this.controller = controller;

                // Initialise the required elements
                this.changeView(view);
                this.scene = new THREE.Scene();
                this.camera = new THREE.PerspectiveCamera( 75, 4/3, 0.1, 1000 ); 

                // Initialise the environment using the controller
                this.controller.init(this.scene, this.camera);
            },

            // Update instance variables
            changeView: function(view){
                this.view = view;
            },

            updateSize: function(rendererWidth, rendererHeight){
                var size = [this.view.width * rendererWidth, this.view.height * rendererHeight];
                var width = size[0];
                var height = size[1];

                this.camera.aspect = width/height;
                this.camera.updateProjectionMatrix();

                return size;
            },

            // Control what is rendered
            render: function(renderer, rendererWidth, rendererHeight){
                var size = this.updateSize(rendererWidth, rendererHeight),
                    width = size[0],
                    height = size[1],
                    left = rendererWidth * this.view.left,
                    bottom = rendererHeight * this.view.bottom;

                this.controller.render(this.scene, this.camera);
                renderer.setClearColor(this.view.background);
                renderer.setViewport( left, bottom, width, height );
                renderer.setScissor( left, bottom, width, height );
                renderer.enableScissorTest ( true );
                renderer.render(this.scene, this.camera);
            },
        }
    }}
});

"use strict";

define(["three"], function (THREE) {
    return { "new": function _new() {
            return {
                // Initialize a scene
                init: function init(view, controller) {
                    // Instance variables
                    this.controller = controller;

                    // Initialise the required elements
                    this.changeView(view);
                    this.scene = new THREE.Scene();
                    this.camera = new THREE.PerspectiveCamera(75, 4 / 3, 0.1, 1000);
                    this.light = new THREE.DirectionalLight(0xffffff, 1);

                    var light = new THREE.AmbientLight(0x404040); // soft white light
                    this.scene.add(light);

                    // Initialise the environment using the controller
                    this.controller.init(this.scene, this.camera, this.light);
                },

                // Update instance variables
                changeView: function changeView(view) {
                    this.view = view;
                },

                updateSize: function updateSize(rendererWidth, rendererHeight) {
                    var size = [this.view.width * rendererWidth, this.view.height * rendererHeight];
                    var width = size[0];
                    var height = size[1];

                    this.camera.aspect = width / height;
                    this.camera.updateProjectionMatrix();

                    return size;
                },

                // Control what is rendered
                render: function render(renderer, rendererWidth, rendererHeight) {
                    var size = this.updateSize(rendererWidth, rendererHeight),
                        width = size[0],
                        height = size[1],
                        left = rendererWidth * this.view.left,
                        bottom = rendererHeight * this.view.bottom,
                        dimensions = {
                        view: this.view,
                        renderer: {
                            width: rendererWidth,
                            height: rendererHeight
                        },
                        scene: {
                            width: width,
                            height: height,
                            left: left,
                            bottom: bottom
                        }
                    };
                    this.controller.render(this.scene, this.camera, dimensions);
                    this.scene.updateMatrixWorld(true);
                    renderer.setClearColor(this.view.background);
                    renderer.setViewport(left, bottom, width, height);
                    renderer.setScissor(left, bottom, width, height);
                    renderer.enableScissorTest(true);
                    renderer.render(this.scene, this.camera);
                }
            };
        } };
});
//# sourceMappingURL=build_scene.js.map

"use strict";

define(["three", "dist/build_scene", "dist/model_rotation_controller"], function (THREE, SceneBuilder, ModelController) {
    return function () {
        return {
            materialsCallback: function materialsCallback(materials) {
                return materials;
            },
            setId: function setId(id) {
                this.loopId = id;return this;
            },
            setModelUrl: function setModelUrl(modelUrl) {
                this.modelUrl = modelUrl;return this;
            },
            setInputBus: function setInputBus(inputBus) {
                this.inputBus = inputBus;return this;
            },
            setRotationBuilder: function setRotationBuilder(rotationBuilder) {
                this.rotationBuilder = rotationBuilder;return this;
            },
            setView: function setView(view) {
                this.view = view;return this;
            },
            setRenderLoop: function setRenderLoop(renderLoop) {
                this.renderLoop = renderLoop;return this;
            },
            fields: function fields() {
                return {
                    "loopId": this.loopId,
                    "modelUrl": this.modelUrl,
                    "inputBus": this.inputBus,
                    "rotationBuilder ": this.rotationBuilder,
                    "view": this.view,
                    "renderLoop": this.renderLoop
                };
            },
            build: function build(callback) {
                var fields = this.fields();
                for (var key in fields) {
                    if (fields.hasOwnProperty(key)) {
                        var value = fields[key];
                        if (value === undefined) {
                            window.log.error("Not all fields defined in Build Rotation Scene", this.fields());
                            throw new Error("Not all fields defined.");
                        }
                    }
                }

                var that = this;
                var loader = new THREE.JSONLoader();
                loader.load(this.modelUrl, function (geometry, materials) {
                    window.log.debug(materials);
                    var material = new THREE.MeshFaceMaterial(that.materialsCallback(materials)),
                        model = new THREE.Mesh(geometry, material),
                        controller = ModelController["new"](that.loopId, model, that.inputBus, that.rotationBuilder),
                        sceneBuilder = SceneBuilder["new"]();
                    sceneBuilder.init(that.view, controller);
                    that.renderLoop.addView(that.loopId, sceneBuilder);
                    if (callback) {
                        callback(controller);
                    }
                });
            }
        };
    };
});
//# sourceMappingURL=build_rotation_scene.js.map

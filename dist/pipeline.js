"use strict";

define(["dist/local_object"], function (LocalObject) {
    function Pipeline(id, finalNode, resetPage, overwrite) {
        this.id = id;
        this.finalNode = finalNode;
        this.resetPage = resetPage;
        this.indexObj = new LocalObject(this.id, overwrite);
    }
    Pipeline.prototype.nodes = [];
    Pipeline.prototype.add = function (runFn) {
        var that = this;
        this.nodes.push(function () {
            runFn(function () {
                that.runNext();
            });
        });
    };

    Pipeline.prototype.start = function () {
        var that = this;
        if (this.indexObj.get("index") === undefined) {
            this.run(0);
        } else {
            var index = that.indexObj.get("index");
            if (index === 0) {
                this.run(0);
            } else {
                this.resetPage(function (reset) {
                    if (reset) {
                        that.run(0);
                    } else {
                        that.run(index);
                    }
                });
            }
        }
    };

    Pipeline.prototype.runNext = function () {
        var index = this.indexObj.get("index") + 1;
        this.run(index);
    };

    Pipeline.prototype.run = function (index) {
        window.log.saveLog("running pipeline index", index);
        window.log.meta.pipeline_index = index;
        this.indexObj.set("index", index);
        var node = this.nodes[index];
        if (node) {
            node();
        } else {
            this.finalNode();
            this.indexObj = new LocalObject(this.id, true);
        }
    };
    console.log("pipeline", Pipeline);
    return Pipeline;
});
//# sourceMappingURL=pipeline.js.map

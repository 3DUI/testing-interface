"use strict";

define(function () {
    return {
        random_angle: function random_angle() {
            return Math.random() * Math.PI * 2;
        },
        random_orientation: function random_orientation() {
            return [this.random_angle(), this.random_angle(), this.random_angle()];
        },
        orientation_matching: function orientation_matching() {
            return JSON.stringify({
                "type": "orientation",
                "model": "models/mrt_model.json",
                "desc": "generated_task",
                "ref_orientation": this.random_orientation(),
                "player_orientation": [0, 0, 0]
            });
        },
        inspection: function inspection() {
            return JSON.stringify({
                "type": "inspection",
                "model": "models/ico_sphere_model.json",
                "desc": "generated_task",
                "player_orientation": this.random_orientation()
            });
        }
    };
});
//# sourceMappingURL=generate_task.js.map

define(function(){
    return {
        random_angle: function(){
            return Math.random()*Math.PI*2;
        },
        random_orientation: function(){
           return [this.random_angle(), this.random_angle(), this.random_angle()]; 
        },
        orientation_matching: function(){
            return JSON.stringify({
                "type": "orientation",
                "model": "models/mrt_model.json",
                "desc": "generated_task",
                "ref_orientation": this.random_orientation(),
                "player_orientation": [0, 0, 0]
            });
        },
        inspection: function(){
            return JSON.stringify({
                "type": "inspection",
                "model": "models/ico_sphere_model.json",
                "desc": "generated_task",
                "player_orientation": this.random_orientation(),
            });
        },
    };
});
